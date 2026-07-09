import { Request, Response } from 'express';
import Property from '../../models/property.model';
import { IProperty } from '../../models/property.model';
import cloudinary from '../../services/cloudinaryClient';
import { Readable } from 'stream';

const useCloudinary = process.env.USE_CLOUDINARY === 'true';

const uploadFileToCloudinary = async (
  file: Express.Multer.File,
  folder: string = 'suits-and-sand/properties'
): Promise<string> => {
  const resourceType = file.mimetype?.startsWith('image/') ? 'image' : 'raw';

  return await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        timeout: 180000,
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          return reject(error || new Error('Cloudinary upload failed'));
        }
        resolve(result.secure_url);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

const uploadAsset = async (file: Express.Multer.File): Promise<string> => {
  if (useCloudinary) return uploadFileToCloudinary(file);
  return file.path;
};

// Utility parsers
const safeParseArray = (input: any, fallback: any = []) => {
  try {
    if (!input || input === 'undefined') return fallback;
    return JSON.parse(input);
  } catch (err) {
    return fallback;
  }
};

const safeParseObject = (input: any, fallback: any = {}) => {
  try {
    if (!input || input === 'undefined') return fallback;
    return JSON.parse(input);
  } catch (err) {
    return fallback;
  }
};

const sanitizeMapKey = (key: string): string => key.replace(/\./g, '·').replace(/^\$/g, '＄');

const sanitizePaymentPlansMap = (plans: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(plans || {})) {
    sanitized[sanitizeMapKey(key)] = value;
  }
  return sanitized;
};

export const createProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const {
      title,
      slug,
      area,
      price,
      mainVideoUrl,
      developer,
      type,
      location,
      layoutType,
      quarter,
      year,
      paymentPlans,
      faqs,
      amenities,
      access,
      views,
      description,
      overview,
      mapUrl,
      seoTitle,
      seoDescription,
      seoschema,
      canonicalUrl,
      status,
      featured,
      mostLuxurious,
      numFloors,
    } = req.body;

    const propertyImages = files['propertyImages'] || [];
    const brochureFile = files['brochureFile']?.[0];
    const seoImageFile = files['seoimage']?.[0];

    let imageUrls: string[] = [];
    if (propertyImages.length > 0) {
      imageUrls = await Promise.all(propertyImages.map(img => uploadAsset(img)));
    }

    let brochureUrl = '';
    if (brochureFile) {
      brochureUrl = await uploadAsset(brochureFile);
    }

    let seoImageUrl = '';
    if (seoImageFile) {
      seoImageUrl = await uploadAsset(seoImageFile);
    } else if (req.body.seoimage_existing) {
      seoImageUrl = req.body.seoimage_existing;
    }

    // Create floors Map
    const floorsMap = new Map();
    for (let i = 0; i < parseInt(numFloors); i++) {
      const defaultLayoutFile = files[`floor_${i}_defaultLayout`]?.[0];
      const selectedUnitTypes = JSON.parse(req.body[`floor_${i}_selectedUnitTypes`] || '[]');

      let defaultLayoutUrl = '';
      if (defaultLayoutFile) {
        defaultLayoutUrl = await uploadAsset(defaultLayoutFile);
      } else if (req.body[`floor_${i}_defaultLayout_existing`]) {
        defaultLayoutUrl = req.body[`floor_${i}_defaultLayout_existing`];
      }


      // Create unitImages Map for this floor
      const unitImagesMap = new Map();

      for (const unitType of selectedUnitTypes) {
        const unitImageFile = files[`floor_${i}_unit_${unitType.replace(/\s/g, '_')}`]?.[0];

        if (unitImageFile) {
          const unitImageUrl = await uploadAsset(unitImageFile);

          // Handle unit variants if they exist
          const unitVariants = safeParseArray(req.body[`floor_${i}_unit_${unitType.replace(/\s/g, '_')}_variants`]);

          // Process variant images if they exist
          // Initialize processedVariants
          const processedVariants = [];

          let variantIndex = 0;
          while (true) {
            const nameKey = `floor_${i}_unit_${unitType.replace(/\s/g, '_')}_variant_${variantIndex}_name`;
            const imageKey = `floor_${i}_unit_${unitType.replace(/\s/g, '_')}_variant_${variantIndex}_image`;

            if (!(nameKey in req.body)) break;

            const variantName = req.body[nameKey];
            const variantImageFile = files[imageKey]?.[0];

            if (variantImageFile) {
              const variantImageUrl = await uploadAsset(variantImageFile);

              processedVariants.push({
                variantName: variantName,
                image: variantImageUrl,
              });
            }

            variantIndex++;
          }

          unitImagesMap.set(unitType, {
            image: unitImageUrl,
            variants: processedVariants.length > 0 ? processedVariants : undefined,
          });

        }
      }

      floorsMap.set(String(i), {
        defaultLayout: defaultLayoutUrl,
        selectedUnitTypes,
        unitImages: unitImagesMap,
      });
    }

    const newProperty: IProperty = new Property({
      title,
      slug,
      area,
      price,
      mainVideoUrl,
      developer,
      type,
      location,
      layoutType,
      images: imageUrls,
      brochureFile: brochureUrl,
      quarter,
      year,
      paymentPlans: sanitizePaymentPlansMap(safeParseObject(paymentPlans)),
      faqs: safeParseArray(faqs),
      amenities: safeParseArray(amenities),
      access: safeParseArray(access),
      views: safeParseArray(views),
      description,
      overview,
      mapUrl,
      seoTitle,
      seoDescription,
      seoImage: seoImageUrl,
      seoSchema: seoschema,
      canonicalUrl,
      status: status === 'inactive' ? 'inactive' : 'active',
      featured: featured === 'true' || featured === true,
      mostLuxurious: mostLuxurious === 'true' || mostLuxurious === true,
      numFloors,
      floors: floorsMap,
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Create Property Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProperties = async (_req: Request, res: Response): Promise<void> => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const {
      title,
      slug,
      area,
      price,
      mainVideoUrl,
      developer,
      type,
      location,
      layoutType,
      quarter,
      year,
      paymentPlans,
      faqs,
      amenities,
      access,
      views,
      description,
      overview,
      mapUrl,
      seoTitle,
      seoDescription,
      seoschema,
      canonicalUrl,
      status,
      featured,
      mostLuxurious,
      numFloors,
    } = req.body;

    const property = await Property.findById(req.params.id);
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    const propertyImages = files['propertyImages'] || [];
    const brochureFile = files['brochureFile']?.[0];
    const seoImageFile = files['seoimage']?.[0];

    let imageUrls = property.images || [];
    if (propertyImages.length > 0) {
      const uploadedImages = await Promise.all(propertyImages.map(img => uploadAsset(img)));
      imageUrls = imageUrls.concat(uploadedImages);
    }

    let brochureUrl = property.brochureFile || '';
    if (brochureFile) {
      brochureUrl = await uploadAsset(brochureFile);
    }

    let seoImageUrl = property.seoImage || '';
    if (seoImageFile) {
      seoImageUrl = await uploadAsset(seoImageFile);
    } else if (req.body.seoimage_existing) {
      seoImageUrl = req.body.seoimage_existing;
    }

    // Update floors Map
    const floorsMap = new Map();
    for (let i = 0; i < parseInt(numFloors); i++) {
      const defaultLayoutFile = files[`floor_${i}_defaultLayout`]?.[0];
      const selectedUnitTypes = JSON.parse(req.body[`floor_${i}_selectedUnitTypes`] || '[]');

      // Get existing floor data if it exists
      const existingFloor = property.floors.get(i);

      let defaultLayoutUrl = existingFloor?.defaultLayout || '';
      if (defaultLayoutFile) {
        defaultLayoutUrl = await uploadAsset(defaultLayoutFile);
      } else if (req.body[`floor_${i}_defaultLayout_existing`]) {
        defaultLayoutUrl = req.body[`floor_${i}_defaultLayout_existing`];
      }

      // Create unitImages Map for this floor
      const unitImagesMap = new Map();

      // Preserve existing unit images if they exist
      if (existingFloor?.unitImages) {
        for (const [unitType, unitImageData] of existingFloor.unitImages) {
          unitImagesMap.set(unitType, unitImageData);
        }
      }

      for (const unitType of selectedUnitTypes) {
        const unitKey = unitType.replace(/\s/g, '_');
        const unitImageFile = files[`floor_${i}_unit_${unitKey}`]?.[0];

        const existingUnitData = unitImagesMap.get(unitType) || {};

        let unitImageUrl = existingUnitData.image || '';
        if (unitImageFile) {
          unitImageUrl = await uploadAsset(unitImageFile);
        } else if (req.body[`floor_${i}_unit_${unitKey}_existing`]) {
          unitImageUrl = req.body[`floor_${i}_unit_${unitKey}_existing`];
        }


        // Process variants
        const unitVariants = safeParseArray(req.body[`floor_${i}_unit_${unitKey}_variants`]);
        const processedVariants = [];

        let variantIndex = 0;
        while (true) {
          const nameKey = `floor_${i}_unit_${unitKey}_variant_${variantIndex}_name`;
          const imageKey = `floor_${i}_unit_${unitKey}_variant_${variantIndex}_image`;

          if (!(nameKey in req.body)) break;

          const variantName = req.body[nameKey];
          const variantImageFile = files[imageKey]?.[0];

          if (variantImageFile) {
            const variantImageUrl = await uploadAsset(variantImageFile);

            processedVariants.push({
              variantName: variantName,
              image: variantImageUrl,
            });
          } else if (req.body[`${imageKey}_existing`]) {
            processedVariants.push({
              variantName: variantName,
              image: req.body[`${imageKey}_existing`],
            });
          } else {
            const previousVariants = existingUnitData?.variants || [];
            const previousVariant = previousVariants.find((v: { variantName: string }) => v.variantName === variantName)
            if (previousVariant) {
              processedVariants.push(previousVariant);
            }
          }


          variantIndex++;
        }

        unitImagesMap.set(unitType, {
          image: unitImageUrl,
          variants: processedVariants.length > 0 ? processedVariants : undefined,
        });
      }


      floorsMap.set(String(i), {
        defaultLayout: defaultLayoutUrl,
        selectedUnitTypes,
        unitImages: unitImagesMap,
      });
    }

    // Update fields
    property.title = title;
    property.slug = slug;
    property.area = area;
    property.price = price;
    property.mainVideoUrl = mainVideoUrl;
    property.developer = developer;
    property.type = type;
    if (location !== undefined) property.location = location;
    if (layoutType !== undefined) property.layoutType = layoutType;
    property.images = imageUrls;
    property.brochureFile = brochureUrl;
    property.quarter = quarter;
    property.year = year;
    property.paymentPlans = sanitizePaymentPlansMap(safeParseObject(paymentPlans));
    property.faqs = safeParseArray(faqs);
    property.amenities = safeParseArray(amenities);
    property.access = safeParseArray(access);
    property.views = safeParseArray(views);
    property.description = description;
    if (overview !== undefined) property.overview = overview;
    property.mapUrl = mapUrl;
    property.seoTitle = seoTitle;
    property.seoDescription = seoDescription;
    property.seoImage = seoImageUrl;
    property.seoSchema = seoschema;
    if (canonicalUrl !== undefined) property.canonicalUrl = canonicalUrl;
    if (status !== undefined) property.status = status === 'inactive' ? 'inactive' : 'active';
    if (featured !== undefined) property.featured = featured === 'true' || featured === true;
    if (mostLuxurious !== undefined) {
      property.mostLuxurious = mostLuxurious === 'true' || mostLuxurious === true;
    }
    property.numFloors = numFloors;
    // Merge floors: retain untouched floors
    const mergedFloors = new Map(property.floors); // clone existing floors

    for (const [floorIndex, floorData] of floorsMap.entries()) {
      mergedFloors.set(floorIndex, floorData);
    }

    property.floors = mergedFloors;


    await property.save();
    res.status(200).json(property);
  } catch (error) {
    console.error('Update Property Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const bulkDeleteProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    if (!ids.length) {
      res.status(400).json({ message: 'No property ids provided' });
      return;
    }
    await Property.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Properties deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const bulkCreateProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const properties = Array.isArray(req.body) ? req.body : req.body?.properties;
    if (!Array.isArray(properties) || !properties.length) {
      res.status(400).json({ message: 'Request body must be a non-empty array of properties.' });
      return;
    }

    const sanitized = properties.map((property: any) => ({
      ...property,
      paymentPlans: sanitizePaymentPlansMap(property?.paymentPlans || {}),
    }));

    const created = await Property.insertMany(sanitized, { ordered: false });
    res.status(201).json({
      message: 'Properties created successfully',
      count: created.length,
      properties: created,
    });
  } catch (error: any) {
    console.error('Bulk create properties error:', error);
    res.status(500).json({
      message: 'Failed to bulk create properties',
      error: error?.message || 'Unknown error',
    });
  }
};
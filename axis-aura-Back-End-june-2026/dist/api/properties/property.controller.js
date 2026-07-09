"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreateProperties = exports.bulkDeleteProperties = exports.deleteProperty = exports.updateProperty = exports.getPropertyById = exports.getProperties = exports.createProperty = void 0;
const property_model_1 = __importDefault(require("../../models/property.model"));
const cloudinaryClient_1 = __importDefault(require("../../services/cloudinaryClient"));
const stream_1 = require("stream");
const useCloudinary = process.env.USE_CLOUDINARY === 'true';
const uploadFileToCloudinary = (file_1, ...args_1) => __awaiter(void 0, [file_1, ...args_1], void 0, function* (file, folder = 'suits-and-sand/properties') {
    var _a;
    const resourceType = ((_a = file.mimetype) === null || _a === void 0 ? void 0 : _a.startsWith('image/')) ? 'image' : 'raw';
    return yield new Promise((resolve, reject) => {
        const uploadStream = cloudinaryClient_1.default.uploader.upload_stream({
            folder,
            resource_type: resourceType,
            timeout: 180000,
        }, (error, result) => {
            if (error || !(result === null || result === void 0 ? void 0 : result.secure_url)) {
                return reject(error || new Error('Cloudinary upload failed'));
            }
            resolve(result.secure_url);
        });
        stream_1.Readable.from(file.buffer).pipe(uploadStream);
    });
});
const uploadAsset = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (useCloudinary)
        return uploadFileToCloudinary(file);
    return file.path;
});
// Utility parsers
const safeParseArray = (input, fallback = []) => {
    try {
        if (!input || input === 'undefined')
            return fallback;
        return JSON.parse(input);
    }
    catch (err) {
        return fallback;
    }
};
const safeParseObject = (input, fallback = {}) => {
    try {
        if (!input || input === 'undefined')
            return fallback;
        return JSON.parse(input);
    }
    catch (err) {
        return fallback;
    }
};
const sanitizeMapKey = (key) => key.replace(/\./g, '·').replace(/^\$/g, '＄');
const sanitizePaymentPlansMap = (plans) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(plans || {})) {
        sanitized[sanitizeMapKey(key)] = value;
    }
    return sanitized;
};
const createProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const files = req.files;
        const { title, slug, area, price, mainVideoUrl, developer, type, location, layoutType, quarter, year, paymentPlans, faqs, amenities, access, views, description, overview, mapUrl, seoTitle, seoDescription, seoschema, canonicalUrl, status, featured, mostLuxurious, numFloors, } = req.body;
        const propertyImages = files['propertyImages'] || [];
        const brochureFile = (_a = files['brochureFile']) === null || _a === void 0 ? void 0 : _a[0];
        const seoImageFile = (_b = files['seoimage']) === null || _b === void 0 ? void 0 : _b[0];
        let imageUrls = [];
        if (propertyImages.length > 0) {
            imageUrls = yield Promise.all(propertyImages.map(img => uploadAsset(img)));
        }
        let brochureUrl = '';
        if (brochureFile) {
            brochureUrl = yield uploadAsset(brochureFile);
        }
        let seoImageUrl = '';
        if (seoImageFile) {
            seoImageUrl = yield uploadAsset(seoImageFile);
        }
        else if (req.body.seoimage_existing) {
            seoImageUrl = req.body.seoimage_existing;
        }
        // Create floors Map
        const floorsMap = new Map();
        for (let i = 0; i < parseInt(numFloors); i++) {
            const defaultLayoutFile = (_c = files[`floor_${i}_defaultLayout`]) === null || _c === void 0 ? void 0 : _c[0];
            const selectedUnitTypes = JSON.parse(req.body[`floor_${i}_selectedUnitTypes`] || '[]');
            let defaultLayoutUrl = '';
            if (defaultLayoutFile) {
                defaultLayoutUrl = yield uploadAsset(defaultLayoutFile);
            }
            else if (req.body[`floor_${i}_defaultLayout_existing`]) {
                defaultLayoutUrl = req.body[`floor_${i}_defaultLayout_existing`];
            }
            // Create unitImages Map for this floor
            const unitImagesMap = new Map();
            for (const unitType of selectedUnitTypes) {
                const unitImageFile = (_d = files[`floor_${i}_unit_${unitType.replace(/\s/g, '_')}`]) === null || _d === void 0 ? void 0 : _d[0];
                if (unitImageFile) {
                    const unitImageUrl = yield uploadAsset(unitImageFile);
                    // Handle unit variants if they exist
                    const unitVariants = safeParseArray(req.body[`floor_${i}_unit_${unitType.replace(/\s/g, '_')}_variants`]);
                    // Process variant images if they exist
                    // Initialize processedVariants
                    const processedVariants = [];
                    let variantIndex = 0;
                    while (true) {
                        const nameKey = `floor_${i}_unit_${unitType.replace(/\s/g, '_')}_variant_${variantIndex}_name`;
                        const imageKey = `floor_${i}_unit_${unitType.replace(/\s/g, '_')}_variant_${variantIndex}_image`;
                        if (!(nameKey in req.body))
                            break;
                        const variantName = req.body[nameKey];
                        const variantImageFile = (_e = files[imageKey]) === null || _e === void 0 ? void 0 : _e[0];
                        if (variantImageFile) {
                            const variantImageUrl = yield uploadAsset(variantImageFile);
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
        const newProperty = new property_model_1.default({
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
        yield newProperty.save();
        res.status(201).json(newProperty);
    }
    catch (error) {
        console.error('Create Property Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createProperty = createProperty;
const getProperties = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const properties = yield property_model_1.default.find();
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getProperties = getProperties;
const getPropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const property = yield property_model_1.default.findById(req.params.id);
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }
        res.json(property);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getPropertyById = getPropertyById;
const updateProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const files = req.files;
        const { title, slug, area, price, mainVideoUrl, developer, type, location, layoutType, quarter, year, paymentPlans, faqs, amenities, access, views, description, overview, mapUrl, seoTitle, seoDescription, seoschema, canonicalUrl, status, featured, mostLuxurious, numFloors, } = req.body;
        const property = yield property_model_1.default.findById(req.params.id);
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }
        const propertyImages = files['propertyImages'] || [];
        const brochureFile = (_a = files['brochureFile']) === null || _a === void 0 ? void 0 : _a[0];
        const seoImageFile = (_b = files['seoimage']) === null || _b === void 0 ? void 0 : _b[0];
        let imageUrls = property.images || [];
        if (propertyImages.length > 0) {
            const uploadedImages = yield Promise.all(propertyImages.map(img => uploadAsset(img)));
            imageUrls = imageUrls.concat(uploadedImages);
        }
        let brochureUrl = property.brochureFile || '';
        if (brochureFile) {
            brochureUrl = yield uploadAsset(brochureFile);
        }
        let seoImageUrl = property.seoImage || '';
        if (seoImageFile) {
            seoImageUrl = yield uploadAsset(seoImageFile);
        }
        else if (req.body.seoimage_existing) {
            seoImageUrl = req.body.seoimage_existing;
        }
        // Update floors Map
        const floorsMap = new Map();
        for (let i = 0; i < parseInt(numFloors); i++) {
            const defaultLayoutFile = (_c = files[`floor_${i}_defaultLayout`]) === null || _c === void 0 ? void 0 : _c[0];
            const selectedUnitTypes = JSON.parse(req.body[`floor_${i}_selectedUnitTypes`] || '[]');
            // Get existing floor data if it exists
            const existingFloor = property.floors.get(i);
            let defaultLayoutUrl = (existingFloor === null || existingFloor === void 0 ? void 0 : existingFloor.defaultLayout) || '';
            if (defaultLayoutFile) {
                defaultLayoutUrl = yield uploadAsset(defaultLayoutFile);
            }
            else if (req.body[`floor_${i}_defaultLayout_existing`]) {
                defaultLayoutUrl = req.body[`floor_${i}_defaultLayout_existing`];
            }
            // Create unitImages Map for this floor
            const unitImagesMap = new Map();
            // Preserve existing unit images if they exist
            if (existingFloor === null || existingFloor === void 0 ? void 0 : existingFloor.unitImages) {
                for (const [unitType, unitImageData] of existingFloor.unitImages) {
                    unitImagesMap.set(unitType, unitImageData);
                }
            }
            for (const unitType of selectedUnitTypes) {
                const unitKey = unitType.replace(/\s/g, '_');
                const unitImageFile = (_d = files[`floor_${i}_unit_${unitKey}`]) === null || _d === void 0 ? void 0 : _d[0];
                const existingUnitData = unitImagesMap.get(unitType) || {};
                let unitImageUrl = existingUnitData.image || '';
                if (unitImageFile) {
                    unitImageUrl = yield uploadAsset(unitImageFile);
                }
                else if (req.body[`floor_${i}_unit_${unitKey}_existing`]) {
                    unitImageUrl = req.body[`floor_${i}_unit_${unitKey}_existing`];
                }
                // Process variants
                const unitVariants = safeParseArray(req.body[`floor_${i}_unit_${unitKey}_variants`]);
                const processedVariants = [];
                let variantIndex = 0;
                while (true) {
                    const nameKey = `floor_${i}_unit_${unitKey}_variant_${variantIndex}_name`;
                    const imageKey = `floor_${i}_unit_${unitKey}_variant_${variantIndex}_image`;
                    if (!(nameKey in req.body))
                        break;
                    const variantName = req.body[nameKey];
                    const variantImageFile = (_e = files[imageKey]) === null || _e === void 0 ? void 0 : _e[0];
                    if (variantImageFile) {
                        const variantImageUrl = yield uploadAsset(variantImageFile);
                        processedVariants.push({
                            variantName: variantName,
                            image: variantImageUrl,
                        });
                    }
                    else if (req.body[`${imageKey}_existing`]) {
                        processedVariants.push({
                            variantName: variantName,
                            image: req.body[`${imageKey}_existing`],
                        });
                    }
                    else {
                        const previousVariants = (existingUnitData === null || existingUnitData === void 0 ? void 0 : existingUnitData.variants) || [];
                        const previousVariant = previousVariants.find((v) => v.variantName === variantName);
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
        if (location !== undefined)
            property.location = location;
        if (layoutType !== undefined)
            property.layoutType = layoutType;
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
        if (overview !== undefined)
            property.overview = overview;
        property.mapUrl = mapUrl;
        property.seoTitle = seoTitle;
        property.seoDescription = seoDescription;
        property.seoImage = seoImageUrl;
        property.seoSchema = seoschema;
        if (canonicalUrl !== undefined)
            property.canonicalUrl = canonicalUrl;
        if (status !== undefined)
            property.status = status === 'inactive' ? 'inactive' : 'active';
        if (featured !== undefined)
            property.featured = featured === 'true' || featured === true;
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
        yield property.save();
        res.status(200).json(property);
    }
    catch (error) {
        console.error('Update Property Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateProperty = updateProperty;
const deleteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield property_model_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Property deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteProperty = deleteProperty;
const bulkDeleteProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ids = Array.isArray((_a = req.body) === null || _a === void 0 ? void 0 : _a.ids) ? req.body.ids : [];
        if (!ids.length) {
            res.status(400).json({ message: 'No property ids provided' });
            return;
        }
        yield property_model_1.default.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Properties deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.bulkDeleteProperties = bulkDeleteProperties;
const bulkCreateProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const properties = Array.isArray(req.body) ? req.body : (_a = req.body) === null || _a === void 0 ? void 0 : _a.properties;
        if (!Array.isArray(properties) || !properties.length) {
            res.status(400).json({ message: 'Request body must be a non-empty array of properties.' });
            return;
        }
        const sanitized = properties.map((property) => (Object.assign(Object.assign({}, property), { paymentPlans: sanitizePaymentPlansMap((property === null || property === void 0 ? void 0 : property.paymentPlans) || {}) })));
        const created = yield property_model_1.default.insertMany(sanitized, { ordered: false });
        res.status(201).json({
            message: 'Properties created successfully',
            count: created.length,
            properties: created,
        });
    }
    catch (error) {
        console.error('Bulk create properties error:', error);
        res.status(500).json({
            message: 'Failed to bulk create properties',
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error',
        });
    }
});
exports.bulkCreateProperties = bulkCreateProperties;

import { Request, Response } from 'express';
import Developer from '../../models/developer.model';
import Property from '../../models/property.model';
import cloudinary from '../../services/cloudinaryClient';
import { Readable } from 'stream';
import { sanitizeRichText, stripHtml } from '../../utils/sanitizeHtml';
import { buildPageMeta, getPagination, MAX_UNPAGINATED } from '../../utils/pagination';

const useCloudinary = process.env.USE_CLOUDINARY === 'true';

// Map a handover quarter to the month it ends in (used to decide if a project is handed over)
const quarterEndMonth: Record<string, number> = { q1: 3, q2: 6, q3: 9, q4: 12 };

// A project counts as "handed over" once its handover date (year + quarter) is in the past
const isHandedOver = (year?: string, quarter?: string): boolean => {
  const parsedYear = parseInt(String(year ?? ''), 10);
  if (!parsedYear || Number.isNaN(parsedYear)) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  if (parsedYear < currentYear) return true;
  if (parsedYear > currentYear) return false;

  const normalizedQuarter = String(quarter ?? '').trim().toLowerCase();
  const endMonth = quarterEndMonth[normalizedQuarter];
  if (!endMonth) return false;
  return now.getMonth() + 1 > endMonth;
};

// Derive project counts for a developer from the properties linked to it (matched by name)
const computeDeveloperStats = async (
  title: string,
): Promise<{ numberOfProjects: number; projectsHandedOver: number }> => {
  const trimmedTitle = (title ?? '').trim();
  if (!trimmedTitle) return { numberOfProjects: 0, projectsHandedOver: 0 };

  const escapedTitle = trimmedTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const developerMatch = new RegExp(`^${escapedTitle}$`, 'i');

  const properties = await Property.find(
    { developer: developerMatch },
    { year: 1, quarter: 1 },
  ).lean();

  const numberOfProjects = properties.length;
  const projectsHandedOver = properties.filter((property) =>
    isHandedOver(property.year, property.quarter),
  ).length;

  return { numberOfProjects, projectsHandedOver };
};

const uploadFileToCloudinary = async (file: Express.Multer.File): Promise<string> =>
  await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'suits-and-sand/developers', resource_type: 'image', timeout: 120000 },
      (error, result) => {
        if (error || !result?.secure_url) {
          return reject(error || new Error('Cloudinary upload failed'));
        }
        resolve(result.secure_url);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

// =============================
// GET ALL DEVELOPERS
// =============================
export const getDevelopers = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagination = getPagination(req);
    const query = Developer.find().sort({ createdAt: -1 }).lean();

    const withStats = (developers: Array<Record<string, unknown> & { title: string }>) =>
      Promise.all(
        developers.map(async (developer) => ({
          ...developer,
          ...(await computeDeveloperStats(developer.title)),
        })),
      );

    if (!pagination.paginated) {
      const developers = await query.limit(MAX_UNPAGINATED);
      res.json(await withStats(developers));
      return;
    }

    const [developers, total] = await Promise.all([
      query.skip(pagination.skip).limit(pagination.limit),
      Developer.countDocuments(),
    ]);
    res.json({ data: await withStats(developers), pagination: buildPageMeta(total, pagination) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// CREATE DEVELOPER
// =============================
export const createDeveloper = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, numberOfProjects, projectsHandedOver } = req.body;
    const logoFile = req.file;

    if (!title || !description || !logoFile) {
      res.status(400).json({ message: 'Please provide all required fields.' });
      return;
    }

    let logoUrl = '';
    if (useCloudinary) {
      logoUrl = await uploadFileToCloudinary(logoFile);
    } else {
      logoUrl = `/uploads/${logoFile.filename}`;
    }

    const newDeveloper = new Developer({
      title: stripHtml(title),
      description: sanitizeRichText(description),
      logoUrl,
      numberOfProjects,
      projectsHandedOver,
    });

    await newDeveloper.save();
    res.status(201).json(newDeveloper);
  } catch (error) {
    console.error('Create Developer Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// UPDATE DEVELOPER
// =============================
export const updateDeveloper = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, numberOfProjects, projectsHandedOver } = req.body;
    const logoFile = req.file;

    const updateData: any = {
      title: stripHtml(title),
      description: sanitizeRichText(description),
      numberOfProjects,
      projectsHandedOver,
    };

    if (logoFile) {
      if (useCloudinary) {
        updateData.logoUrl = await uploadFileToCloudinary(logoFile);
      } else {
        updateData.logoUrl = `/uploads/${logoFile.filename}`;
      }
    }

    const updatedDeveloper = await Developer.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedDeveloper) {
      res.status(404).json({ message: 'Developer not found' });
      return;
    }

    res.json(updatedDeveloper);
  } catch (error) {
    console.error('Update Developer Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// DELETE DEVELOPER
// =============================
export const deleteDeveloper = async (req: Request, res: Response): Promise<void> => {
  try {
    await Developer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Developer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// GET DEVELOPER BY ID
// =============================
export const getDeveloperById = async (req: Request, res: Response): Promise<void> => {
  try {
    const developer = await Developer.findById(req.params.id).lean();
    if (!developer) {
      res.status(404).json({ message: 'Developer not found' });
      return;
    }
    const stats = await computeDeveloperStats(developer.title);
    res.json({ ...developer, ...stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

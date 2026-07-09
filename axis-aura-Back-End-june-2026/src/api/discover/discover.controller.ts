import { Request, Response } from 'express';
import Discover from '../../models/discover.model';
import cloudinary from '../../services/cloudinaryClient';
import { Readable } from 'stream';

const useCloudinary = process.env.USE_CLOUDINARY === 'true';

type MulterFiles = { [fieldname: string]: Express.Multer.File[] };

const uploadToCloudinary = async (
  file: Express.Multer.File,
  resourceType: 'video' | 'image',
): Promise<string> =>
  await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `suits-and-sand/discover/${resourceType === 'video' ? 'videos' : 'thumbnails'}`,
        resource_type: resourceType,
        timeout: 300000,
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          return reject(error || new Error('Cloudinary upload failed'));
        }
        resolve(result.secure_url);
      },
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

const resolveUploadedUrl = async (
  file: Express.Multer.File | undefined,
  resourceType: 'video' | 'image',
): Promise<string | undefined> => {
  if (!file) return undefined;
  if (useCloudinary) return uploadToCloudinary(file, resourceType);
  return `/uploads/${file.filename}`;
};

// =============================
// GET ALL DISCOVER ITEMS (public)
// =============================
export const getDiscoverItems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await Discover.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// GET DISCOVER ITEM BY ID
// =============================
export const getDiscoverById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Discover.findById(req.params.id).lean();
    if (!item) {
      res.status(404).json({ message: 'Discover item not found' });
      return;
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// CREATE DISCOVER ITEM
// =============================
export const createDiscover = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, videoUrl, thumbnailUrl, order } = req.body;
    const files = (req.files as MulterFiles) || {};
    const videoFile = files.video?.[0];
    const thumbnailFile = files.thumbnail?.[0];

    if (!title || !String(title).trim()) {
      res.status(400).json({ message: 'Title is required.' });
      return;
    }

    const uploadedVideoUrl = await resolveUploadedUrl(videoFile, 'video');
    const finalVideoUrl = uploadedVideoUrl || (videoUrl ? String(videoUrl).trim() : '');

    if (!finalVideoUrl) {
      res.status(400).json({ message: 'A video file or video URL is required.' });
      return;
    }

    const uploadedThumbnailUrl = await resolveUploadedUrl(thumbnailFile, 'image');
    const finalThumbnailUrl =
      uploadedThumbnailUrl || (thumbnailUrl ? String(thumbnailUrl).trim() : '');

    const newItem = new Discover({
      title: String(title).trim(),
      description: description ? String(description).trim() : '',
      videoUrl: finalVideoUrl,
      thumbnailUrl: finalThumbnailUrl,
      order: order !== undefined ? Number(order) : 0,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Create Discover Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// UPDATE DISCOVER ITEM
// =============================
export const updateDiscover = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, videoUrl, thumbnailUrl, order } = req.body;
    const files = (req.files as MulterFiles) || {};
    const videoFile = files.video?.[0];
    const thumbnailFile = files.thumbnail?.[0];

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = String(title).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (order !== undefined) updateData.order = Number(order);

    const uploadedVideoUrl = await resolveUploadedUrl(videoFile, 'video');
    if (uploadedVideoUrl) {
      updateData.videoUrl = uploadedVideoUrl;
    } else if (videoUrl !== undefined && String(videoUrl).trim()) {
      updateData.videoUrl = String(videoUrl).trim();
    }

    const uploadedThumbnailUrl = await resolveUploadedUrl(thumbnailFile, 'image');
    if (uploadedThumbnailUrl) {
      updateData.thumbnailUrl = uploadedThumbnailUrl;
    } else if (thumbnailUrl !== undefined) {
      updateData.thumbnailUrl = String(thumbnailUrl).trim();
    }

    const updatedItem = await Discover.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedItem) {
      res.status(404).json({ message: 'Discover item not found' });
      return;
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Update Discover Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// DELETE DISCOVER ITEM
// =============================
export const deleteDiscover = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Discover.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Discover item not found' });
      return;
    }
    res.status(200).json({ message: 'Discover item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

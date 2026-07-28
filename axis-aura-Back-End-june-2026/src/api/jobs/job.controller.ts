import { Request, Response } from 'express';
import { Job } from '../../models/job.model';
import cloudinary from '../../services/cloudinaryClient';
import { Readable } from 'stream';
import { sanitizeRichText, stripHtml } from '../../utils/sanitizeHtml';
import { buildPageMeta, getPagination, MAX_UNPAGINATED } from '../../utils/pagination';

const useCloudinary = process.env.USE_CLOUDINARY === 'true';

const uploadFileToCloudinary = async (file: Express.Multer.File): Promise<string> =>
  await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'suits-and-sand/jobs', resource_type: 'image', timeout: 120000 },
      (error, result) => {
        if (error || !result?.secure_url) {
          return reject(error || new Error('Cloudinary upload failed'));
        }
        resolve(result.secure_url);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagination = getPagination(req);
    const query = Job.find().sort({ createdAt: -1 });

    if (!pagination.paginated) {
      res.json(await query.limit(MAX_UNPAGINATED));
      return;
    }

    const [jobs, total] = await Promise.all([
      query.skip(pagination.skip).limit(pagination.limit),
      Job.countDocuments(),
    ]);
    res.json({ data: jobs, pagination: buildPageMeta(total, pagination) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJobTitles = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find({}, 'title'); // Only fetch 'title' field
    const titles = jobs.map(job => job.title);
    res.json(titles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job titles' });
  }
};


export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, remunerationType, commission, salary, salaryPeriod, level } = req.body;
    const imageFile = req.file;

    if (!title || !description || !remunerationType) {
      res.status(400).json({ message: 'Please provide all required fields.' });
      return;
    }

    // Validate remuneration fields based on remunerationType
    if (remunerationType === 'commission' && !commission) {
      res.status(400).json({ message: 'Commission must be provided for commission type.' });
      return;
    }
    if (remunerationType === 'salary' && !salary) {
      res.status(400).json({ message: 'Salary must be provided for salary type.' });
      return;
    }

    let imageUrl: string | undefined;
    if (imageFile) {
      imageUrl = useCloudinary
        ? await uploadFileToCloudinary(imageFile)
        : `/uploads/${imageFile.filename}`;
    }

    const newJob = new Job({
      title: stripHtml(title),
      description: sanitizeRichText(description),
      remunerationType, commission, salary, salaryPeriod, level, imageUrl,
    });
    await newJob.save();

    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, remunerationType, commission, salary, salaryPeriod, level } = req.body;
    const imageFile = req.file;

    const updateData: any = {
      title: title === undefined ? undefined : stripHtml(title),
      description: description === undefined ? undefined : sanitizeRichText(description),
      remunerationType, commission, salary, salaryPeriod, level,
    };

    if (imageFile) {
      updateData.imageUrl = useCloudinary
        ? await uploadFileToCloudinary(imageFile)
        : `/uploads/${imageFile.filename}`;
    }

    // Remove undefined or null fields to avoid overwriting with empty values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedJob = await Job.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedJob) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

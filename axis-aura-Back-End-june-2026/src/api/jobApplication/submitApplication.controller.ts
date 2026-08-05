import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import JobApplication from '../../models/jobApplication.model';
import cloudinary from '../../services/cloudinaryClient';
import { Readable } from 'stream';
import { matchesAllowlist, safeFilename } from '../../config/uploadRules';
import { getMailFrom, getTransporter } from '../../services/mailer';
import { buildPageMeta, getPagination, MAX_UNPAGINATED } from '../../utils/pagination';

dotenv.config();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const useCloudinary = process.env.USE_CLOUDINARY === 'true';


// Multer storage config
const storage = useCloudinary
  ? multer.memoryStorage()
  : multer.diskStorage({
    destination: uploadsDir,
    filename: (_, file, cb) => {
      cb(null, safeFilename(file));
    },
  });

// This endpoint is public, so the filter is strict: mimetype AND extension must
// both be PDF. The previous check used OR, so `resume.pdf` with an HTML mimetype
// (or an .html file declaring application/pdf) was accepted.
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname !== 'resume') {
    return cb(new Error(`Unexpected file field: ${file.fieldname}`));
  }
  if (!matchesAllowlist(file, ['application/pdf'], ['.pdf'])) {
    return cb(new Error('Only PDF resumes are allowed.'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024, files: 1 },
}).single('resume');

const uploadResumeToCloudinary = async (file: Express.Multer.File): Promise<string> =>
  await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'suits-and-sand/job-applications', resource_type: 'raw', timeout: 120000 },
      (error, result) => {
        if (error || !result?.secure_url) {
          return reject(error || new Error('Cloudinary upload failed'));
        }
        resolve(result.secure_url);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

// Application submission handler (public)
export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  const {
    fullName,
    firstName,
    lastName,
    email,
    phone,
    position,
    role,
    experience,
    coverLetter,
    description,
  } = req.body;

  const resolvedFullName =
    (fullName && String(fullName).trim()) ||
    [firstName, lastName].filter(Boolean).join(' ').trim();
  const resolvedPosition = position || role || '';
  const resolvedCoverLetter = coverLetter ?? description ?? '';
  const resumeFile = req.file;

  if (!resolvedFullName || !email || !phone || !resolvedPosition) {
    res.status(400).json({ error: 'Please provide name, email, phone and role.' });
    return;
  }

  try {
    let resumeUrl: string | undefined;
    if (resumeFile) {
      if (useCloudinary) {
        try {
          resumeUrl = await uploadResumeToCloudinary(resumeFile);
        } catch (cloudinaryError) {
          console.error('Cloudinary resume upload failed:', cloudinaryError);
          res.status(502).json({ error: 'Resume upload to Cloudinary failed. Please try again.' });
          return;
        }
      } else {
        resumeUrl = `/uploads/${path.basename(resumeFile.path)}`;
      }
    }

    const createdApplication = await JobApplication.create({
      fullName: resolvedFullName,
      firstName,
      lastName,
      email,
      phone,
      position: resolvedPosition,
      experience,
      coverLetter: resolvedCoverLetter,
      resume: resumeUrl,
    });

    // Best-effort email notification — never block a successful submission.
    const transporter = getTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: getMailFrom(),
          to: process.env.EMAIL_TO,
          subject: `New Job Application: ${resolvedFullName}`,
          text: `
Name: ${resolvedFullName}
Email: ${email}
Phone: ${phone}
Position: ${resolvedPosition}

Cover Letter:
${resolvedCoverLetter}
          `,
          attachments: resumeFile
            ? [
                {
                  filename: resumeFile.originalname,
                  ...(useCloudinary ? { content: resumeFile.buffer } : { path: resumeFile.path }),
                },
              ]
            : [],
        });
      } catch (mailError) {
        console.error('Application email notification failed:', mailError);
      }
    }

    res.status(200).json({ message: 'Application sent successfully', application: createdApplication });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error sending application' });
  }
};

export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagination = getPagination(req);
    const query = JobApplication.find().sort({ createdAt: -1 });

    if (!pagination.paginated) {
      res.status(200).json(await query.limit(MAX_UNPAGINATED));
      return;
    }

    const [applications, total] = await Promise.all([
      query.skip(pagination.skip).limit(pagination.limit),
      JobApplication.countDocuments(),
    ]);
    res.status(200).json({ data: applications, pagination: buildPageMeta(total, pagination) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await JobApplication.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }
    res.status(200).json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete application' });
  }
};

export const bulkDeleteApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    if (!ids.length) {
      res.status(400).json({ error: 'No application ids provided' });
      return;
    }

    await JobApplication.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Applications deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to bulk delete applications' });
  }
};

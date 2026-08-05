import { Request, Response } from 'express';
import { Article } from '../../models/article.model';
import cloudinary from '../../services/cloudinaryClient';
import { Readable } from 'stream';
import { sanitizeRichText, stripHtml } from '../../utils/sanitizeHtml';
import { buildPageMeta, getPagination, MAX_UNPAGINATED } from '../../utils/pagination';

const normalizeBannerUrl = (url?: string): string => {
  if (!url) return '';
  return encodeURI(url);
};

const generateSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagination = getPagination(req);
    const query = Article.find().sort({ createdAt: -1 });

    const normalize = (article: { toObject: () => Record<string, unknown> }) => {
      const plain = article.toObject();
      return { ...plain, bannerUrl: normalizeBannerUrl(plain.bannerUrl as string | undefined) };
    };

    if (!pagination.paginated) {
      const articles = await query.limit(MAX_UNPAGINATED);
      res.json(articles.map(normalize));
      return;
    }

    const [articles, total] = await Promise.all([
      query.skip(pagination.skip).limit(pagination.limit),
      Article.countDocuments(),
    ]);
    res.json({ data: articles.map(normalize), pagination: buildPageMeta(total, pagination) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }
    const plainArticle = article.toObject();
    res.json({
      ...plainArticle,
      bannerUrl: normalizeBannerUrl(plainArticle.bannerUrl),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
const useCloudinary = process.env.USE_CLOUDINARY === 'true';

const uploadBannerToCloudinary = async (file: Express.Multer.File): Promise<string> =>
  await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'suits-and-sand/articles', resource_type: 'image' },
      (error, result) => {
        if (error || !result?.secure_url) {
          return reject(error || new Error('Cloudinary upload failed'));
        }
        resolve(result.secure_url);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

const uploadSeoImageToCloudinary = async (file: Express.Multer.File): Promise<string> =>
  await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'suits-and-sand/articles/seo', resource_type: 'image' },
      (error, result) => {
        if (error || !result?.secure_url) {
          return reject(error || new Error('Cloudinary upload failed'));
        }
        resolve(result.secure_url);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

export const createArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const {
      title,
      slug,
      category,
      description,
      imageAlt,
      seoTitle,
      seoDescription,
      articleSchemas,
      status,
      canonicalUrl,
    } = req.body;

    const bannerFile = files?.banner?.[0];
    const seoImageFile = files?.seoImage?.[0];

    if (!title || !category || !description) {
      res.status(400).json({ message: 'title, category, and description are required.' });
      return;
    }

    let bannerUrl = '';
    let seoImageUrl = '';

    if (useCloudinary) {
      bannerUrl = normalizeBannerUrl(await uploadBannerToCloudinary(bannerFile));
      if (seoImageFile) {
        seoImageUrl = normalizeBannerUrl(await uploadSeoImageToCloudinary(seoImageFile));
      }
    } else {
      bannerUrl = `/uploads/${bannerFile.filename}`;
      if (seoImageFile) {
        seoImageUrl = `/uploads/${seoImageFile.filename}`;
      }
    }

    const safeDescription = sanitizeRichText(description);

    const newArticle = new Article({
      title: stripHtml(title),
      slug: slug || generateSlug(title),
      category,
      bannerUrl: bannerUrl || undefined,
      description: safeDescription,
      imageAlt: stripHtml(imageAlt) || stripHtml(title),
      seoTitle: stripHtml(seoTitle) || stripHtml(title),
      seoDescription: sanitizeRichText(seoDescription) || safeDescription,
      seoImageUrl: seoImageUrl || undefined,
      articleSchemas: articleSchemas
        ? (typeof articleSchemas === "string" ? JSON.parse(articleSchemas) : articleSchemas)
        : [],
      status: status === 'inactive' ? 'inactive' : 'active',
      canonicalUrl: canonicalUrl || undefined,
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error in createArticle:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { id } = req.params;
    const {
      title,
      slug,
      category,
      description,
      imageAlt,
      seoTitle,
      seoDescription,
      articleSchemas,
      status,
      canonicalUrl,
    } = req.body;
    const bannerFile = files?.banner?.[0];
    const seoImageFile = files?.seoImage?.[0];

    const updateData: Record<string, unknown> = {
      title: stripHtml(title),
      slug: slug || generateSlug(title),
      category,
      description: sanitizeRichText(description),
      imageAlt: stripHtml(imageAlt),
      seoTitle: stripHtml(seoTitle),
      seoDescription: sanitizeRichText(seoDescription),
      articleSchemas,
    };

    if (status !== undefined) {
      updateData.status = status === 'inactive' ? 'inactive' : 'active';
    }
    if (canonicalUrl !== undefined) {
      updateData.canonicalUrl = canonicalUrl;
    }

    if (bannerFile) {
      if (useCloudinary) {
        updateData.bannerUrl = normalizeBannerUrl(await uploadBannerToCloudinary(bannerFile));
      } else {
        updateData.bannerUrl = `/uploads/${bannerFile.filename}`;
      }
    }

    if (seoImageFile) {
      if (useCloudinary) {
        updateData.seoImageUrl = normalizeBannerUrl(await uploadSeoImageToCloudinary(seoImageFile));
      } else {
        updateData.seoImageUrl = `/uploads/${seoImageFile.filename}`;
      }
    }

    const updatedArticle = await Article.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedArticle) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }

    res.json(updatedArticle);
  } catch (error) {
    console.error('Error in updateArticle:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Article.findByIdAndDelete(id);
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const bulkDeleteArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    if (!ids.length) {
      res.status(400).json({ message: 'No article ids provided' });
      return;
    }
    await Article.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Articles deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

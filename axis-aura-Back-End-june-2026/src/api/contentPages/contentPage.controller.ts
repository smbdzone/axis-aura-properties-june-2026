import { Request, Response } from 'express';
import { getContentPageDefault } from '../../data/contentPageDefaults';
import { ContentPage } from '../../models/contentPage.model';

const ALLOWED_SLUGS = ['privacy-policy', 'terms-and-conditions'] as const;
type ContentSlug = (typeof ALLOWED_SLUGS)[number];

function isAllowedSlug(slug: string): slug is ContentSlug {
  return ALLOWED_SLUGS.includes(slug as ContentSlug);
}

function normalizeSections(sections: unknown) {
  if (!Array.isArray(sections)) return [];

  return sections
    .map((section) => {
      if (!section || typeof section !== 'object') return null;

      const title =
        typeof (section as { title?: unknown }).title === 'string'
          ? (section as { title: string }).title.trim()
          : '';
      const paragraphs = Array.isArray((section as { paragraphs?: unknown }).paragraphs)
        ? (section as { paragraphs: unknown[] }).paragraphs
          .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
          .map((item) => item.trim())
        : [];
      const bullets = Array.isArray((section as { bullets?: unknown }).bullets)
        ? (section as { bullets: unknown[] }).bullets
          .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
          .map((item) => item.trim())
        : [];

      if (!title) return null;

      return {
        title,
        paragraphs,
        ...(bullets.length > 0 ? { bullets } : {}),
      };
    })
    .filter((section): section is NonNullable<typeof section> => section !== null);
}

async function getOrCreateContentPage(slug: ContentSlug) {
  let page = await ContentPage.findOne({ slug });
  if (page) return page;

  const defaults = getContentPageDefault(slug);
  if (!defaults) return null;

  page = await ContentPage.create(defaults);
  return page;
}

export const getContentPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    if (!isAllowedSlug(slug)) {
      res.status(404).json({ message: 'Content page not found.' });
      return;
    }

    const page = await getOrCreateContentPage(slug);
    if (!page) {
      res.status(404).json({ message: 'Content page not found.' });
      return;
    }

    res.json(page);
  } catch (error) {
    console.error('Error in getContentPage:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateContentPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    if (!isAllowedSlug(slug)) {
      res.status(404).json({ message: 'Content page not found.' });
      return;
    }

    const { introText, hero, sections } = req.body;

    const normalizedSections = normalizeSections(sections);
    if (normalizedSections.length === 0) {
      res.status(400).json({ message: 'At least one content section is required.' });
      return;
    }

    const existing = await getOrCreateContentPage(slug);
    const defaults = getContentPageDefault(slug);

    const payload = {
      slug,
      introText:
        typeof introText === 'string'
          ? introText.trim()
          : existing?.introText ?? defaults?.introText ?? '',
      hero: {
        title:
          typeof hero?.title === 'string' && hero.title.trim()
            ? hero.title.trim()
            : existing?.hero?.title ?? defaults?.hero.title ?? '',
        image:
          typeof hero?.image === 'string'
            ? hero.image.trim()
            : existing?.hero?.image ?? defaults?.hero.image ?? '',
        imageAlt:
          typeof hero?.imageAlt === 'string'
            ? hero.imageAlt.trim()
            : existing?.hero?.imageAlt ?? defaults?.hero.imageAlt ?? '',
      },
      sections: normalizedSections,
    };

    const page = await ContentPage.findOneAndUpdate({ slug }, payload, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });

    res.json(page);
  } catch (error) {
    console.error('Error in updateContentPage:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

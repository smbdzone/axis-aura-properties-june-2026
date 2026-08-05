import path from 'path';

/**
 * Upload validation is allowlist-based on purpose. The previous blocklist approach
 * (block .exe/.sh/...) let through .html, .svg, .xhtml and anything else unlisted,
 * which is dangerous because /uploads is served from the API origin.
 */

export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

export const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const DOCUMENT_EXTENSIONS = ['.pdf', '.docx'];

export const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];

/**
 * SVG is deliberately excluded from IMAGE_* — an SVG is a script-capable document
 * and would execute in the browser if ever opened directly from /uploads.
 */
export function matchesAllowlist(
  file: Express.Multer.File,
  mimeTypes: string[],
  extensions: string[],
): boolean {
  const ext = path.extname(file.originalname || '').toLowerCase();
  return mimeTypes.includes(file.mimetype) && extensions.includes(ext);
}

/** Random, extension-checked filename — never trust `originalname` on disk. */
export function safeFilename(file: Express.Multer.File): string {
  const ext = path.extname(file.originalname || '').toLowerCase().replace(/[^a-z0-9.]/g, '');
  const random = Math.random().toString(36).slice(2, 10);
  return `${Date.now()}-${random}${ext}`;
}

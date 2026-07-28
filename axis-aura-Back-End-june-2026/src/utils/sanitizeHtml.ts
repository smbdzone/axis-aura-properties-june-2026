import sanitize from 'sanitize-html';

/**
 * Rich-text fields (article/job/developer descriptions, content-page bullets) are
 * rendered with dangerouslySetInnerHTML on both the public site and the dashboard.
 * Everything written to those fields goes through here first, so the stored value
 * is already safe no matter what the editor or a direct API call sends.
 */
const OPTIONS: sanitize.IOptions = {
  allowedTags: [
    'p', 'br', 'hr', 'div', 'span',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'mark',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    '*': ['style'],
  },
  // No javascript:/vbscript: URLs; data: is limited to images.
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https', 'data'] },
  allowedStyles: {
    '*': {
      'text-align': [/^(left|right|center|justify)$/],
      'font-weight': [/^(normal|bold|[1-9]00)$/],
      'font-style': [/^(normal|italic)$/],
      'text-decoration': [/^(none|underline|line-through)$/],
      color: [/^#[0-9a-fA-F]{3,8}$/, /^rgba?\(/],
      'background-color': [/^#[0-9a-fA-F]{3,8}$/, /^rgba?\(/],
    },
  },
  // Force external links to be safe to click.
  transformTags: {
    a: sanitize.simpleTransform('a', { rel: 'noopener noreferrer nofollow' }),
  },
  disallowedTagsMode: 'discard',
};

/** Sanitizes a rich-text HTML string. Non-strings become ''. */
export function sanitizeRichText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return sanitize(value, OPTIONS);
}

/**
 * Sanitizes a value that may be a string or an array of strings, preserving shape.
 * Returns undefined when the input was undefined so callers can skip the field.
 */
export function sanitizeRichTextField<T>(value: T): T {
  if (value === undefined || value === null) return value;
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeRichText(item)) as unknown as T;
  }
  if (typeof value === 'string') {
    return sanitizeRichText(value) as unknown as T;
  }
  return value;
}

/** Strips all HTML — for fields that should be plain text (names, titles, SEO text). */
export function stripHtml(value: unknown): string {
  if (typeof value !== 'string') return '';
  return sanitize(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

import { describe, it, expect } from 'vitest';
import {
  IMAGE_EXTENSIONS,
  IMAGE_MIME_TYPES,
  matchesAllowlist,
  safeFilename,
} from './uploadRules';

const file = (originalname: string, mimetype: string) =>
  ({ originalname, mimetype }) as Express.Multer.File;

describe('matchesAllowlist', () => {
  it('accepts a genuine png', () => {
    expect(matchesAllowlist(file('a.png', 'image/png'), IMAGE_MIME_TYPES, IMAGE_EXTENSIONS)).toBe(
      true,
    );
  });

  it('rejects SVG (script-capable) from the image allowlist', () => {
    expect(
      matchesAllowlist(file('logo.svg', 'image/svg+xml'), IMAGE_MIME_TYPES, IMAGE_EXTENSIONS),
    ).toBe(false);
  });

  it('rejects an .html file claiming a pdf mimetype', () => {
    expect(matchesAllowlist(file('x.html', 'application/pdf'), ['application/pdf'], ['.pdf'])).toBe(
      false,
    );
  });

  it('rejects a .pdf with a mismatched mimetype (needs BOTH to match)', () => {
    expect(matchesAllowlist(file('x.pdf', 'text/html'), ['application/pdf'], ['.pdf'])).toBe(false);
  });

  it('is case-insensitive on the extension', () => {
    expect(matchesAllowlist(file('A.PNG', 'image/png'), IMAGE_MIME_TYPES, IMAGE_EXTENSIONS)).toBe(
      true,
    );
  });
});

describe('safeFilename', () => {
  it('strips path traversal and keeps a clean extension', () => {
    const name = safeFilename(file('../../evil.png', 'image/png'));
    expect(name).not.toContain('/');
    expect(name).not.toContain('..');
    expect(name.endsWith('.png')).toBe(true);
  });

  it('produces unique names for repeated calls', () => {
    const a = safeFilename(file('a.png', 'image/png'));
    const b = safeFilename(file('a.png', 'image/png'));
    expect(a).not.toBe(b);
  });
});

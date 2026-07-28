import { describe, it, expect } from 'vitest';
import { sanitizeRichText, sanitizeRichTextField, stripHtml } from './sanitizeHtml';

describe('sanitizeRichText', () => {
  it('drops <script> tags', () => {
    expect(sanitizeRichText('<p>hi</p><script>alert(1)</script>')).toBe('<p>hi</p>');
  });

  it('strips event handler attributes', () => {
    expect(sanitizeRichText('<img src="x" onerror="alert(1)">')).not.toContain('onerror');
  });

  it('neutralises javascript: links', () => {
    const out = sanitizeRichText('<a href="javascript:alert(1)">x</a>');
    expect(out).not.toContain('javascript:');
  });

  it('keeps safe https links and forces rel', () => {
    const out = sanitizeRichText('<a href="https://a.com">x</a>');
    expect(out).toContain('href="https://a.com"');
    expect(out).toContain('rel="noopener noreferrer nofollow"');
  });

  it('preserves allowed formatting tags', () => {
    expect(sanitizeRichText('<strong>bold</strong> and <em>italic</em>')).toBe(
      '<strong>bold</strong> and <em>italic</em>',
    );
  });

  it('returns empty string for non-string input', () => {
    expect(sanitizeRichText(null)).toBe('');
    expect(sanitizeRichText(undefined)).toBe('');
    expect(sanitizeRichText(42)).toBe('');
  });
});

describe('stripHtml', () => {
  it('removes all markup, keeping text', () => {
    expect(stripHtml('<b>Bob</b><script>alert(1)</script>')).toBe('Bob');
  });

  it('returns empty string for non-string input', () => {
    expect(stripHtml(undefined)).toBe('');
  });
});

describe('sanitizeRichTextField', () => {
  it('sanitizes each item of an array, preserving shape', () => {
    const out = sanitizeRichTextField(['<p>ok</p>', '<script>bad</script>ok']);
    expect(out).toEqual(['<p>ok</p>', 'ok']);
  });

  it('passes undefined through untouched', () => {
    expect(sanitizeRichTextField(undefined)).toBeUndefined();
  });
});

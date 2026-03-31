import { describe, expect, it } from 'vitest';
import { resolveImageUrl } from './imageUrl';

describe('resolveImageUrl', () => {
  it('uses BIMFALB logo placeholder for legacy WordPress uploads links', () => {
    expect(
      resolveImageUrl('https://bimfalbheritage.com/wp-content/uploads/2025/04/team.jpg')
    ).toBe('/logo.jpg');
  });

  it('keeps normal external URLs unchanged', () => {
    const url = 'https://images.pexels.com/photos/1267358/pexels-photo-1267358.jpeg';
    expect(resolveImageUrl(url)).toBe(url);
  });

  it('keeps relative URLs resolvable', () => {
    expect(resolveImageUrl('/uploads/example.jpg')).toBe('/uploads/example.jpg');
  });
});

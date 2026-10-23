import { describe, expect, it } from 'vitest';

import { productImagePath } from './product-image';

describe('商品画像の保存先', () => {
  it('登録者本人のフォルダ配下に保存する', () => {
    expect(productImagePath('uid-1', 'image-1')).toBe('products/uid-1/image-1.jpg');
  });
});

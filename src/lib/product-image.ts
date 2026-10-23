/** Storage path for a product image. Storage rules only allow writes under the signed-in user's own folder. */
export const productImagePath = (ownerUid: string, fileId: string): string => `products/${ownerUid}/${fileId}.jpg`;

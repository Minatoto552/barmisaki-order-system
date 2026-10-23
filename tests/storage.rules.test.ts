import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { ref, uploadBytes } from 'firebase/storage';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

let environment: RulesTestEnvironment;
const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: 'vrc-order-management-test',
    storage: { rules: readFileSync(resolve('storage.rules'), 'utf8') },
  });
});

beforeEach(async () => environment?.clearStorage());
afterAll(async () => environment?.cleanup());

describe('Storage Security Rules', () => {
  it('本人は自分の商品画像をアップロードできる', async () => {
    const storage = environment.authenticatedContext('alice').storage();
    await assertSucceeds(uploadBytes(ref(storage, 'products/alice/image.jpg'), jpeg, { contentType: 'image/jpeg' }));
  });

  it('別ユーザーの商品フォルダにはアップロードできない', async () => {
    const storage = environment.authenticatedContext('alice').storage();
    await assertFails(uploadBytes(ref(storage, 'products/bob/image.jpg'), jpeg, { contentType: 'image/jpeg' }));
  });

  it('未認証ユーザーと画像以外のファイルを拒否する', async () => {
    const anonymous = environment.unauthenticatedContext().storage();
    const alice = environment.authenticatedContext('alice').storage();
    await assertFails(uploadBytes(ref(anonymous, 'products/alice/image.jpg'), jpeg, { contentType: 'image/jpeg' }));
    await assertFails(uploadBytes(ref(alice, 'products/alice/file.txt'), jpeg, { contentType: 'text/plain' }));
  });

  it('5MB以上の画像を拒否する', async () => {
    const storage = environment.authenticatedContext('alice').storage();
    const oversized = new Uint8Array(5 * 1024 * 1024);
    await assertFails(uploadBytes(ref(storage, 'products/alice/large.jpg'), oversized, { contentType: 'image/jpeg' }));
  });
});

import { db } from './index.ts';
import { wishlistItems, users } from './schema.ts';
import { eq, and } from 'drizzle-orm';

export async function getUserWishlist(uid: string): Promise<string[]> {
  try {
    const userRecords = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (!userRecords.length) return [];

    const user = userRecords[0];
    const items = await db
      .select({ productId: wishlistItems.productId })
      .from(wishlistItems)
      .where(eq(wishlistItems.userId, user.id));

    return items.map((i) => i.productId);
  } catch (error) {
    console.error('Failed to get user wishlist:', error);
    throw new Error('Database operation failed: getUserWishlist', { cause: error });
  }
}

export async function addToWishlist(uid: string, productId: string) {
  try {
    const userRecords = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (!userRecords.length) throw new Error('User not found');

    const user = userRecords[0];

    // Check if already in wishlist
    const existing = await db
      .select()
      .from(wishlistItems)
      .where(and(eq(wishlistItems.userId, user.id), eq(wishlistItems.productId, productId)))
      .limit(1);

    if (existing.length > 0) return existing[0];

    const result = await db
      .insert(wishlistItems)
      .values({
        userId: user.id,
        productId,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    throw new Error('Database operation failed: addToWishlist', { cause: error });
  }
}

export async function removeFromWishlist(uid: string, productId: string) {
  try {
    const userRecords = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (!userRecords.length) return;

    const user = userRecords[0];

    await db
      .delete(wishlistItems)
      .where(and(eq(wishlistItems.userId, user.id), eq(wishlistItems.productId, productId)));
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    throw new Error('Database operation failed: removeFromWishlist', { cause: error });
  }
}

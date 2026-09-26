import { db } from './index.ts';
import { users, boutiqueProfiles } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to get or create user:', error);
    throw new Error('Database operation failed: getOrCreateUser', { cause: error });
  }
}

export async function getUserProfile(uid: string) {
  try {
    const userRecords = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (!userRecords.length) return null;

    const user = userRecords[0];
    const profileRecords = await db
      .select()
      .from(boutiqueProfiles)
      .where(eq(boutiqueProfiles.userId, user.id))
      .limit(1);

    return {
      ...user,
      boutiqueProfile: profileRecords[0] || null,
    };
  } catch (error) {
    console.error('Failed to get user profile:', error);
    throw new Error('Database operation failed: getUserProfile', { cause: error });
  }
}

export async function updateBoutiqueProfile(
  uid: string,
  data: { businessName: string; country: string; city?: string; phone?: string; approvedTier?: string }
) {
  try {
    const userRecords = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (!userRecords.length) throw new Error('User not found');

    const user = userRecords[0];

    const result = await db
      .insert(boutiqueProfiles)
      .values({
        userId: user.id,
        businessName: data.businessName,
        country: data.country,
        city: data.city || null,
        phone: data.phone || null,
        approvedTier: data.approvedTier || 'tier_1',
      })
      .onConflictDoUpdate({
        target: boutiqueProfiles.userId,
        set: {
          businessName: data.businessName,
          country: data.country,
          city: data.city || null,
          phone: data.phone || null,
          approvedTier: data.approvedTier || 'tier_1',
        },
      })
      .returning();

    // Also update user's role to 'boutique'
    await db.update(users).set({ role: 'boutique' }).where(eq(users.id, user.id));

    return result[0];
  } catch (error) {
    console.error('Failed to update boutique profile:', error);
    throw new Error('Database operation failed: updateBoutiqueProfile', { cause: error });
  }
}

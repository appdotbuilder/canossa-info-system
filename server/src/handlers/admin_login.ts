
import { db } from '../db';
import { administratorsTable } from '../db/schema';
import { type AdminLoginInput } from '../schema';
import { eq } from 'drizzle-orm';

export const adminLogin = async (input: AdminLoginInput): Promise<{ success: boolean; token?: string }> => {
  try {
    // Find administrator by username
    const administrators = await db.select()
      .from(administratorsTable)
      .where(eq(administratorsTable.username, input.username))
      .execute();

    if (administrators.length === 0) {
      return { success: false };
    }

    const admin = administrators[0];

    // Check if admin is active
    if (!admin.is_active) {
      return { success: false };
    }

    // For now, we'll do a simple password comparison
    // In production, this should use proper password hashing (bcrypt, etc.)
    if (admin.password_hash !== input.password) {
      return { success: false };
    }

    // Update last_login timestamp
    await db.update(administratorsTable)
      .set({ last_login: new Date() })
      .where(eq(administratorsTable.id, admin.id))
      .execute();

    // Return success with a placeholder token
    // In production, this should be a proper JWT token
    return {
      success: true,
      token: `auth-token-${admin.id}-${Date.now()}`
    };
  } catch (error) {
    console.error('Admin login failed:', error);
    throw error;
  }
};

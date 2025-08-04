
import { db } from '../db';
import { administratorsTable } from '../db/schema';
import { type CreateAdministratorInput, type Administrator } from '../schema';

export const createAdministrator = async (input: CreateAdministratorInput): Promise<Administrator> => {
  try {
    // Hash the password (simple hash for this implementation)
    const password_hash = await Bun.password.hash(input.password);

    // Insert administrator record
    const result = await db.insert(administratorsTable)
      .values({
        username: input.username,
        email: input.email,
        password_hash: password_hash,
        full_name: input.full_name,
        is_active: input.is_active
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Administrator creation failed:', error);
    throw error;
  }
};

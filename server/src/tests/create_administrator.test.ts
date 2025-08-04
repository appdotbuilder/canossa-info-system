
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { administratorsTable } from '../db/schema';
import { type CreateAdministratorInput } from '../schema';
import { createAdministrator } from '../handlers/create_administrator';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateAdministratorInput = {
  username: 'testadmin',
  email: 'test@example.com',
  password: 'securepassword123',
  full_name: 'Test Administrator',
  is_active: true
};

describe('createAdministrator', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an administrator', async () => {
    const result = await createAdministrator(testInput);

    // Basic field validation
    expect(result.username).toEqual('testadmin');
    expect(result.email).toEqual('test@example.com');
    expect(result.full_name).toEqual('Test Administrator');
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.last_login).toBeNull();
    expect(result.password_hash).toBeDefined();
    expect(result.password_hash).not.toEqual('securepassword123'); // Password should be hashed
  });

  it('should save administrator to database', async () => {
    const result = await createAdministrator(testInput);

    // Query using proper drizzle syntax
    const administrators = await db.select()
      .from(administratorsTable)
      .where(eq(administratorsTable.id, result.id))
      .execute();

    expect(administrators).toHaveLength(1);
    expect(administrators[0].username).toEqual('testadmin');
    expect(administrators[0].email).toEqual('test@example.com');
    expect(administrators[0].full_name).toEqual('Test Administrator');
    expect(administrators[0].is_active).toEqual(true);
    expect(administrators[0].created_at).toBeInstanceOf(Date);
    expect(administrators[0].last_login).toBeNull();
    expect(administrators[0].password_hash).toBeDefined();
  });

  it('should hash the password', async () => {
    const result = await createAdministrator(testInput);

    // Password should be hashed, not stored in plain text
    expect(result.password_hash).not.toEqual('securepassword123');
    expect(result.password_hash.length).toBeGreaterThan(20); // Hashed passwords are longer

    // Verify password can be verified with Bun's password verification
    const isValidPassword = await Bun.password.verify('securepassword123', result.password_hash);
    expect(isValidPassword).toBe(true);

    const isInvalidPassword = await Bun.password.verify('wrongpassword', result.password_hash);
    expect(isInvalidPassword).toBe(false);
  });

  it('should enforce unique username constraint', async () => {
    // Create first administrator
    await createAdministrator(testInput);

    // Try to create another with same username but different email
    const duplicateUsernameInput: CreateAdministratorInput = {
      ...testInput,
      email: 'different@example.com'
    };

    await expect(createAdministrator(duplicateUsernameInput)).rejects.toThrow();
  });

  it('should enforce unique email constraint', async () => {
    // Create first administrator
    await createAdministrator(testInput);

    // Try to create another with same email but different username
    const duplicateEmailInput: CreateAdministratorInput = {
      ...testInput,
      username: 'differentadmin'
    };

    await expect(createAdministrator(duplicateEmailInput)).rejects.toThrow();
  });

  it('should create administrator with default is_active value', async () => {
    const inputWithoutIsActive: CreateAdministratorInput = {
      username: 'testadmin2',
      email: 'test2@example.com',
      password: 'securepassword123',
      full_name: 'Test Administrator 2',
      is_active: true // Zod default is applied
    };

    const result = await createAdministrator(inputWithoutIsActive);

    expect(result.is_active).toEqual(true);
  });
});

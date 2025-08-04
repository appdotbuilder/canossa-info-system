
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { administratorsTable } from '../db/schema';
import { type AdminLoginInput } from '../schema';
import { adminLogin } from '../handlers/admin_login';
import { eq } from 'drizzle-orm';

const testAdminInput = {
  username: 'testadmin',
  email: 'admin@test.com',
  password_hash: 'testpassword123',
  full_name: 'Test Administrator',
  is_active: true
};

const loginInput: AdminLoginInput = {
  username: 'testadmin',
  password: 'testpassword123'
};

describe('adminLogin', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should login successfully with valid credentials', async () => {
    // Create test administrator
    await db.insert(administratorsTable)
      .values(testAdminInput)
      .execute();

    const result = await adminLogin(loginInput);

    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe('string');
    expect(result.token).toMatch(/^auth-token-\d+-\d+$/);
  });

  it('should update last_login timestamp on successful login', async () => {
    // Create test administrator
    const inserted = await db.insert(administratorsTable)
      .values(testAdminInput)
      .returning()
      .execute();

    const adminId = inserted[0].id;

    await adminLogin(loginInput);

    // Check that last_login was updated
    const admins = await db.select()
      .from(administratorsTable)
      .where(eq(administratorsTable.id, adminId))
      .execute();

    expect(admins).toHaveLength(1);
    expect(admins[0].last_login).toBeInstanceOf(Date);
    expect(admins[0].last_login).not.toBeNull();
  });

  it('should fail with non-existent username', async () => {
    const result = await adminLogin({
      username: 'nonexistent',
      password: 'anypassword'
    });

    expect(result.success).toBe(false);
    expect(result.token).toBeUndefined();
  });

  it('should fail with incorrect password', async () => {
    // Create test administrator
    await db.insert(administratorsTable)
      .values(testAdminInput)
      .execute();

    const result = await adminLogin({
      username: 'testadmin',
      password: 'wrongpassword'
    });

    expect(result.success).toBe(false);
    expect(result.token).toBeUndefined();
  });

  it('should fail with inactive administrator', async () => {
    // Create inactive administrator
    await db.insert(administratorsTable)
      .values({
        ...testAdminInput,
        is_active: false
      })
      .execute();

    const result = await adminLogin(loginInput);

    expect(result.success).toBe(false);
    expect(result.token).toBeUndefined();
  });

  it('should not update last_login on failed login', async () => {
    // Create test administrator
    const inserted = await db.insert(administratorsTable)
      .values(testAdminInput)
      .returning()
      .execute();

    const adminId = inserted[0].id;

    // Attempt login with wrong password
    await adminLogin({
      username: 'testadmin',
      password: 'wrongpassword'
    });

    // Check that last_login was not updated
    const admins = await db.select()
      .from(administratorsTable)
      .where(eq(administratorsTable.id, adminId))
      .execute();

    expect(admins).toHaveLength(1);
    expect(admins[0].last_login).toBeNull();
  });
});

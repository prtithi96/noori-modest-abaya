import { db } from './index.ts';
import { inquiries } from './schema.ts';
import { desc } from 'drizzle-orm';

export interface CreateInquiryParams {
  name: string;
  email: string;
  phone: string;
  inquiryType?: string;
  message: string;
}

export async function createInquiry(params: CreateInquiryParams) {
  try {
    const result = await db
      .insert(inquiries)
      .values({
        name: params.name,
        email: params.email,
        phone: params.phone,
        inquiryType: params.inquiryType || 'retail',
        message: params.message,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to create inquiry:', error);
    throw new Error('Database operation failed: createInquiry', { cause: error });
  }
}

export async function getInquiries() {
  try {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  } catch (error) {
    console.error('Failed to fetch inquiries:', error);
    throw new Error('Database operation failed: getInquiries', { cause: error });
  }
}

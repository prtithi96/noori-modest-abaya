import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// 1. Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull().default('customer'), // 'customer' | 'boutique' | 'admin'
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  orders: many(orders),
  wishlistItems: many(wishlistItems),
  boutiqueProfile: one(boutiqueProfiles, {
    fields: [users.id],
    references: [boutiqueProfiles.userId],
  }),
}));

// 2. Boutique Profiles Table (for B2B Wholesale)
export const boutiqueProfiles = pgTable('boutique_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  businessName: text('business_name').notNull(),
  country: text('country').notNull(),
  city: text('city'),
  phone: text('phone'),
  approvedTier: text('approved_tier').notNull().default('tier_1'), // 'tier_1' (30%) | 'tier_2' (38%) | 'tier_3' (45%)
  createdAt: timestamp('created_at').defaultNow(),
});

export const boutiqueProfilesRelations = relations(boutiqueProfiles, ({ one }) => ({
  user: one(users, {
    fields: [boutiqueProfiles.userId],
    references: [users.id],
  }),
}));

// 3. Orders Table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderDocketNumber: text('order_docket_number').notNull().unique(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  orderType: text('order_type').notNull().default('retail'), // 'retail' | 'wholesale'
  totalAmount: integer('total_amount').notNull(), // Amount in INR
  paymentMethod: text('payment_method').notNull().default('upi'), // 'upi' | 'card' | 'cod' | 'wire'
  shippingStatus: text('shipping_status').notNull().default('confirmed'), // 'confirmed' | 'processing' | 'dispatched' | 'delivered'
  trackingNumber: text('tracking_number').notNull(),
  shippingAddress: text('shipping_address').notNull(), // Serialized JSON string of address
  createdAt: timestamp('created_at').defaultNow(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

// 4. Order Items Table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  size: text('size').notNull(),
  color: text('color').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: integer('unit_price').notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

// 5. Wishlist Items Table
export const wishlistItems = pgTable('wishlist_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  productId: text('product_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, {
    fields: [wishlistItems.userId],
    references: [users.id],
  }),
}));

// 6. Inquiries Table (Concierge & Wholesale line-sheet requests)
export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  inquiryType: text('inquiry_type').notNull().default('retail'), // 'retail' | 'wholesale' | 'custom' | 'bridal'
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

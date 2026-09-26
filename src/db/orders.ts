import { db } from './index.ts';
import { orders, orderItems, users } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface CreateOrderParams {
  uid?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType?: 'retail' | 'wholesale';
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string;
  items: {
    productId: string;
    productName: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export async function createOrder(params: CreateOrderParams) {
  try {
    let dbUserId: number | null = null;

    if (params.uid) {
      const userRecords = await db.select().from(users).where(eq(users.uid, params.uid)).limit(1);
      if (userRecords.length > 0) {
        dbUserId = userRecords[0].id;
      }
    }

    const orderDocketNumber = `NOORI-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `DHL-AE-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder = await db
      .insert(orders)
      .values({
        orderDocketNumber,
        userId: dbUserId,
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        customerPhone: params.customerPhone,
        orderType: params.orderType || 'retail',
        totalAmount: params.totalAmount,
        paymentMethod: params.paymentMethod || 'upi',
        shippingStatus: 'confirmed',
        trackingNumber,
        shippingAddress: params.shippingAddress,
      })
      .returning();

    const createdOrder = newOrder[0];

    // Insert items
    if (params.items && params.items.length > 0) {
      const itemsToInsert = params.items.map((item) => ({
        orderId: createdOrder.id,
        productId: item.productId,
        productName: item.productName,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      await db.insert(orderItems).values(itemsToInsert);
    }

    return createdOrder;
  } catch (error) {
    console.error('Failed to create order:', error);
    throw new Error('Database operation failed: createOrder', { cause: error });
  }
}

export async function getUserOrders(uid: string) {
  try {
    const userRecords = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (!userRecords.length) return [];

    const user = userRecords[0];

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, user.id))
      .orderBy(desc(orders.createdAt));

    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        return {
          ...order,
          items,
        };
      })
    );

    return ordersWithItems;
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    throw new Error('Database operation failed: getUserOrders', { cause: error });
  }
}

export async function getOrderByDocketNumber(docketNumber: string) {
  try {
    const orderRecords = await db
      .select()
      .from(orders)
      .where(eq(orders.orderDocketNumber, docketNumber))
      .limit(1);

    if (!orderRecords.length) return null;

    const order = orderRecords[0];
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    return {
      ...order,
      items,
    };
  } catch (error) {
    console.error('Failed to get order by docket number:', error);
    throw new Error('Database operation failed: getOrderByDocketNumber', { cause: error });
  }
}

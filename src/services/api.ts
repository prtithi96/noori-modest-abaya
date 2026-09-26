// Client API integration for NOORI Atelier Backend with Supabase support
import { getSupabaseClient } from '../lib/supabase';

export interface OrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType?: 'retail' | 'wholesale';
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: any;
  items: {
    productId: string;
    productName: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export async function createOrderApi(payload: OrderPayload, token?: string | null) {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const orderDocketNumber = `NOORI-${Math.floor(100000 + Math.random() * 900000)}`;
      const trackingNumber = `DHL-AE-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const { data: userData } = await supabase.auth.getUser();

      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_docket_number: orderDocketNumber,
          user_id: userData?.user?.id || null,
          customer_name: payload.customerName,
          customer_email: payload.customerEmail,
          customer_phone: payload.customerPhone,
          order_type: payload.orderType || 'retail',
          total_amount: payload.totalAmount,
          payment_method: payload.paymentMethod || 'upi',
          shipping_status: 'confirmed',
          tracking_number: trackingNumber,
          shipping_address: payload.shippingAddress,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      if (payload.items && payload.items.length > 0) {
        const orderItemsToInsert = payload.items.map((it) => ({
          order_id: newOrder.id,
          product_id: it.productId,
          product_name: it.productName,
          size: it.size,
          color: it.color,
          quantity: it.quantity,
          unit_price: it.unitPrice,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItemsToInsert);
        if (itemsError) console.error('Error inserting Supabase order items:', itemsError);
      }

      return {
        success: true,
        order: {
          ...newOrder,
          orderDocketNumber: newOrder.order_docket_number,
          trackingNumber: newOrder.tracking_number,
          totalAmount: newOrder.total_amount,
          customerName: newOrder.customer_name,
        },
      };
    } catch (sbErr) {
      console.warn('Supabase direct order creation failed, falling back to server API:', sbErr);
    }
  }

  // Fallback to Express backend server
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch('/api/orders', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to place order');
  }

  return await res.json();
}

export async function getUserOrdersApi(token: string) {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((o: any) => ({
            id: o.id,
            orderDocketNumber: o.order_docket_number,
            trackingNumber: o.tracking_number,
            totalAmount: o.total_amount,
            shippingStatus: o.shipping_status,
            createdAt: o.created_at,
            items: o.items?.map((it: any) => ({
              id: it.id,
              productName: it.product_name,
              size: it.size,
              color: it.color,
              quantity: it.quantity,
              unitPrice: it.unit_price,
            })),
          }));
        }
      }
    } catch (sbErr) {
      console.warn('Supabase order retrieval error, using server API:', sbErr);
    }
  }

  const res = await fetch('/api/orders/my', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch orders');
  }

  return await res.json();
}

export async function trackOrderApi(docketNumber: string) {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('order_docket_number', docketNumber)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          orderDocketNumber: data.order_docket_number,
          trackingNumber: data.tracking_number,
          customerName: data.customer_name,
          orderType: data.order_type,
          shippingStatus: data.shipping_status,
          totalAmount: data.total_amount,
          items: data.items?.map((it: any) => ({
            id: it.id,
            productName: it.product_name,
            size: it.size,
            color: it.color,
            quantity: it.quantity,
            unitPrice: it.unit_price,
          })),
        };
      }
    } catch (sbErr) {
      console.warn('Supabase order tracking error, using server API:', sbErr);
    }
  }

  const res = await fetch(`/api/orders/track/${encodeURIComponent(docketNumber)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Order docket not found');
  }
  return await res.json();
}

export async function getWishlistApi(token: string): Promise<string[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data, error } = await supabase
          .from('wishlist_items')
          .select('product_id')
          .eq('user_id', userData.user.id);

        if (!error && data) {
          return data.map((item: any) => item.product_id);
        }
      }
    } catch (sbErr) {
      console.warn('Supabase wishlist error, using server API:', sbErr);
    }
  }

  const res = await fetch('/api/wishlist', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return [];
  return await res.json();
}

export async function addToWishlistApi(productId: string, token: string) {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        await supabase
          .from('wishlist_items')
          .upsert({ user_id: userData.user.id, product_id: productId });
        return { success: true };
      }
    } catch (sbErr) {
      console.warn('Supabase wishlist insert error, using server API:', sbErr);
    }
  }

  const res = await fetch('/api/wishlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
  return await res.json();
}

export async function removeFromWishlistApi(productId: string, token: string) {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        await supabase
          .from('wishlist_items')
          .delete()
          .match({ user_id: userData.user.id, product_id: productId });
        return { success: true };
      }
    } catch (sbErr) {
      console.warn('Supabase wishlist delete error, using server API:', sbErr);
    }
  }

  const res = await fetch(`/api/wishlist/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}

export async function submitInquiryApi(data: {
  name: string;
  email: string;
  phone: string;
  inquiryType?: string;
  message: string;
}) {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data: result, error } = await supabase.from('inquiries').insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        inquiry_type: data.inquiryType || 'retail',
        message: data.message,
      });

      if (!error) {
        return { success: true, inquiry: result };
      }
    } catch (sbErr) {
      console.warn('Supabase inquiry insert error, using server API:', sbErr);
    }
  }

  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to submit inquiry');
  }

  return await res.json();
}

export async function updateBoutiqueProfileApi(
  data: {
    businessName: string;
    country: string;
    city?: string;
    phone?: string;
    approvedTier?: string;
  },
  token: string
) {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data: result, error } = await supabase.from('boutique_profiles').upsert({
          user_id: userData.user.id,
          business_name: data.businessName,
          country: data.country,
          city: data.city || null,
          phone: data.phone || null,
          approved_tier: data.approvedTier || 'tier_1',
        });

        if (!error) {
          // Update profile role
          await supabase.from('profiles').update({ role: 'boutique' }).eq('id', userData.user.id);
          return { success: true, profile: result };
        }
      }
    } catch (sbErr) {
      console.warn('Supabase boutique profile update error, using server API:', sbErr);
    }
  }

  const res = await fetch('/api/user/boutique', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save boutique profile');
  }

  return await res.json();
}

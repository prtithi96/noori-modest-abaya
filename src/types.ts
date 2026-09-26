export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  fabric: 'Korean Nida' | 'Japanese Crepe' | 'Silk Organza' | 'Royal Velvet';
  categories: ('ALL' | 'NEW' | 'BEST' | 'DAILY' | 'PARTY' | 'ROYAL')[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  image: string;
  description: string;
  rating: number;
  reviewsCount: number;
  flareHem: string;
  wholesaleMoq: number;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export type PageId = 'home' | 'collection' | 'wholesale' | 'size-guide' | 'lookbook' | 'about' | 'contact';

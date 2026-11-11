export type Role = "admin" | "shop_owner" | "customer";
export type ProductType = "simple" | "variable";
export type OrderStatus = "pending" | "completed" | "cancelled";

export interface ProductImage {
  id: number;
  url: string;
  is_featured: boolean;
  sort_order: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  role_label: string;
  is_active: boolean;
  shops_count?: number;
  orders_count?: number;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}

export interface ProductVariation {
  id: number;
  product_id: number;
  name: string;
  sku: string | null;
  attributes: Record<string, string>;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: ProductType;
  primary_image: string | null;
  images?: ProductImage[];
  category?: Category | null;
  creator?: User | null;
  variations?: ProductVariation[];
  variations_count?: number;
  listed_in_shop?: boolean;
  created_at?: string;
}

export interface Shop {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  owner?: User | null;
  products_count?: number;
  created_at?: string;
}

export interface ShopProductVariation {
  id: number;
  product_variation_id: number;
  price: string;
  stock: number;
  thumbnail: string | null;
  is_active: boolean;
  variation?: ProductVariation;
}

export interface ShopProduct {
  id: number;
  shop_id: number;
  product_id: number;
  price: string | null;
  price_from: string | number | null;
  price_to: string | number | null;
  thumbnail: string | null;
  details: string | null;
  is_active: boolean;
  is_variable: boolean;
  shop?: Shop;
  product?: Product;
  variations?: ShopProductVariation[];
  created_at?: string;
}

export interface OrderItem {
  id: number;
  product_name: string;
  variation_name: string | null;
  unit_price: string;
  quantity: number;
  line_total: string;
}

export interface Order {
  id: number;
  reference: string;
  status: OrderStatus;
  total: string;
  shop?: Shop;
  customer?: User;
  items?: OrderItem[];
  items_count?: number;
  created_at?: string;
}

export interface Paginated<T> {
  data: T[];
  links: { first: string; last: string; prev: string | null; next: string | null };
  meta: {
    current_page: number;
    from: number | null;
    to: number | null;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  imageUrl: string | null;
  stock: number;
  fragranceNotes: string | null;
  sizeMl: number | null;
  gender: string | null;
  isActive: boolean;
  category: Category | null;
  brand: Brand | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Brand {
  id: number;
  name: string;
  logoUrl: string | null;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface Cart {
  id?: number;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string | null;
  shippingAddress: string;
  shippingCity: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
}

export const api = {
  // Products
  async getProducts(params?: {
    page?: number;
    limit?: number;
    categoryId?: number;
    brandId?: number;
    gender?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId.toString());
    if (params?.brandId) searchParams.set('brandId', params.brandId.toString());
    if (params?.gender) searchParams.set('gender', params.gender);
    if (params?.search) searchParams.set('search', params.search);

    const res = await fetch(`${API_URL}/products?${searchParams}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(id: number): Promise<Product> {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },

  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products/featured?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch featured products');
    return res.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  // Brands
  async getBrands(): Promise<Brand[]> {
    const res = await fetch(`${API_URL}/brands`);
    if (!res.ok) throw new Error('Failed to fetch brands');
    return res.json();
  },

  // Cart
  async getCart(sessionId: string): Promise<Cart> {
    const res = await fetch(`${API_URL}/cart/${sessionId}`);
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
  },

  async addToCart(sessionId: string, productId: number, price: number, quantity: number = 1): Promise<Cart> {
    const res = await fetch(`${API_URL}/cart/${sessionId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, price, quantity }),
    });
    if (!res.ok) throw new Error('Failed to add to cart');
    return res.json();
  },

  async updateCartItem(sessionId: string, productId: number, quantity: number): Promise<Cart> {
    const res = await fetch(`${API_URL}/cart/${sessionId}/items/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error('Failed to update cart item');
    return res.json();
  },

  async removeFromCart(sessionId: string, productId: number): Promise<Cart> {
    const res = await fetch(`${API_URL}/cart/${sessionId}/items/${productId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to remove from cart');
    return res.json();
  },

  async clearCart(sessionId: string): Promise<Cart> {
    const res = await fetch(`${API_URL}/cart/${sessionId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to clear cart');
    return res.json();
  },

  // Orders
  async createOrder(data: {
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    shippingAddress: string;
    shippingCity: string;
    paymentMethod?: string;
    items: OrderItem[];
  }): Promise<Order> {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  async getOrder(orderNumber: string): Promise<Order> {
    const res = await fetch(`${API_URL}/orders/${orderNumber}`);
    if (!res.ok) throw new Error('Failed to fetch order');
    return res.json();
  },
};

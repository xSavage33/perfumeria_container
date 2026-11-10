import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const cartService = {
  async getOrCreateCart(sessionId: string) {
    let cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: true,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId },
        include: {
          items: true,
        },
      });
    }

    return cart;
  },

  async getCart(sessionId: string) {
    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!cart) {
      return { items: [], subtotal: 0, itemCount: 0 };
    }

    const subtotal = cart.items.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );

    const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    return {
      ...cart,
      subtotal: Math.round(subtotal * 100) / 100,
      itemCount,
    };
  },

  async addItem(sessionId: string, productId: number, price: number, quantity: number = 1) {
    const cart = await this.getOrCreateCart(sessionId);

    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          price,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price,
        },
      });
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: { updatedAt: new Date() },
    });

    return this.getCart(sessionId);
  },

  async updateItemQuantity(sessionId: string, productId: number, quantity: number) {
    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = cart.items.find((i) => i.productId === productId);

    if (!item) {
      throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: item.id },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity },
      });
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: { updatedAt: new Date() },
    });

    return this.getCart(sessionId);
  },

  async removeItem(sessionId: string, productId: number) {
    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = cart.items.find((i) => i.productId === productId);

    if (!item) {
      throw new Error('Item not found in cart');
    }

    await prisma.cartItem.delete({
      where: { id: item.id },
    });

    await prisma.cart.update({
      where: { id: cart.id },
      data: { updatedAt: new Date() },
    });

    return this.getCart(sessionId);
  },

  async clearCart(sessionId: string) {
    const cart = await prisma.cart.findUnique({
      where: { sessionId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      await prisma.cart.update({
        where: { id: cart.id },
        data: { updatedAt: new Date() },
      });
    }

    return { items: [], subtotal: 0, itemCount: 0 };
  },
};

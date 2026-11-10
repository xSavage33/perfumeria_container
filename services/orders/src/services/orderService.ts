import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EC-${timestamp}-${random}`;
}

export interface OrderItemInput {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderInput {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCost?: number;
  paymentMethod?: string;
  notes?: string;
  items: OrderItemInput[];
}

export const orderService = {
  async create(data: CreateOrderInput) {
    const orderNumber = generateOrderNumber();

    const subtotal = data.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );

    const shippingCost = data.shippingCost || 0;
    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        subtotal,
        shippingCost,
        total,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  },

  async getByOrderNumber(orderNumber: string) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
      },
    });
  },

  async getById(id: number) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  },

  async getAll(params: { page?: number; limit?: number; status?: string }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};
    if (params.status) {
      where.status = params.status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async updateStatus(id: number, status: string) {
    return prisma.order.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });
  },

  async getByEmail(email: string) {
    return prisma.order.findMany({
      where: { customerEmail: email },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};

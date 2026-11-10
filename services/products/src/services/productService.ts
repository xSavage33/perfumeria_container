import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface ProductFilters {
  categoryId?: number;
  brandId?: number;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const productService = {
  async getAll(filters: ProductFilters, pagination: PaginationParams) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.brandId) where.brandId = filters.brandId;
    if (filters.gender) where.gender = filters.gender;
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          brand: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
      },
    });
  },

  async getBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
      },
    });
  },

  async create(data: Prisma.ProductCreateInput & { categoryId?: number; brandId?: number }) {
    const slug = generateSlug(data.name);

    return prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice,
        imageUrl: data.imageUrl,
        stock: data.stock || 0,
        fragranceNotes: data.fragranceNotes,
        sizeMl: data.sizeMl,
        gender: data.gender,
        isActive: data.isActive ?? true,
        category: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
        brand: data.brandId ? { connect: { id: data.brandId } } : undefined,
      },
      include: {
        category: true,
        brand: true,
      },
    });
  },

  async update(id: number, data: Partial<Prisma.ProductUpdateInput> & { categoryId?: number; brandId?: number }) {
    const updateData: Prisma.ProductUpdateInput = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.name) {
      updateData.slug = generateSlug(data.name as string);
    }

    if (data.categoryId !== undefined) {
      updateData.category = data.categoryId ? { connect: { id: data.categoryId } } : { disconnect: true };
      delete (updateData as any).categoryId;
    }

    if (data.brandId !== undefined) {
      updateData.brand = data.brandId ? { connect: { id: data.brandId } } : { disconnect: true };
      delete (updateData as any).brandId;
    }

    return prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        brand: true,
      },
    });
  },

  async delete(id: number) {
    return prisma.product.delete({
      where: { id },
    });
  },

  async getFeatured(limit: number = 8) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        discountPrice: { not: null },
      },
      include: {
        category: true,
        brand: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  },
};

export const categoryService = {
  async getAll() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  },

  async getById(id: number) {
    return prisma.category.findUnique({
      where: { id },
    });
  },

  async create(data: { name: string }) {
    const slug = generateSlug(data.name);
    return prisma.category.create({
      data: {
        name: data.name,
        slug,
      },
    });
  },

  async update(id: number, data: { name: string }) {
    const slug = generateSlug(data.name);
    return prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug,
      },
    });
  },

  async delete(id: number) {
    return prisma.category.delete({
      where: { id },
    });
  },
};

export const brandService = {
  async getAll() {
    return prisma.brand.findMany({
      orderBy: { name: 'asc' },
    });
  },

  async getById(id: number) {
    return prisma.brand.findUnique({
      where: { id },
    });
  },

  async create(data: { name: string; logoUrl?: string }) {
    return prisma.brand.create({
      data,
    });
  },

  async update(id: number, data: { name?: string; logoUrl?: string }) {
    return prisma.brand.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return prisma.brand.delete({
      where: { id },
    });
  },
};

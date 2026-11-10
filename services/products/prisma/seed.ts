import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'eau-de-parfum' },
      update: {},
      create: { name: 'Eau de Parfum', slug: 'eau-de-parfum' },
    }),
    prisma.category.upsert({
      where: { slug: 'eau-de-toilette' },
      update: {},
      create: { name: 'Eau de Toilette', slug: 'eau-de-toilette' },
    }),
    prisma.category.upsert({
      where: { slug: 'cologne' },
      update: {},
      create: { name: 'Cologne', slug: 'cologne' },
    }),
    prisma.category.upsert({
      where: { slug: 'sets' },
      update: {},
      create: { name: 'Sets de Regalo', slug: 'sets' },
    }),
  ]);

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { id: 1 },
      update: {},
      create: { name: 'Dior' },
    }),
    prisma.brand.upsert({
      where: { id: 2 },
      update: {},
      create: { name: 'Chanel' },
    }),
    prisma.brand.upsert({
      where: { id: 3 },
      update: {},
      create: { name: 'Giorgio Armani' },
    }),
    prisma.brand.upsert({
      where: { id: 4 },
      update: {},
      create: { name: 'Versace' },
    }),
    prisma.brand.upsert({
      where: { id: 5 },
      update: {},
      create: { name: 'Dolce & Gabbana' },
    }),
    prisma.brand.upsert({
      where: { id: 6 },
      update: {},
      create: { name: 'Carolina Herrera' },
    }),
  ]);

  // Create products
  const products = [
    {
      name: 'Sauvage Dior',
      slug: 'sauvage-dior',
      description: 'Una fragancia masculina fresca y salvaje con notas de bergamota y pimienta de Sichuan.',
      price: 120.00,
      discountPrice: 99.99,
      categoryId: categories[0].id,
      brandId: brands[0].id,
      imageUrl: '/images/products/sauvage.jpg',
      stock: 50,
      fragranceNotes: 'Bergamota, Pimienta de Sichuan, Ambroxan',
      sizeMl: 100,
      gender: 'masculino',
    },
    {
      name: 'Coco Mademoiselle',
      slug: 'coco-mademoiselle',
      description: 'Una fragancia femenina elegante y sofisticada con un toque de frescura.',
      price: 145.00,
      categoryId: categories[0].id,
      brandId: brands[1].id,
      imageUrl: '/images/products/coco-mademoiselle.jpg',
      stock: 35,
      fragranceNotes: 'Naranja, Jazmín, Rosa, Pachulí',
      sizeMl: 100,
      gender: 'femenino',
    },
    {
      name: 'Acqua di Gio',
      slug: 'acqua-di-gio',
      description: 'La esencia del Mediterráneo en una fragancia fresca y acuática.',
      price: 95.00,
      discountPrice: 79.99,
      categoryId: categories[1].id,
      brandId: brands[2].id,
      imageUrl: '/images/products/acqua-di-gio.jpg',
      stock: 60,
      fragranceNotes: 'Cítricos, Neroli, Madera de Cedro',
      sizeMl: 75,
      gender: 'masculino',
    },
    {
      name: 'Versace Eros',
      slug: 'versace-eros',
      description: 'Una fragancia audaz que encarna la fuerza y la pasión.',
      price: 110.00,
      categoryId: categories[0].id,
      brandId: brands[3].id,
      imageUrl: '/images/products/versace-eros.jpg',
      stock: 45,
      fragranceNotes: 'Menta, Manzana Verde, Vainilla, Tonka',
      sizeMl: 100,
      gender: 'masculino',
    },
    {
      name: 'Light Blue',
      slug: 'light-blue',
      description: 'Captura la sensualidad del estilo de vida mediterráneo.',
      price: 85.00,
      discountPrice: 69.99,
      categoryId: categories[1].id,
      brandId: brands[4].id,
      imageUrl: '/images/products/light-blue.jpg',
      stock: 55,
      fragranceNotes: 'Limón de Sicilia, Manzana, Cedro',
      sizeMl: 100,
      gender: 'femenino',
    },
    {
      name: 'Good Girl',
      slug: 'good-girl',
      description: 'La dualidad de la mujer moderna: buena y mala a la vez.',
      price: 130.00,
      categoryId: categories[0].id,
      brandId: brands[5].id,
      imageUrl: '/images/products/good-girl.jpg',
      stock: 40,
      fragranceNotes: 'Tuberosa, Jazmín, Cacao, Tonka',
      sizeMl: 80,
      gender: 'femenino',
    },
    {
      name: 'Bleu de Chanel',
      slug: 'bleu-de-chanel',
      description: 'Una fragancia aromática y amaderada para el hombre decidido.',
      price: 140.00,
      discountPrice: 119.99,
      categoryId: categories[0].id,
      brandId: brands[1].id,
      imageUrl: '/images/products/bleu-de-chanel.jpg',
      stock: 30,
      fragranceNotes: 'Menta, Pomelo, Cedro, Sándalo',
      sizeMl: 100,
      gender: 'masculino',
    },
    {
      name: 'J\'adore',
      slug: 'jadore',
      description: 'Un bouquet floral absolutamente femenino y luminoso.',
      price: 135.00,
      categoryId: categories[0].id,
      brandId: brands[0].id,
      imageUrl: '/images/products/jadore.jpg',
      stock: 38,
      fragranceNotes: 'Ylang-Ylang, Rosa, Jazmín',
      sizeMl: 100,
      gender: 'femenino',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

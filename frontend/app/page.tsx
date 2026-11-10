import Link from 'next/link';
import { ArrowRight, Truck, Shield, CreditCard } from 'lucide-react';
import ProductGrid from '@/components/products/ProductGrid';
import { api } from '@/lib/api';

export default async function HomePage() {
  let featuredProducts = [];

  try {
    featuredProducts = await api.getFeaturedProducts(8);
  } catch {
    // API not available yet, use empty array
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-100 to-primary-200 min-h-[70vh] flex items-center">
        <div className="container-custom px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-accent/10 text-accent font-medium px-4 py-2 rounded-full text-sm mb-6">
                Nueva Coleccion 2024
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-secondary leading-tight mb-6">
                Descubre tu <br />
                <span className="text-accent">Fragancia</span> Perfecta
              </h1>
              <p className="text-lg text-secondary-600 mb-8 max-w-lg">
                Explora nuestra exclusiva coleccion de perfumes de las marcas mas prestigiosas del mundo.
                Encuentra la esencia que te define.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/productos" className="btn btn-primary">
                  Ver Catalogo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/productos?gender=femenino" className="btn btn-outline">
                  Para Ella
                </Link>
                <Link href="/productos?gender=masculino" className="btn btn-outline">
                  Para El
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="relative">
                <div className="w-80 h-80 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center">
                  <span className="text-9xl">🌸</span>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  -20%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b">
        <div className="container-custom px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                <Truck className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary">Envio Gratis</h3>
                <p className="text-sm text-gray-500">En pedidos mayores a $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary">100% Original</h3>
                <p className="text-sm text-gray-500">Productos garantizados</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary">Pago Seguro</h3>
                <p className="text-sm text-gray-500">Encriptacion SSL</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Productos Destacados
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre nuestras fragancias mas populares con ofertas especiales
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <div className="text-center py-16 bg-white rounded-xl">
              <p className="text-gray-500 mb-4">Los productos estaran disponibles pronto</p>
              <Link href="/productos" className="btn btn-secondary">
                Ver todos los productos
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/productos" className="btn btn-primary">
              Ver Todo el Catalogo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-12 text-center">
            Compra por Categoria
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/productos?gender=masculino"
              className="group relative h-80 rounded-2xl overflow-hidden bg-secondary"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl group-hover:scale-110 transition-transform">🧔</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70">
                <h3 className="text-2xl font-bold text-white">Para El</h3>
                <p className="text-gray-300">Fragancias masculinas</p>
              </div>
            </Link>

            <Link
              href="/productos?gender=femenino"
              className="group relative h-80 rounded-2xl overflow-hidden bg-accent"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl group-hover:scale-110 transition-transform">👩</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70">
                <h3 className="text-2xl font-bold text-white">Para Ella</h3>
                <p className="text-gray-300">Fragancias femeninas</p>
              </div>
            </Link>

            <Link
              href="/productos?gender=unisex"
              className="group relative h-80 rounded-2xl overflow-hidden bg-primary-400"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl group-hover:scale-110 transition-transform">✨</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70">
                <h3 className="text-2xl font-bold text-white">Unisex</h3>
                <p className="text-gray-300">Para todos</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-16">
        <div className="container-custom px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Suscribete a Nuestro Newsletter
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Recibe ofertas exclusivas y se el primero en conocer nuestros nuevos lanzamientos
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit" className="btn btn-accent">
              Suscribirse
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

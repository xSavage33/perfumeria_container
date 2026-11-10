'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Heart, ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react';
import { api, Product } from '@/lib/api';
import { useCartStore } from '@/lib/store';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isLoading } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.getProduct(Number(params.id));
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom px-4">
          <div className="grid md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4" />
              <div className="h-12 bg-gray-200 rounded w-3/4" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary mb-4">Producto no encontrado</h1>
          <Link href="/productos" className="btn btn-primary">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discountPrice !== null;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - Number(product.discountPrice) / Number(product.price)) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom px-4">
        {/* Breadcrumb */}
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a productos
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square bg-primary-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <span className="text-9xl">
                  {product.gender === 'masculino' ? '🧔' : product.gender === 'femenino' ? '👩' : '✨'}
                </span>
              </div>
            </div>

            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-accent text-white font-bold px-4 py-2 rounded-lg">
                -{discountPercent}%
              </div>
            )}

            <button className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          {/* Details */}
          <div>
            {product.brand && (
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                {product.brand.name}
              </p>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              {product.name}
            </h1>

            {product.category && (
              <span className="inline-block bg-primary text-secondary text-sm px-3 py-1 rounded-full mb-4">
                {product.category.name}
              </span>
            )}

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-accent">
                ${Number(displayPrice).toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through">
                  ${Number(product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {product.sizeMl && (
                <div className="bg-gray-100 rounded-lg p-3">
                  <span className="text-sm text-gray-500">Tamano</span>
                  <p className="font-semibold text-secondary">{product.sizeMl} ml</p>
                </div>
              )}
              {product.gender && (
                <div className="bg-gray-100 rounded-lg p-3">
                  <span className="text-sm text-gray-500">Genero</span>
                  <p className="font-semibold text-secondary capitalize">{product.gender}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-secondary mb-2">Descripcion</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Fragrance Notes */}
            {product.fragranceNotes && (
              <div className="mb-6">
                <h3 className="font-semibold text-secondary mb-2">Notas Olfativas</h3>
                <p className="text-gray-600">{product.fragranceNotes}</p>
              </div>
            )}

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-green-600 font-medium">
                  En stock ({product.stock} disponibles)
                </p>
              ) : (
                <p className="text-red-500 font-medium">Agotado</p>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium text-secondary">Cantidad:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={isLoading || product.stock === 0}
              className="w-full btn btn-primary text-lg py-4 mb-6 disabled:opacity-50"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 border-t pt-6">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <span className="text-xs text-gray-500">Envio Gratis</span>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <span className="text-xs text-gray-500">Original</span>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <span className="text-xs text-gray-500">30 dias</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

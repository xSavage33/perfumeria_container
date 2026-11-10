'use client';

import Link from 'next/link';
import { ShoppingBag, Heart } from 'lucide-react';
import { Product } from '@/lib/api';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isLoading } = useCartStore();

  const hasDiscount = product.discountPrice !== null;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="card group">
      <Link href={`/productos/${product.id}`} className="block">
        <div className="relative aspect-square bg-primary-50 overflow-hidden">
          {/* Placeholder image */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-primary-200 rounded-full flex items-center justify-center mb-2">
                <span className="text-4xl">
                  {product.gender === 'masculino' ? '🧔' : product.gender === 'femenino' ? '👩' : '✨'}
                </span>
              </div>
              <span className="text-xs text-secondary-400">{product.sizeMl}ml</span>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {hasDiscount && (
              <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                OFERTA
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
                ULTIMAS UNIDADES
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.brand.name}
          </p>
        )}

        {/* Name */}
        <Link href={`/productos/${product.id}`}>
          <h3 className="font-semibold text-secondary hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Category */}
        {product.category && (
          <p className="text-sm text-gray-500 mt-1">{product.category.name}</p>
        )}

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xl font-bold text-accent">
            ${Number(displayPrice).toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ${Number(product.price).toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={() => addToCart(product)}
          disabled={isLoading || product.stock === 0}
          className="mt-4 w-full btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
        </button>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { api, Product } from '@/lib/api';

export default function CartPage() {
  const { cart, fetchCart, updateQuantity, removeFromCart, isLoading } = useCartStore();
  const [productDetails, setProductDetails] = useState<Record<number, Product>>({});

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Fetch product details for cart items
  useEffect(() => {
    const fetchProductDetails = async () => {
      const details: Record<number, Product> = {};
      for (const item of cart.items) {
        if (!productDetails[item.productId]) {
          try {
            const product = await api.getProduct(item.productId);
            details[item.productId] = product;
          } catch (err) {
            console.error(`Error fetching product ${item.productId}:`, err);
          }
        }
      }
      if (Object.keys(details).length > 0) {
        setProductDetails(prev => ({ ...prev, ...details }));
      }
    };
    if (cart.items.length > 0) {
      fetchProductDetails();
    }
  }, [cart.items]);

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom px-4 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold text-secondary mb-4">Tu carrito esta vacio</h1>
          <p className="text-gray-500 mb-8">Agrega productos para comenzar tu compra</p>
          <Link href="/productos" className="btn btn-primary">
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom px-4">
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Continuar comprando
        </Link>

        <h1 className="text-3xl font-bold text-secondary mb-8">Carrito de Compras</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const product = productDetails[item.productId];
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-6 shadow-sm flex gap-6"
                >
                  <div className="w-24 h-24 bg-primary-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    {product?.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <ShoppingBag className="w-10 h-10 text-primary-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary">
                      {product?.name || `Producto #${item.productId}`}
                    </h3>
                    {product?.brand && (
                      <p className="text-sm text-gray-500">{product.brand.name}</p>
                    )}
                    <p className="text-accent font-bold text-lg">
                      ${Number(item.price).toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={isLoading}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={isLoading}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-secondary">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          disabled={isLoading}
                          className="p-2 text-gray-400 hover:text-accent transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-secondary mb-6">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.itemCount} items)</span>
                  <span>${Number(cart.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envio</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-accent">${Number(cart.subtotal).toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn btn-primary w-full">
                Proceder al Checkout
              </Link>

              <p className="text-xs text-gray-500 text-center mt-4">
                Impuestos incluidos. Envio gratis en pedidos mayores a $50.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

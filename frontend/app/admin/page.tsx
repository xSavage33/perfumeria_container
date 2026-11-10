'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Tags, Award, Plus } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    brands: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [productsRes, categories, brands] = await Promise.all([
          api.getProducts({ limit: 1 }),
          api.getCategories(),
          api.getBrands(),
        ]);
        setStats({
          products: productsRes.total || 0,
          categories: categories.length,
          brands: brands.length,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Productos</p>
              <p className="text-2xl font-bold text-secondary">{stats.products}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Tags className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Categorias</p>
              <p className="text-2xl font-bold text-secondary">{stats.categories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Marcas</p>
              <p className="text-2xl font-bold text-secondary">{stats.brands}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-secondary mb-4">Acciones Rapidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/productos/nuevo"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-secondary">Nuevo Producto</p>
            <p className="text-sm text-gray-500">Agregar un perfume</p>
          </div>
        </Link>

        <Link
          href="/admin/categorias"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-secondary">Nueva Categoria</p>
            <p className="text-sm text-gray-500">Agregar categoria</p>
          </div>
        </Link>

        <Link
          href="/admin/marcas"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-secondary">Nueva Marca</p>
            <p className="text-sm text-gray-500">Agregar marca</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

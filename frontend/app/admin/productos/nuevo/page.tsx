'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api, Category, Brand } from '@/lib/api';

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    categoryId: '',
    brandId: '',
    imageUrl: '',
    stock: '0',
    fragranceNotes: '',
    sizeMl: '',
    gender: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, brs] = await Promise.all([
          api.getCategories(),
          api.getBrands(),
        ]);
        setCategories(cats);
        setBrands(brs);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createProduct({
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
        brandId: form.brandId ? parseInt(form.brandId) : null,
        imageUrl: form.imageUrl || null,
        stock: parseInt(form.stock) || 0,
        fragranceNotes: form.fragranceNotes || null,
        sizeMl: form.sizeMl ? parseInt(form.sizeMl) : null,
        gender: form.gender || null,
      } as any);
      router.push('/admin/productos');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link href="/admin/productos" className="inline-flex items-center gap-2 text-gray-600 hover:text-secondary mb-6">
        <ArrowLeft className="w-4 h-4" />
        Volver a productos
      </Link>

      <h1 className="text-3xl font-bold text-secondary mb-8">Nuevo Producto</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del producto *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: Chanel No. 5"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripcion
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Descripcion del perfume..."
            />
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="99.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio con descuento
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.discountPrice}
                onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="79.99"
              />
            </div>
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Sin categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca
              </label>
              <select
                value={form.brandId}
                onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Sin marca</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock & Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamano (ml)
              </label>
              <input
                type="number"
                min="1"
                value={form.sizeMl}
                onChange={(e) => setForm({ ...form, sizeMl: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="100"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genero
            </label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccionar...</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de imagen
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Fragrance Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas de fragancia
            </label>
            <textarea
              value={form.fragranceNotes}
              onChange={(e) => setForm({ ...form, fragranceNotes: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
              placeholder="Notas de salida: bergamota, limon..."
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Guardando...' : 'Crear Producto'}
            </button>
            <Link href="/admin/productos" className="btn btn-outline">
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

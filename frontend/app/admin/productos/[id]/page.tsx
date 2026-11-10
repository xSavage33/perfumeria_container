'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api, Category, Brand, Product } from '@/lib/api';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
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
    isActive: true,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [product, cats, brs] = await Promise.all([
          api.getProduct(id),
          api.getCategories(),
          api.getBrands(),
        ]);
        setCategories(cats);
        setBrands(brs);
        setForm({
          name: product.name,
          description: product.description || '',
          price: product.price.toString(),
          discountPrice: product.discountPrice?.toString() || '',
          categoryId: product.category?.id?.toString() || '',
          brandId: product.brand?.id?.toString() || '',
          imageUrl: product.imageUrl || '',
          stock: product.stock.toString(),
          fragranceNotes: product.fragranceNotes || '',
          sizeMl: product.sizeMl?.toString() || '',
          gender: product.gender || '',
          isActive: product.isActive,
        });
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Error al cargar el producto');
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData: Record<string, any> = {
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        isActive: form.isActive,
      };

      // Only add optional fields if they have values
      if (form.description) productData.description = form.description;
      if (form.discountPrice) productData.discountPrice = parseFloat(form.discountPrice);
      if (form.categoryId) productData.categoryId = parseInt(form.categoryId);
      if (form.brandId) productData.brandId = parseInt(form.brandId);
      if (form.imageUrl) productData.imageUrl = form.imageUrl;
      if (form.fragranceNotes) productData.fragranceNotes = form.fragranceNotes;
      if (form.sizeMl) productData.sizeMl = parseInt(form.sizeMl);
      if (form.gender) productData.gender = form.gender;

      await api.updateProduct(id, productData as any);
      router.push('/admin/productos');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div>
      <Link href="/admin/productos" className="inline-flex items-center gap-2 text-gray-600 hover:text-secondary mb-6">
        <ArrowLeft className="w-4 h-4" />
        Volver a productos
      </Link>

      <h1 className="text-3xl font-bold text-secondary mb-8">Editar Producto</h1>

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
            />
          </div>

          {/* Active */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Producto activo (visible en la tienda)
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
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

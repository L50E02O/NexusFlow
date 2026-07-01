import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/shared/ui/Icon';
import { useI18n } from '@/shared/i18n/I18nContext';
import { productosRepository } from '@/entities/productos/api/productos.repository';
import type { ProductoRow } from '@/shared/types/database/productos';
import { ProductFormModal } from '@/components/merchant/ProductFormModal';

export function MerchantProductsPage() {
  const { t } = useI18n();
  const [filter, setFilter] = useState('');
  const [products, setProducts] = useState<ProductoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductoRow | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await productosRepository.list();
    if (!error && data) {
      setProducts(data as ProductoRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filtered = products.filter(
    (p) =>
      !filter ||
      p.nombre.toLowerCase().includes(filter.toLowerCase()) ||
      p.id_producto.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleEdit = (product: ProductoRow) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('common.confirmDelete'))) return;
    setDeleting(id);
    const { error } = await productosRepository.remove(id);
    if (!error) {
      await loadProducts();
    }
    setDeleting(null);
  };

  const handleSaved = () => {
    loadProducts();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-lg max-w-[1400px] mx-auto space-y-xl">
      <div className="flex flex-col md:flex-row justify-between items-end gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">{t('merchant.productTitle')}</h2>
          <p className="text-on-surface-variant text-body-md">
            {t('merchant.productSubtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleNew}
          className="flex items-center gap-sm px-xl py-md bg-primary text-on-primary rounded-xl font-button shadow-lg hover:opacity-90 focus-ring"
        >
          <Icon name="add_circle" filled /> {t('merchant.newProduct')}
        </button>
      </div>

      <ProductFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSaved={handleSaved}
        product={editingProduct}
      />

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md flex flex-wrap gap-md items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="font-label-md text-on-surface-variant block mb-xs" htmlFor="product-filter">
            {t('merchant.filter')}
          </label>
          <input
            id="product-filter"
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={t('merchant.filter.placeholder')}
            className="w-full h-12 px-md rounded-xl border-2 border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        {loading ? (
          <div className="p-lg text-center text-on-surface-variant">{t('common.loading')}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-on-surface-variant text-label-md uppercase">
                  <tr>
                    <th className="px-lg py-md">{t('merchant.productName')}</th>
                    <th className="px-lg py-md">{t('merchant.productStock')}</th>
                    <th className="px-lg py-md">{t('merchant.productPrice')}</th>
                    <th className="px-lg py-md text-right">{t('merchant.productActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {filtered.map((p) => (
                    <tr key={p.id_producto} className="hover:bg-surface-container-low group">
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-md">
                          {p.url ? (
                            <img src={p.url} alt={p.nombre} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                              <Icon name="inventory_2" />
                            </div>
                          )}
                          <div>
                            <p className="font-label-md text-primary">{p.nombre}</p>
                            <p className="text-xs text-on-surface-variant">{p.id_producto}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-md">
                        <span className={p.stock <= 5 ? 'text-error font-bold' : ''}>{p.stock}</span>
                      </td>
                      <td className="px-lg py-md font-medium">${Number(p.precio).toLocaleString()}</td>
                      <td className="px-lg py-md text-right">
                        <div className="flex justify-end gap-xs">
                          <button
                            type="button"
                            onClick={() => handleEdit(p)}
                            className="p-sm hover:bg-surface-container-high rounded-lg focus-ring"
                            aria-label={t('common.edit')}
                          >
                            <Icon name="edit" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id_producto)}
                            disabled={deleting === p.id_producto}
                            className="p-sm hover:bg-error-container text-error rounded-lg focus-ring disabled:opacity-50"
                            aria-label={t('common.delete')}
                          >
                            <Icon name={deleting === p.id_producto ? 'sync' : 'delete'} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-lg py-xl text-center text-on-surface-variant">
                        {t('merchant.filter')} — {t('common.noResults')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-md border-t border-outline-variant flex justify-between items-center text-on-surface-variant text-label-md">
              <span>{t('merchant.showing', { count: filtered.length })}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

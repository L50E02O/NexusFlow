import { useState, useRef, useCallback, useEffect } from 'react';
import { useI18n } from '@/shared/i18n/I18nContext';
import { useFocusTrap } from '@/shared/hooks/useFocusTrap';
import { Icon } from '@/shared/ui/Icon';
import { productosRepository } from '@/entities/productos/api/productos.repository';
import type { ProductoRow } from '@/shared/types/database/productos';
import { DragDropUpload } from './DragDropUpload';

type ProductFormData = {
  nombre: string;
  sku: string;
  id_categoria: string;
  precio: string;
  stock: string;
  descripcion: string;
  url: string;
};

type ProductFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  product?: ProductoRow | null;
};

const categories = [
  { value: '11111111-1111-4111-8111-111111111111', label: 'Accesorios' },
  { value: '22222222-2222-4222-8222-222222222222', label: 'Bebidas' },
  { value: '33333333-3333-4333-8333-333333333333', label: 'Camisas' },
  { value: '44444444-4444-4444-8444-444444444444', label: 'Consolas' },
  { value: '55555555-5555-4555-8555-555555555555', label: 'Deportes' },
  { value: '66666666-6666-4666-8666-666666666662', label: 'Hogar' },
  { value: '77777777-7777-4777-8777-777777777777', label: 'Laptops' },
  { value: '88888888-8888-4888-8888-888888888888', label: 'Teléfonos' },
];

function toFormData(product: ProductoRow | null | undefined): ProductFormData {
  return {
    nombre: product?.nombre ?? '',
    sku: product?.id_producto ?? '',
    id_categoria: product?.id_categoria ?? '',
    precio: product?.precio ?? '',
    stock: product?.stock?.toString() ?? '0',
    descripcion: product?.descripcion ?? '',
    url: product?.url ?? '',
  };
}

export function ProductFormModal({ open, onClose, onSaved, product }: ProductFormModalProps) {
  const { t } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(toFormData(product));
  const isEditing = !!product;

  useEffect(() => {
    setForm(toFormData(product));
    setImageFile(null);
    setError(null);
  }, [product, open]);

  useFocusTrap(modalRef, open, onClose);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleChange = useCallback(
    (field: keyof ProductFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError(null);

      try {
        const payload = {
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: form.precio,
          stock: Number(form.stock) || 0,
          id_categoria: form.id_categoria || null,
          url: imageFile ? URL.createObjectURL(imageFile) : form.url || null,
        };

        if (isEditing && product) {
          const { error: updateError } = await productosRepository.update(product.id_producto, payload);
          if (updateError) throw updateError;
        } else {
          const { error: createError } = await productosRepository.create(payload);
          if (createError) throw createError;
        }

        onSaved();
        onClose();
      } catch (err: any) {
        setError(err?.message || t('errors.server'));
      } finally {
        setSaving(false);
      }
    },
    [form, imageFile, isEditing, product, onSaved, onClose, t],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-md">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? t('merchant.editProduct') : t('merchant.newProduct')}
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-outline-variant bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-outline-variant px-lg py-md bg-surface-container-low rounded-t-2xl">
          <div className="flex items-center gap-sm">
            <Icon name={isEditing ? 'edit' : 'add_circle'} className="text-primary" />
            <h2 className="font-headline-md text-headline-md text-primary">
              {isEditing ? t('merchant.editProduct') : t('merchant.newProduct')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high focus-ring"
          >
            <Icon name="close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-lg space-y-lg">
          {error && (
            <div className="rounded-xl bg-error-container p-md text-error text-body-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="space-y-xs">
              <label htmlFor="product-name" className="font-label-md text-on-surface-variant">
                {t('merchant.productName')} <span className="text-error">*</span>
              </label>
              <input
                id="product-name"
                type="text"
                value={form.nombre}
                onChange={handleChange('nombre')}
                required
                className="w-full h-12 px-md rounded-xl border-2 border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-xs">
              <label htmlFor="product-category" className="font-label-md text-on-surface-variant">
                {t('merchant.productCategory')}
              </label>
              <select
                id="product-category"
                value={form.id_categoria}
                onChange={handleChange('id_categoria')}
                className="w-full h-12 px-md rounded-xl border-2 border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">--</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-xs">
              <label htmlFor="product-price" className="font-label-md text-on-surface-variant">
                {t('merchant.productPrice')} <span className="text-error">*</span>
              </label>
              <input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                value={form.precio}
                onChange={handleChange('precio')}
                required
                className="w-full h-12 px-md rounded-xl border-2 border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-xs">
              <label htmlFor="product-stock" className="font-label-md text-on-surface-variant">
                {t('merchant.productStock')}
              </label>
              <input
                id="product-stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange('stock')}
                className="w-full h-12 px-md rounded-xl border-2 border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-xs">
            <label htmlFor="product-desc" className="font-label-md text-on-surface-variant">
              {t('common.description')}
            </label>
            <textarea
              id="product-desc"
              rows={3}
              value={form.descripcion}
              onChange={handleChange('descripcion')}
              className="w-full px-md py-sm rounded-xl border-2 border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="space-y-xs">
            <p className="font-label-md text-on-surface-variant">{t('merchant.productImage')}</p>
            <DragDropUpload onFileSelect={setImageFile} value={imageFile} />
            {!imageFile && form.url && (
              <div className="mt-xs flex items-center gap-sm p-sm rounded-lg bg-surface-container">
                <img src={form.url} alt="" className="w-12 h-12 rounded object-cover" />
                <span className="text-label-md text-on-surface-variant truncate">{form.url}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-md border-t border-outline-variant pt-lg">
            <button
              type="button"
              onClick={onClose}
              className="flex min-h-11 items-center gap-sm px-xl rounded-xl border-2 border-outline-variant text-on-surface-variant font-button hover:bg-surface-container"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex min-h-11 items-center gap-sm px-xl rounded-xl bg-primary text-on-primary font-button shadow-lg hover:opacity-90 focus-ring disabled:opacity-50"
            >
              <Icon name="save" />
              {saving ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

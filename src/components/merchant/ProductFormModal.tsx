import { useState, useRef, useCallback, useEffect } from 'react';
import { useI18n } from '@/shared/i18n/I18nContext';
import { useFocusTrap } from '@/shared/hooks/useFocusTrap';
import { Icon } from '@/shared/ui/Icon';
import { DragDropUpload } from './DragDropUpload';

type ProductFormData = {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  description: string;
};

type ProductFormModalProps = {
  open: boolean;
  onClose: () => void;
};

const categories = ['Electrónica', 'Calzado', 'Accesorios', 'Moda', 'Hogar', 'Tecnología'];

export function ProductFormModal({ open, onClose }: ProductFormModalProps) {
  const { t } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<ProductFormData>({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });

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
    (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: submit to Supabase or API
      console.log('Product created:', { ...form, image: imageFile });
      onClose();
    },
    [form, imageFile, onClose],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-md">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('merchant.newProduct')}
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-outline-variant bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-outline-variant px-lg py-md bg-surface-container-low rounded-t-2xl">
          <div className="flex items-center gap-sm">
            <Icon name="add_circle" className="text-primary" />
            <h2 className="font-headline-md text-headline-md text-primary">
              {t('merchant.newProduct')}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="space-y-xs">
              <label htmlFor="product-name" className="font-label-md text-on-surface-variant">
                {t('merchant.productName')} <span className="text-error">*</span>
              </label>
              <input
                id="product-name"
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                required
                className="w-full h-12 px-md rounded-xl border-2 border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-xs">
              <label htmlFor="product-sku" className="font-label-md text-on-surface-variant">
                {t('merchant.productSku')} <span className="text-error">*</span>
              </label>
              <input
                id="product-sku"
                type="text"
                value={form.sku}
                onChange={handleChange('sku')}
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
                value={form.category}
                onChange={handleChange('category')}
                className="w-full h-12 px-md rounded-xl border-2 border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">--</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
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
                value={form.price}
                onChange={handleChange('price')}
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
              Descripción
            </label>
            <textarea
              id="product-desc"
              rows={3}
              value={form.description}
              onChange={handleChange('description')}
              className="w-full px-md py-sm rounded-xl border-2 border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="space-y-xs">
            <p className="font-label-md text-on-surface-variant">{t('merchant.productImage')}</p>
            <DragDropUpload onFileSelect={setImageFile} value={imageFile} />
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
              className="flex min-h-11 items-center gap-sm px-xl rounded-xl bg-primary text-on-primary font-button shadow-lg hover:opacity-90 focus-ring"
            >
              <Icon name="save" />
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

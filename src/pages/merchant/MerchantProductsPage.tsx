import { useState } from 'react';
import { Icon } from '@/shared/ui/Icon';
import { useI18n } from '@/shared/i18n/I18nContext';
import { merchantCatalogProducts } from '@/shared/data/merchantMock';
import { ProductFormModal } from '@/components/merchant/ProductFormModal';

export function MerchantProductsPage() {
  const { t } = useI18n();
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = merchantCatalogProducts.filter(
    (p) =>
      !filter ||
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.sku.toLowerCase().includes(filter.toLowerCase()),
  );

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
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-sm px-xl py-md bg-primary text-on-primary rounded-xl font-button shadow-lg hover:opacity-90 focus-ring"
        >
          <Icon name="add_circle" filled /> {t('merchant.newProduct')}
        </button>
      </div>

      <ProductFormModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant">
          <div className="flex items-center gap-sm text-primary mb-sm">
            <Icon name="warning" />
            <h3 className="text-label-md">{t('merchant.lowStockAlert')}</h3>
          </div>
          <p className="font-headline-md text-primary">12 {t('common.products')}</p>
          <p className="text-xs text-on-surface-variant mt-xs">Reposición recomendada antes del viernes</p>
        </div>
        <div className="bg-secondary-fixed p-md rounded-xl">
          <div className="flex items-center gap-sm text-on-secondary-fixed mb-sm">
            <Icon name="trending_up" />
            <h3 className="text-label-md">{t('merchant.priceSuggestion')}</h3>
          </div>
          <p className="font-headline-md text-on-secondary-fixed">+15% Margen</p>
          <p className="text-xs opacity-80 mt-xs">Ajuste sugerido en Electrónica</p>
        </div>
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant">
          <div className="flex items-center gap-sm text-secondary mb-sm">
            <Icon name="insights" />
            <h3 className="text-label-md">{t('merchant.trends')}</h3>
          </div>
          <p className="font-label-md text-primary">Reloj Nomad X</p>
          <p className="text-xs text-on-surface-variant">+45% visitas hoy</p>
        </div>
      </div>

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
        <select className="h-12 px-md rounded-xl border-2 border-outline-variant bg-surface-bright focus-ring" aria-label={t('merchant.productCategory')}>
          <option>{t('merchant.category.all')}</option>
          <option>Electrónica</option>
          <option>Calzado</option>
        </select>
        <select className="h-12 px-md rounded-xl border-2 border-outline-variant bg-surface-bright focus-ring" aria-label={t('merchant.productStock')}>
          <option>{t('merchant.stock.all')}</option>
          <option>{t('merchant.stock.low')}</option>
        </select>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-on-surface-variant text-label-md uppercase">
              <tr>
                <th className="px-lg py-md">{t('merchant.productName')}</th>
                <th className="px-lg py-md">{t('merchant.productCategory')}</th>
                <th className="px-lg py-md">{t('merchant.productStock')}</th>
                <th className="px-lg py-md">{t('merchant.productPrice')}</th>
                <th className="px-lg py-md">{t('merchant.productStatus')}</th>
                <th className="px-lg py-md text-right">{t('merchant.productActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.map((p) => (
                <tr key={p.sku} className="hover:bg-surface-container-low group">
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-md">
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-label-md text-primary">{p.name}</p>
                        <p className="text-xs text-on-surface-variant">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-lg py-md">{p.category}</td>
                  <td className="px-lg py-md">
                    <span className={p.stock <= 5 ? 'text-error font-bold' : ''}>{p.stock}</span>
                    <div className="w-20 bg-surface-container rounded-full h-1 mt-xs">
                      <div className="bg-secondary h-1 rounded-full" style={{ width: `${p.stockPct}%` }} />
                    </div>
                  </td>
                  <td className="px-lg py-md font-medium">{p.price}</td>
                  <td className="px-lg py-md">
                    {p.status === 'active' ? (
                      <span className="inline-flex items-center gap-xs px-md py-xs rounded-full bg-green-100 text-green-800 text-xs font-bold">
                        {t('merchant.productActive')}
                      </span>
                    ) : (
                      <span className="px-md py-xs rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold">
                        {t('merchant.productDraft')}
                      </span>
                    )}
                  </td>
                  <td className="px-lg py-md text-right">
                    <div className="flex justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" className="p-sm hover:bg-surface-container-high rounded-lg focus-ring" aria-label={t('common.edit')}>
                        <Icon name="edit" />
                      </button>
                      <button type="button" className="p-sm hover:bg-error-container text-error rounded-lg focus-ring" aria-label={t('common.delete')}>
                        <Icon name="delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-md border-t border-outline-variant flex justify-between items-center text-on-surface-variant text-label-md">
          <span>{t('merchant.showing', { count: filtered.length })}</span>
          <div className="flex gap-xs">
            <button type="button" className="w-11 h-11 rounded-xl border border-outline flex items-center justify-center focus-ring" disabled>
              <Icon name="chevron_left" />
            </button>
            <button type="button" className="w-11 h-11 rounded-xl bg-primary text-on-primary font-bold">
              1
            </button>
            <button type="button" className="w-11 h-11 rounded-xl border border-outline flex items-center justify-center focus-ring">
              <Icon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

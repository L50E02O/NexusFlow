import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import {
  userProfile,
  userAddresses,
  paymentMethods,
  purchaseOrders,
  formatPrice,
  orderStatusLabel,
} from '@/shared/data/mock';

const activityTabs = ['Pedidos Recientes', 'Historial', 'Productos vistos'] as const;

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<(typeof activityTabs)[number]>('Pedidos Recientes');

  return (
    <main className="pb-xxl max-w-container-max mx-auto px-lg py-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        <section className="lg:col-span-12">
          <div className="bg-surface-container-lowest rounded-xl p-xl shadow-soft flex flex-col md:flex-row items-center justify-between gap-xl">
            <div className="flex flex-col md:flex-row items-center gap-lg text-center md:text-left">
              <div className="relative">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-surface-container-high"
                />
                <button
                  type="button"
                  aria-label="Editar foto"
                  className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full p-xs border-2 border-surface-container-lowest hover:scale-110 transition-transform"
                >
                  <Icon name="edit" className="text-[20px]" />
                </button>
              </div>
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary">{userProfile.name}</h2>
                <p className="font-body-md text-on-surface-variant mt-xs">{userProfile.email}</p>
                <p className="font-body-md text-on-surface-variant">{userProfile.phone}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-md justify-center">
              <button
                type="button"
                className="px-lg py-md bg-primary text-on-primary rounded-xl font-button hover:shadow-lg transition-all min-h-11"
              >
                Editar Perfil
              </button>
              <button
                type="button"
                className="px-lg py-md border-2 border-primary text-primary rounded-xl font-button hover:bg-surface-container transition-all min-h-11"
              >
                Cambiar Contraseña
              </button>
              <Link
                to="/configuracion"
                className="px-lg py-md bg-surface-container-low text-on-surface-variant rounded-xl font-button hover:bg-surface-container-high transition-all min-h-11 flex items-center gap-xs"
              >
                <Icon name="settings" />
                Configuración
              </Link>
            </div>
          </div>
        </section>

        <div className="lg:col-span-8 flex flex-col gap-lg">
          <section className="bg-surface-container-lowest rounded-xl p-xl shadow-soft">
            <div className="flex justify-between items-center mb-xl">
              <h3 className="font-headline-md text-headline-md text-primary">Mis Direcciones</h3>
              <button type="button" className="text-primary font-label-md hover:underline flex items-center gap-xs">
                <Icon name="add_location" />
                Agregar Nueva Dirección
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {userAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-md rounded-xl border-2 ${
                    addr.default
                      ? 'border-primary-container bg-surface-bright'
                      : 'border-outline-variant hover:border-primary-container transition-colors cursor-pointer'
                  }`}
                >
                  {addr.default && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-container bg-secondary-container px-sm py-xs rounded-lg mb-sm inline-block">
                      Predeterminada
                    </span>
                  )}
                  <h4 className="font-label-md text-primary flex items-center gap-xs">
                    <Icon name={addr.icon} />
                    {addr.label}
                  </h4>
                  {addr.lines.map((line) => (
                    <p key={line} className="font-body-md text-on-surface-variant mt-sm">
                      {line}
                    </p>
                  ))}
                  <div className="mt-md flex gap-md">
                    <button type="button" className="text-primary font-label-md text-sm hover:underline">
                      Editar
                    </button>
                    {!addr.default && (
                      <button type="button" className="text-error font-label-md text-sm hover:underline">
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-xl p-xl shadow-soft">
            <h3 className="font-headline-md text-headline-md text-primary mb-xl">Métodos de Pago</h3>
            <div className="flex flex-col gap-md">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between p-md border border-outline-variant rounded-xl"
                >
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-8 bg-surface-container-high rounded flex items-center justify-center font-bold text-primary italic text-sm">
                      {pm.brand === 'wallet' ? (
                        <Icon name="account_balance_wallet" />
                      ) : (
                        pm.brand
                      )}
                    </div>
                    <div>
                      <p className="font-label-md text-primary">{pm.type}</p>
                      <p className="text-[12px] text-on-surface-variant">Expira {pm.expiry}</p>
                    </div>
                  </div>
                  <button type="button" aria-label="Opciones" className="text-outline hover:text-primary">
                    <Icon name="more_vert" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="w-full py-md border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant font-button hover:bg-surface-container transition-all min-h-12 flex items-center justify-center gap-sm"
              >
                <Icon name="add_card" />
                Agregar Método de Pago
              </button>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-xl p-xl shadow-soft">
            <div className="flex gap-lg border-b border-outline-variant mb-xl">
              {activityTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`pb-sm font-bold ${
                    activeTab === tab
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-lg">
              {purchaseOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-md pb-md border-b border-surface-container last:border-0">
                  <div className="flex items-center gap-md">
                    <div className="w-16 h-16 bg-surface-container rounded-lg overflow-hidden shrink-0">
                      <img src={order.product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-label-md text-primary">{order.product.name}</p>
                      <p className="text-[12px] text-on-surface-variant">
                        Pedido #{order.id} • {order.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-label-md text-primary">{formatPrice(order.total)}</p>
                    <span className="text-[10px] bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full font-bold uppercase">
                      {orderStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-lg">
          <section className="bg-surface-container-lowest rounded-xl p-xl shadow-soft">
            <h3 className="font-headline-md text-headline-md text-primary mb-xl">Preferencias</h3>
            <div className="flex flex-col gap-xl">
              <div>
                <label className="font-label-md text-primary">Idioma</label>
                <select className="w-full mt-xs p-md border border-outline-variant rounded-xl bg-surface-bright h-12 focus:ring-2 focus:ring-primary outline-none">
                  <option>Español</option>
                  <option>English</option>
                </select>
              </div>
              <ToggleRow label="Modo Oscuro" hint="Ajustar interfaz para la noche" defaultOn={false} />
              <ToggleRow label="Notificaciones" hint="Email y notificaciones push" defaultOn />
            </div>
          </section>
          <section className="bg-primary-container text-on-primary-container rounded-xl p-xl shadow-soft">
            <h4 className="font-headline-md text-on-primary-fixed mb-sm">Soporte Priority</h4>
            <p className="font-body-md mb-lg opacity-90">
              Como cliente Platinum, tienes acceso directo a nuestro equipo de soporte especializado.
            </p>
            <button
              type="button"
              className="w-full py-md bg-white text-primary rounded-xl font-bold hover:bg-surface-bright transition-all min-h-12"
            >
              Hablar con un Agente
            </button>
          </section>
        </aside>
      </div>
    </main>
  );
}

function ToggleRow({
  label,
  hint,
  defaultOn = false,
}: {
  label: string;
  hint: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="font-label-md text-primary">{label}</span>
        <p className="text-[12px] text-on-surface-variant">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        className={`w-12 h-6 rounded-full relative transition-colors ${on ? 'bg-primary' : 'bg-surface-container-high'}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${on ? 'right-1' : 'left-1'}`}
        />
      </button>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { useCountdown } from '@/shared/hooks/useCountdown';
import { formatPrice } from '@/shared/data/mock';

const aiSuggestions = [
  {
    name: 'Nexus Audio Pro',
    price: 249,
    tag: 'Recomendado para tu estilo',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVJFw9I5uew2ylLFgeAFkrKD5pxJY7ZKFhs_amrUrbC94Wi5PnfGpc_koFJIdCf8nYOgJs42Fa02AExbr1psVFjknevFDvM7MFc6gq3R7XUTBaib6hWbMc39BhR1a97g2hxumGihLcLJQ8F4bu5l8G1H0hWHOlsWRNZ2hN0ZtlCyC-3ridqj1Cd7SlPq7kphH3WLlJvicKMpv9BjLwXUNjvunrVgnccdc_msNTwxgTLcoJOVx1FTyaqYYp3XKShFJ4x00ofUWOYEg',
  },
  {
    name: 'Nexus Watch Series',
    price: 189,
    tag: 'Basado en tu última compra',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAshbOy9dP319Gz7dobfPJx1xf7u8PoRY_syUJlNjQVC9RCmM5nwDA7o4FBakyTxIzhW6WAAN4jFBz9m93IQjeLbUSs77LkACALoSppcpw78K3XcUTFuhtMxj8_V6sY1LzwaNafTo9dQHkZDrjwO-eDuBhS1C9F3o5rRcRRHGiLhhpJy8SWu9QM8I-BjDtoUxJDGiFbRE-of0qNXfZcLcol_NVGT_eZztNB1BreFWlU9f3qqRHIbEHklNzH_smE8Vr4dr_y9GXIc_w',
  },
];

const flashDeals = [
  { name: 'Reloj Minimalist Q2', price: 45, was: 89, stock: 5, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA194H7MzLfSZRuRuuMKlHTjwkVft29Y2h4djwHqnrQXidAxFYn6QqfuDevjeC5y9kNtqGHR1UPkw7FUXzo-IyrCmr-8wQeoaO9A8zvgGxpO0oVB3LA1Zt6L4fykDm9tc_s87USVN1YnffEPewS_MRJKrJKl3yyfLfGdSb07HyoNyckIDp9SB0WWqOwImIF7L7ZkCX2wkzBd8c8-wBdYQLfm0luClLQeV9YhAb4-NyaxfJpDL4ykws-sfKbeWnPibK0jjMunGDnyZs' },
  { name: 'Cámara Retro Nexus', price: 112, was: 150, stock: 2, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRf8iPF9YgKPgGluZiIHcoIavNKgW_y8Y6fmrH1uD1RpH-zBidLg0ngC7qaojWKPo2wF261LbtVcCDhCgNeRcweby1cqlv8mAP2vY-kKcQmmG0acqyV6oWyGvwyAZ_c7DhpFSjdGuuI6zJq6h3O4Ts4CqTiWffwXid_tY-HsMImfiJOJxBfYk1aQWm8pXWL1B3W9NSZixAR6Z5IMchV7e34NIAphDq9-JD09-2ZdTVe_3pJMfesFoH8jsDCXy9puCZYomcQxf3bYc' },
  { name: 'Nexus Sport One', price: 79, was: 120, stock: 12, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvpV-QSGtxtfgODABR6pGk-Yucz_Y0CuJOqpworG8lHFtFP_WbAZMLfLodjzWnMKT_jzWgQvpeBWjULN-ETfXe92EUFfyBxFD0lBIl_at5uGGOJc8LNuRHFmGjVaxSkD9kzRC9pbJp1a6ugb7FnjIP6ae1LCBzLNSLt8pvgj_valpoQV7zTc_UpqwT0soNUzxEmb1W8nRvjdQ6lkJMoyc4nQEWV7kaHET-2WgUxs7Vyqmnp3-8sjqMuJ-_jE31BdFXxQQSWFrdbrM' },
  { name: 'Nexus Classic Steel', price: 95, was: 160, stock: 8, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIeFNGJPW8sRO5M834577AQF1_graGb1FtSi-x-zXJ4BVp1VqZ9itcsMA6tVF9wavUWT1ZSBFe6cwR9m4oMj9RGL5UWRwJPCyVdqDtWpTdwZ1tjtQDrTSy91hnLReMUTH6kLw0XimR6COnYBGgYALROfumEAzgzfymTL9ddHIPWkx0NX69sJPEBNOHCM1H9DL_vPbQdaAqTSLApauprMKahpoERv1ZhijvsEvJ0s62yf9ufcJ9dWPi9_Y7wlvOisMZ0ZKmtfzq3z8' },
];

const promoCategories = [
  {
    title: 'Tecnología',
    subtitle: 'Hasta 40% OFF',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXRpHolFqi1lhg-nlURtZunRWMAmSUaaQr4ZBcS7uh5qAd8OqvnVoeQIkgtCW3WTI_sMK_JfTUdso-V9t9AQ3sH3seTiA_3GGbj8lIo7uZ4x0JA5o839Ocapr1MHsN8S_lzYlg25B9jHN0b03U8MmeyAtlG48GEtlF7TJvUiPMUxAEdeBeBZtX-WwGuRPHhu2R-vhIYrxNezwV6CkaNsz-KcIMniWynMTVSvKFqH6jGf7e335_nln_makkwrgor1lcfQ0sOR2SwZY',
  },
  {
    title: 'Hogar',
    subtitle: 'Renueva tu espacio',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCKDe5mo628hfcxWgLu1OWZtGtHVCRq13zFp3FmNooa2s4dctWIXGE02GK18XjSMCq-VJLtvRP_Qjkj-Lkdr4Nt-2-nVNjAyv8tVuui6pR4bv3nRLkOdC_dGr9v8np0OYFMzjgIwmyND9S2OuyRZU2Ure0vwCXENrggnNSRExt-SYYwifLHsQSLV1cOBBn5AecYuDtBIsTJWzMpOMMStOgtqAL-K5UeknOj8zVToFFOw4UfRfNkZoKdjM5cO8t6tZYzGaSDbnoXOIQ',
  },
  {
    title: 'Sostenibilidad',
    subtitle: 'Eco-conscious Choice',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDm-2UGLnXyCza3mo_UD91sGI27ot87QGwyPQo5YEKav078A4iJ8LtmYFB1SD_y2TL4t9nvX5oQe-EvLVkXiQn2fhHzRdcAOOQnRzgL_9U3-vFxJGexLYwJghna-qsXrky5Zw9hDN16n79lrfACot7t8FQ38TjdXjeasVWdmLzAqbdb-sIRXMjvUKY0zq_yEqUrwz8Z9BK82QP9cCNrwZVGuEH2Gxtg3DUW-pvzl1rjd9XOpaLYERU8aI7-qTfMBbLjBGQtDXVsB_0',
  },
];

export function OffersPage() {
  const countdown = useCountdown(45 * 60 + 12);

  return (
    <div className="max-w-container-max mx-auto px-gutter py-xl">
      <section className="relative w-full rounded-xl overflow-hidden mb-xxl h-[400px] flex items-center">
        {/* WCAG 2.2 — 1.1.1 ✓ Imagen decorativa de fondo */}
        <img
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGb5tvGW25SomJ8da6aYsStSP1atllipPOTFl4sIL2FC2Hapqtml3U3hlVyHr8Fy7yLe6mReLL_gFmTqA5S-8fLMjSDHr5KCR6nQUoG_5qpsVgqlahJ6CMkAD0my_GHCRzCk33_Ec1yS02WUEmfOOQ5KHu_ZWQuLmGgKXpyWoHmbsHlX0aarnaCqD96LoOuD4fTlbk7a40kLHlNKo8XAaK_ga2XnAn9pmLSqXREeJdhtdTmLCCxZhqzQL6TRSwgtxBwp1NGY9kP_4"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
        <div className="relative z-10 px-xxl max-w-2xl text-white">
          <h1 className="font-display-lg text-display-lg mb-md">Ofertas Diseñadas para Ti</h1>
          <p className="font-body-lg text-body-lg text-white/90 mb-xl">
            Descubre una selección inteligente impulsada por nuestra IA, adaptada a tus gustos y necesidades únicas.
          </p>
          <Link
            to="/tienda"
            className="bg-white text-primary px-xl py-md rounded-xl font-button hover:bg-surface-container transition-all shadow-md inline-block focus-ring"
          >
            Ver mi Selección
          </Link>
        </div>
      </section>

      <section className="mb-xxl">
        <div className="flex items-center justify-between mb-lg">
          <h2 className="font-headline-lg text-headline-lg text-primary flex items-center gap-sm">
            <Icon name="auto_awesome" /> Sugerencias IA
          </h2>
          <Link to="/tienda" className="text-secondary font-label-md hover:underline">
            Ver todo
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {aiSuggestions.map((item) => (
            <div
              key={item.name}
              className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant flex gap-lg hover:shadow-md transition-all"
            >
              <div className="w-1/3 aspect-square rounded-lg overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-between flex-1">
                <span className="bg-secondary-container text-on-secondary-container text-xs px-sm py-xs rounded-full font-bold uppercase w-fit">
                  {item.tag}
                </span>
                <h3 className="font-headline-md text-headline-md text-primary mt-sm">{item.name}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-primary font-bold text-headline-md">{formatPrice(item.price)}</span>
                  <button type="button" className="bg-primary text-white p-2 rounded-lg min-w-11 min-h-11 focus-ring">
                    <Icon name="add_shopping_cart" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-xxl">
        <div className="flex items-center justify-between mb-lg flex-wrap gap-md">
          <div className="flex items-center gap-md">
            <h2 className="font-headline-lg text-headline-lg text-primary flex items-center gap-sm">
              <Icon name="bolt" className="text-error" /> Ofertas Relámpago
            </h2>
            <div className="bg-error text-white font-label-md px-md py-xs rounded-lg flex items-center gap-xs" role="timer" aria-live="polite">
              <Icon name="timer" className="text-lg" />
              <span>
                Termina en: {countdown.pad(countdown.hours)}:{countdown.pad(countdown.minutes)}:
                {countdown.pad(countdown.secs)}
              </span>
            </div>
            <button
              type="button"
              onClick={countdown.togglePause}
              aria-label={countdown.paused ? 'Reanudar cuenta regresiva' : 'Pausar animación'}
              className="min-h-11 px-md py-xs border border-outline-variant rounded-lg font-label-md focus-ring"
            >
              {countdown.paused ? 'Reanudar' : 'Pausar'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
          {flashDeals.map((deal) => (
            <div
              key={deal.name}
              className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col border border-outline-variant"
            >
              <div className="relative h-48">
                <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-error text-white text-[10px] font-bold px-2 py-1 rounded">
                  Stock limitado: {deal.stock}
                </div>
              </div>
              <div className="p-md flex flex-col flex-1">
                <h4 className="font-label-md text-primary mb-xs">{deal.name}</h4>
                <div className="flex items-baseline gap-xs mt-auto">
                  <span className="text-primary font-bold text-headline-md">{formatPrice(deal.price)}</span>
                  <span className="text-on-surface-variant line-through text-sm">{formatPrice(deal.was)}</span>
                </div>
                <button type="button" className="mt-md w-full bg-primary-container text-white py-sm rounded-lg font-button min-h-11 hover:bg-primary focus-ring">
                  Comprar Ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-xxl">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-lg">Categorías en Promoción</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {promoCategories.map((cat) => (
            <div key={cat.title} className="relative rounded-xl overflow-hidden h-64 group cursor-pointer">
              <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-lg text-white">
                <h3 className="font-headline-md text-headline-md">{cat.title}</h3>
                <p className="font-label-md opacity-90">{cat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary-container rounded-xxl p-xxl text-white flex flex-col md:flex-row items-center justify-between gap-xl">
        <div className="flex items-center gap-xl">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center border-4 border-primary-fixed-dim shadow-xl">
            <Icon name="stars" className="text-primary-fixed-dim text-[48px]" filled />
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg">Tu Fidelidad Premia</h2>
            <p className="text-on-primary-container text-body-lg">
              Tienes <span className="text-white font-bold">2,450 puntos</span> acumulados.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-md w-full md:w-auto">
          <button type="button" className="bg-white text-primary px-xl py-md rounded-xl font-button hover:bg-surface-container min-h-11">
            Canjear Puntos
          </button>
          <button type="button" className="border-2 border-white text-white px-xl py-md rounded-xl font-button hover:bg-white/10 min-h-11">
            Ver Recompensas
          </button>
        </div>
      </section>
    </div>
  );
}

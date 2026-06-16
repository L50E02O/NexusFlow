export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description?: string;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  stock?: 'in_stock' | 'low' | 'out';
};

export type Category = {
  id: string;
  label: string;
  icon: string;
};

export const navLinks = [
  { to: '/tienda', label: 'Tienda' },
  { to: '/categorias', label: 'Categorías' },
  { to: '/sostenibilidad', label: 'Sostenibilidad' },
  { to: '/soporte', label: 'Soporte' },
] as const;

export const categories: Category[] = [
  { id: 'accesorios', label: 'Accesorios', icon: 'watch' },
  { id: 'tech', label: 'Tecnología', icon: 'laptop_mac' },
  { id: 'ropa', label: 'Ropa', icon: 'apparel' },
  { id: 'hogar', label: 'Hogar', icon: 'chair' },
  { id: 'bienestar', label: 'Bienestar', icon: 'face_retouching_natural' },
  { id: 'mas', label: 'Más', icon: 'menu' },
];

export const featuredProduct: Product = {
  id: 'velocity-pro',
  name: 'Velocity Pro Runners',
  price: 249,
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAU1cP6zYO4jp399KkaP3_69Pl2OgRt67PeIYJiV1cufJ9BYs3rz0p6ZhY07iV_9YE70VEOBsJtYwcffQ9jXtlND6dXrcxRBOzFcz7KFRjh1plgYSOakC3wznNggvWT0QG8W6GKMOINUQt03_MBTz2NjaRS0Lv66rCfQrYyPK0M1ajr3bjSN-mEFA6U1dBz70sunwaGkkzjiR1FZv4NXSMMGfKy5uJm6VC41ahF-rGRVpzQ20Q_WTnsyZm7IRc9RYEovjG7qHN_T_Q',
  category: 'Calzado',
  rating: 4.9,
  reviewCount: 128,
  badge: '98% de coincidencia',
};

export const aiPicks: Product[] = [
  {
    id: 'acoustic-pure',
    name: 'Acoustic Pure Gen 3',
    price: 399,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvwbvFVHpqXWsJSwuFt8SvR6o8DYaPPwVu51d02_RWOgtUvlSywkGVDxHxH_jFHy8JnqbZG2c0y5h2zNMM-Ya65wI6766Oj1swIEe68TN1DEBTY35qWXlNvA8btm-KcOASvO6kYAHwH5f9YBbJtO9MHUPk4p7wx-kAhusWOP6l83DMvzDFA0wl-PICuvVoCG8LipHsdIVXeI0zDUe0MQUvb_qILwrVCLA1cuAofRJ3CTvOdm3RGDJJd2m6eVvZqBRBchjQFKCpstw',
    category: 'Esenciales tecnológicos',
    rating: 4.8,
    reviewCount: 89,
  },
  {
    id: 'chronos-titanium',
    name: 'Chronos Titanium Pro',
    price: 599,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAbH2rIV6DSEfmwTlL8K6SmtZ0jUl3Yf9E9hZcNn1byUmCrVdiu7F2cwwrqukNbJgQyvCCQwLuwgTalll4op0rioXLsUl1wjF14C9WE6rymkvZb6LbvN5Le88JoIo6aKy7q9VtOOTWFdZZsJAn_lfmRUJm3-tct9D8AFeFSFiQbsBojpFKyJV55qVRnDRy9NzfZq8HgVqrY4brSypsQOO7bPyC_2AgwavlO27Y14fabX1Vc5a8PLCMS6dvwG88jd09dCeKx6DZtfKE',
    category: 'Vida inteligente',
    rating: 4.9,
    reviewCount: 56,
  },
];

export const trendingProducts: Product[] = [
  {
    id: 'pure-elixir',
    name: 'Pure Elixir Serum',
    price: 85,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAawRbHcZe71QsbDdwdmFyyJj7LsGTm2Qi0ADXxV7kaYZ_dba_yV8cZOaLWx9ocNujJ2VG5JPvdfKcgUP4XIvN1nazX-3Htl0diFo7Gm59u7LGTQI3ZcDp3-Zb38fZxbS0roXGei6qM7vRcWKRojecHuXBYgqT2BPnUOqR59ziQBT1ukSz77hBI9tYRUsDoO22XKcjY705YsTuGP69OHma9RwE5WdgNWj7eeJMSQyxpqL4o0jduNRfo3Iub2n8xHX8NbScGumAR3IU',
    category: 'Bienestar',
    rating: 4.7,
    reviewCount: 42,
  },
  {
    id: 'eco-tote',
    name: 'Canvas Eco-Tote',
    price: 45,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUhNy25nY6RggSWdzQtjN0AtfxbSk_B5cr5ZvuqG5w05ggYWy1eigpzP14sU9bnwhfX-OF3BahXP_Qx08WK2fa4YdtKYGx4K6cOXeUvMdIhTHMqPvLSVEkSFQf-90bb6A9YkKkqgbfw50qGSuzBd4R-rf262wu8C6yS7618h1ku3zjzfgv7Nz8Jwyk7e7419RsWZl-RvEXHjwoa-L5gdhgt_iMYnwtD25HWr2nvl_emgjftoW4H9g-mxUKTlcSBLMO5vwdxWK1I80',
    category: 'Moda',
    rating: 4.6,
    reviewCount: 18,
  },
  {
    id: 'linear-light',
    name: 'Linear Task Light',
    price: 120,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCLOULZu4sxokzYVvefRqgYMAykOG_4Me38RvcoNcsjyHDwsIqBnVWQjHcjc2ZLRJ5SHTaCdxWBT_f5EqQ4v9uT2OFFwl5oIuslqYbIy2QPWBIj8eWFRpMzbmDKCPq2O0b0SkA9A92gNpqgpSiHRF8mEg_gySVe3rK0ugZvkzJSopxI13IELepBTKPwv4as0B9PrNnkOaMV3ZcAXCkmtObrN0cp7coKyl5TpuRVeZG9i2qHmk6DCLDgoVJdxPGW1s0mLpn4zrA510w',
    category: 'Hogar',
    rating: 4.8,
    reviewCount: 31,
  },
];

export const catalogProducts: Product[] = [
  {
    id: 'vanguard-watch',
    name: 'Vanguard Heritage Watch',
    price: 1250,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAr-DZ0IJDzubK9RIQ3HHsKdw6Pq-JPUADiGhYbYceKwrYXfnUxY71vGtu4jM3nR1KiD6Zkaus-EGsvgGSx2a5qoenBtpOUlLRM2qIHIyAI8nhTo5mtlrLlOl-BGh8_FiBEc6QY8Ji3gzNQbGC1rv8xVnJMm1_dfB5tMV9CmSkIvr-MuWOoNsHtkAvZ-vS2saDWJptEuWCsMT8rOL4VSuTUybLWBlEmn9wMJnSnMbK2xeHZtxzFTVRJoae3OSC6ydHH7JRYcL7mNIU',
    category: 'Accesorios',
    rating: 4.5,
    reviewCount: 42,
    stock: 'in_stock',
  },
  {
    id: 'aeroflow-shoes',
    name: 'AeroFlow Performance Shoes',
    price: 245,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBuu8f5LFCa4K8SCeSt9Ut9Fd_1LG5FJjnyzTISjhqJRWlHg9dP7NqRBEWZksoko1bRl3sglxm4CiEt8NGrhW3dOyECdKJ-v1qqIIZIwKyyc8uX4VQW6WhWkKhnFiUfGYLYaMzZhNLke3tFwgqay70UjDKlWYBuCTFI8D2Scdh_YJK9i9KWAdiCg2Z58RmGrlEx1FNFsAe1CfXK0KUQGE_1nmwkqESB8H7OQxzFdNCTRWqZ_qwM1B0cXza6UA_OMvbP754S-uonRv0',
    category: 'Calzado',
    rating: 5,
    reviewCount: 128,
    stock: 'low',
  },
  {
    id: 'marquis-tote',
    name: 'Marquis Pebbled Leather Tote',
    price: 890,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD__DYBk721rBqyPXkwJklYMnV9QJH17RYeVT3AQWhg3HB2wRgn3k_mGlbhfvmZweVqwcGFxNTGkmh_xR6w-kldxMgyOB4lKxQ_lV9nyIppaWgSt1aXCZ75HFWRVGNLAage09I1sfXYi0piVKvQtTVkoVSV5Kd75vaxu7KaDIQOvUrt9I0SRhd8qPmn5B8jlWNPnwJPhVTdFMqvjSLW0xLjiMkqFxkmNxuVf8AISNfknmo-V1yHJMDoayQSGQUHb6tMn53_IFYoWOU',
    category: 'Moda',
    rating: 4,
    reviewCount: 18,
    stock: 'in_stock',
  },
];

export const coupons = [
  {
    code: 'SUMMER24',
    discount: '15%',
    title: 'Todo el Sitio',
    description: 'Válido para compras superiores a $100. Un solo uso por cliente.',
    expires: '31/12/2024',
    icon: 'local_offer',
  },
  {
    code: 'SHIPFREE',
    discount: 'GRATIS',
    title: 'Envío Gratis',
    description: 'Sin mínimo de compra en tu primera orden del mes.',
    expires: '05/12/2024',
    icon: 'local_shipping',
  },
  {
    code: 'PLATINUM50',
    discount: '$50',
    title: 'Cupón Regalo',
    description: 'Por ser cliente Platino. Aplica en cualquier categoría.',
    expires: '20/01/2025',
    icon: 'loyalty',
  },
];

export const notifications = [
  {
    id: '1',
    type: 'order',
    title: '¡Tu pedido está en camino!',
    body: 'El pedido #4592 con tus nuevos Nexus Air Buds ha salido de nuestro centro de distribución.',
    time: 'Hace 2 horas',
    unread: true,
  },
  {
    id: '2',
    type: 'security',
    title: 'Nuevo inicio de sesión detectado',
    body: 'Se detectó un acceso desde un dispositivo Chrome en Madrid, España.',
    time: 'Hace 5 horas',
    unread: true,
  },
  {
    id: '3',
    type: 'promo',
    title: 'Basado en tus favoritos',
    body: 'Nexus Elite Pro ahora con 15% de descuento exclusivo para ti.',
    time: 'Ayer',
    unread: false,
    product: { name: 'Nexus Elite Pro', price: 254.99, was: 299.99 },
  },
  {
    id: '4',
    type: 'payment',
    title: 'Pago confirmado',
    body: 'Pago confirmado para el pedido #4592 por un total de $145.20.',
    time: 'Hace 2 días',
    unread: false,
  },
];

export const cartItems = [
  {
    product: catalogProducts[0],
    quantity: 1,
  },
  {
    product: catalogProducts[1],
    quantity: 1,
  },
];

export const favoriteProducts: Product[] = [
  {
    id: 'aura-wireless',
    name: 'Aura Wireless Pro Gen 2',
    price: 299,
    originalPrice: 349,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCCXy5GfyYMV86c0lA12GyLGo1JrNMxwpyTXWCIABt1QeG7EzYHDRTLeOTlH74eaf0nvmtstlSyKnSXoIzrEEIz2jsxYqSyBwPhQU4qqjmpkLQZ8wPsLp5u57WfNptV0-wmJw1-d212X7rRBAZPk7I6-0x3c7wxyyebfjK0PvcNFDb5h_GaADWFtlJPNfBha8M3O2in-rePUNTUBgb7-gG1D1FlbgsdtniOnOVITbBZtPqvIFE2_KvkUzH53QYA7YZXKfsvX4JGUW4',
    category: 'Electrónica',
    rating: 4.5,
    reviewCount: 124,
    stock: 'in_stock',
  },
  {
    id: 'nexus-watch-s',
    name: 'Nexus Watch Series S',
    price: 199,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCa6nNZjsOdn-SlrqM8C_VX2J82oN8nMIqHlYT3umXG0d_kwGWVblbPxveLz5p_orzYpEi-h-XdiSIpx_VScFaeD8UDiKR3qiSza5MO0VeDdawsZJj7FeCHRw506buoBbVMjpA9Vei0OQofNDX74KDOyW8kdIS3Lo0hVrKkrJsQzV7PC-lcE0hbM-Y6G71Mf4V6W0ZMb0yezZcRBAOLmgyOBVrRAqNrgUeUPNs1lgACxmPwWeMb-F9Sk3ng42SVk_Vl7cVqsTAuBjk',
    category: 'Accesorios',
    rating: 5,
    reviewCount: 89,
    stock: 'in_stock',
  },
  {
    id: 'stride-runner',
    name: 'Stride Runner Elite',
    price: 119,
    originalPrice: 149,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3CSeRjn2oYm-zKOGAHDxOcPKcsTZEUdsMT0OsY5HMkfE1t_2FOSBxcz11YJfonkEi2m65zKFa1e69V5bwMb9Ya2V2bQVdJO257-8QEjJjjDpltl-181361CwvMuff-1fOfKNj8aWVnkPBnft58TN4Jv6TZTCI1RicW7HBRxyc8wAlrto5QK5Fr3PW_Ff-b4NULwBCvBJtUpVVbik17ehCxVwdm4cYP5sj6kXsh7QAXCwL-hAC9eHxkDxRvxJrLr_fsz8A5yWNVsU',
    category: 'Calzado',
    rating: 4,
    reviewCount: 452,
    stock: 'in_stock',
  },
  {
    id: 'lumina-r5',
    name: 'Lumina Mirrorless R5',
    price: 1299,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDEC58-8uk4etS0KPFcRktPgp8tW_-D2J7Qu9VS6Kr6aHaIQwYamoaq8R-e30VuujkiWfPkVqliFoH5rr_EanugCHLaWlYV98gmq0HBRwRJpcNZ41uC9Ij_y-c-Dia5YNzcVUR9eEEUlld9HksJoANM1n2t208q5gQN575NSctykryR8kNheQmPksQ19K-SoEslnqlS7JnRD7OUFoOxI0YNQzmfqej4GhlTVeFVvBY7i2QV0wdtW6hiKxmI9PNtQWCavTX0qc1Mrsw',
    category: 'Fotografía',
    rating: 5,
    reviewCount: 21,
    stock: 'out',
  },
];

export const favoriteRecommendations: Product[] = [
  {
    id: 'aviator-luxe',
    name: 'Aviator Luxe Gold',
    price: 155,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBfi9tLCx0nKZ4bYKNb-XXslRXnFQTjQgjZdA0kmL3R7QqH436meC4E9xJAKKklNgicuMBxOyuBnesUQfpUTSHVzI9f68Oc28y_V3w4KxH1I4jmONDoWNPpiTY0DI06pZomRUDd22bBAY3P9Rr1dNUa_0k7rVNUpKsp1ctoHdaVtSfoV_Zf-KILQYi0fhm1OqYLUIGR-8kEu_60IIEch_G-3sRhHzJINbq6NwjviTR3KeawDpunuU7jqdUOdqxfri4DP0FcomcFpOM',
    category: 'Accesorios',
    rating: 4.6,
    reviewCount: 34,
  },
  {
    id: 'nexus-tab-air',
    name: 'Nexus Tab Air 11"',
    price: 499,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDNqTyFX8qRJWsFkqkoI8-T78CmP552VTJoi5Kw_eH_WtOEpNqeWwUh6IN4bNJ0h8pNBV3EYR0ZwXnlyXhcIsdw6wm5xwof-bQ5VeNwuW2K5viwKG7Rs4fWazVN62tgSqmLhc3QkNzQKBd4JSD8wqEImC2qKqs8k4WBPnlUC1XlUMe8bL8XREsJQsPpdgglQpv8Ijo9x34OIL_vvQk4bJF8BlMxemgljPiB2yKEG0VX8U0yZ3BKjibFRz1SBpFktCyM5ZqzuXbpGhk',
    category: 'Tecnología',
    rating: 4.7,
    reviewCount: 56,
  },
  {
    id: 'acoustic-pro-one',
    name: 'Acoustic Pro One',
    price: 89,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBBpeAxrxVoUqyy7zB_hOa6E5Bsf2a7mtZoe40ESu3jGtc2aMy8TQOYudaGcUKuETxUZMp3ZTAQGInuCuRkpNCAaZnVh7vw4t-azSxBLK9pmvvCgg8me98wEExsRdM8uw6QYdKBgVtpUe1-4dOhmp2G9kvThw8FSFpqYhEMCN_JX9EpP6Zl2EA7PI0TWT4R94mHDvCVO6nUoaa-Iuf1JZGKqihloMTyacW66XrizLxjzIcMmwhGiXkh5h6NtT8i07qb20-RWOTiXaM',
    category: 'Audio',
    rating: 4.5,
    reviewCount: 78,
  },
  {
    id: 'quantum-key',
    name: 'Quantum Key Elite',
    price: 129,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAa5On_CMrrHipC3j_67DWQirPxRPHSGuMkYKMZzL1oM48CNayXsBEsU64SWteJ_OicFhBfEQhcbwWlBPDf7_tvE_LtxfK_UPJk-acF3d2UhUoR_J9EtgOUw3GIgccG6f0IiUc0yrT1qoU4cJ6yr_1J8zvYBlbmBrcYWX3grTUQvMZWwsiB8mGy2bEE4BKKaua9r6qmPdx1U1CVAyjpecbAH81TxWYEz9pCNFlrrFbJIsqtuI4Y3fRNH_DJlBomJjwIQWVLGp6fsVQ',
    category: 'Periféricos',
    rating: 4.8,
    reviewCount: 112,
  },
];

export const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDqAr40HivEcnJQHOpXjdjqCa_jjJn_xolHe6a3T22oXoXki59d0g-1cTVnhB3zsU94urNKys3DPTuTv8iGhQMV5V0I0mejlUsGiEdcSPzxjWqt3VPcGLvC77tsjRhj5TzWCNNDB7lqG1rXR_FsisenBNqY4-A3bCbOWpMnfLeq_kDXylMdKSZs6LHKSwCMd8VwykhxCHYD56ywURWQ-baUH95W9xKZfJLTyLUgQ26swrLmxHMeq3KnFfVFIRio4slZ-Nr-h5MIb28';

export const flashSaleProduct: Product = {
  id: 'lumina-x-compact',
  name: 'Lumina X-Compact',
  price: 1299,
  originalPrice: 1599,
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCt2tdDNk4In06dy4pIYct4eg-Q_o9Ho_fZENyvzqmacfGuvbkX_kLcI6W5sVRXMAyqLHpaX2OVijFgr09ICJccMSu4_1CleUnztKe57hPvJifQn-_J9JYs46Ca9zCPINLfB6TQfqySK87vZFLAqQjxpssUTHmR7DlrtgX_py9QoOf_-p3L0xNAMtCuOqPCa0NrWzvAqlLLAlaeHzw-w5RprZklVaNrBLLNDiHqMyUuDJEFwe1DQpRr1JMV-HEbWNeCROaNUBr7-pQ',
  category: 'Tecnología',
  rating: 4.8,
  reviewCount: 312,
  stock: 'low',
};

export const recentlyViewed = [
  {
    name: 'Aviator Shades',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHkyLpOBn3xBO9__E2cpNKMu6HKNKGlpEoaXXLY7xXtxPdZ6mHTGF7pkj8Ysm_Tj5OY-5EjaHNO4xbWVeA_rjh0t-Zegvz2kFrnYe_H_4yuzckPp6LqOpkCdWWttpEzXwFHXlLRlK4e-4rTJmt7GrQNFdT0K_nIKiZRIEC5HFeeDnhJqvtMgAbIWUG0hdGblMPupLHvON9yfE7DjKrEQiXXqlQb8-5Xq5e8i7tpxBvMeY65tU-XMY_H3pIrWFycO-PhdF5hWVr0yw',
  },
  {
    name: 'Classic Sneakers',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBbdgYLxb4QS_8ysfpOA-_XMXplDcN4E4YNxiaZYXpzE-tjIEVKsXJFV_47GNvqjsKCyFoaa4pcrlaaJTitsw85TZmba4kCgLdOAQ7UAq4J1oZ5KfbZgr4xjmG-r6_SL30G0nvvRHUSG3ZAfhPC2YyGHWrvWGBPEyfGvTmni7iA5gJtLocHe9IvJDaM-pnGjcRc2Ai6H7h6hAiTGMjn4i5gXeWnqZXl_tQYppD_9b6waVbpV7mwUDT_o-DDzWgbyNvytXTY8rXfuik',
  },
  {
    name: 'Leather Wallet',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD1GmFrATmNx2BQn2ustRfagU54pUR3ir__ASyyvthH3mB_ZD1SKhYQmvh3Bc8I5QXZQKf0zawq80Norx1dvOZCj7tsT8VIOPF0BdCxNWreNhreiImYiC-1ro57s82-kV9JQAzf_4jII6gKcKG7LU1OIR6mx51Qt3ePbzXDhIY_TkUk6i630OZ3r64uHt1BTynbwcKnxU9Hw9_ndY9uhou_3xjlrb3rdhKzrzFbBTlZAus6yEB7cXcte1F39H-jaKuaTkFft54lbBw',
  },
];

export type OrderStatus = 'delivered' | 'shipping' | 'processing' | 'cancelled';

export type Order = {
  id: string;
  date: string;
  total: number;
  recipient?: string;
  status: OrderStatus;
  product: Product;
  variant?: string;
};

export const userProfile = {
  name: 'Alejandro García',
  email: 'alejandro.garcia@nexusflow.com',
  phone: '+34 600 123 456',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCsqzEb38VuFcdddg_OzJg2W18Q1tmPK_6XCx71OQN5inolGf2QARjLf1_DK26VifgXoTztL4dX6u0aZRVDvTxC6PggGTL790tbsWfcVh3TYuvEkXEKL7ojgWTwZo-hl89ShdVZhdvd8jgCA-ay46HWgWnaf-v4g7M8BGI_MJEgNNKREYYAlngtLApobPwBRlq1If6jkk0b0HxCE0RDIBKP1T2yL5-N9ZCmYoVP2oib9OZUkSE0B64uw7c_kRoDHUcTwdRrlLvH_cs',
};

export const userAddresses = [
  {
    id: 'home',
    label: 'Casa',
    icon: 'home',
    lines: ['Calle Principal 123, 4B', '28001 Madrid, España'],
    default: true,
  },
  {
    id: 'office',
    label: 'Oficina',
    icon: 'work',
    lines: ['Avenida de los Negocios 45', '28046 Madrid, España'],
    default: false,
  },
];

export const paymentMethods = [
  { id: 'visa', type: 'Visa terminada en 1234', expiry: '12/26', brand: 'VISA' },
  { id: 'apple', type: 'Billetera Digital (Apple Pay)', expiry: 'Conectado', brand: 'wallet' },
];

export const purchaseOrders: Order[] = [
  {
    id: 'NF-982341',
    date: '12 de Octubre, 2023',
    total: 1249,
    recipient: 'Alejandro Ramírez',
    status: 'delivered',
    product: {
      id: 'elite-sneakers',
      name: 'Nexus Elite Pro Running Shoes',
      price: 1249,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAlUoudUqSRpa5rq6lV2OvG3cLC5Hjkz7nPtwv2fu1RxT73DX0R4Vf4T5ZMMsH8tna0llXjwTLn6wcN_n87OExNQ8eGm8KWxuB6UM8w-NAiVPPUajd6W6E0PZgfsYaY26d_zlSYASwz6Q4oSVdgQG0C6JOheN1Om-d2y82Ee0hV_Q6qRS2AEMl6BwtgjunKhn3kue_z76ryhO11gjiQbcQ2iF3Ap2jp_mqivOoB-LhyDEeViCwTG5cfAdfW9gjjJQmsaqc6fhWS8y8',
      category: 'Calzado',
      rating: 5,
      reviewCount: 128,
    },
    variant: 'Talla: 27.5 MX | Color: Deep Space Blue',
  },
  {
    id: 'NF-772109',
    date: '28 de Septiembre, 2023',
    total: 450,
    status: 'delivered',
    product: {
      id: 'smart-band',
      name: 'Nexus Active Smart Band',
      price: 450,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBFi1RbgaDa2H803IUejpdT7lB6hUxN-J5ICh_Rd8AtY6z2DwMhUUyURoT7wLe-tWb6RHQckIxZScIskmlLZ5-WI-6v7_CfQQmQTwNDWhygHfBfwyAze-8ZNV1_-Vhc2dJj2rLKzOpD0LRG7SL_2XHNjUA0ia3kACHxI87NJgZ9i-9PgaXC6e5Prlv2CcZiLyt_gPKOrNPGmgNbeIQAy5Kigd6rZ_w-RPoNYEJTxIj_LRzkg4SBvCzBM71iyugND-0mC8n_oxoLJyg',
      category: 'Wearables',
      rating: 4.8,
      reviewCount: 89,
    },
    variant: 'Color: Pure White | Edición Limitada',
  },
];

export const orderHistoryExtended: Order[] = [
  {
    id: 'NF-88294',
    date: '24 Oct 2023',
    total: 1249,
    status: 'shipping',
    product: catalogProducts[0],
  },
  {
    id: 'NF-12345',
    date: '12 Oct 2023',
    total: 450,
    status: 'delivered',
    product: favoriteProducts[1],
  },
];

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
}

export const abandonedCartLines = [
  {
    product: {
      id: 'nexus-watch-s',
      name: 'Nexus Watch Series S',
      price: 299,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDyG8L0dCUVQ0o8zH7bUqAyzgIGgpnZW3gPOGh3nGxTbmUTdaEfTbgcwpnqaIy0IVddJOFpGDgh4NkwMph8o1l0j0bRxMp1TNW4IpK1vigCnwyPZ1aUfjMBGin6fkbIGMIxMkToXXFcRtgZj6l9fieZP3hzfD8DK_gfEFlLmHiL3iwLm3O5eXL4K1UKOM2SH8huvd1gyh2kTR-iIXRYkcXGkClVdPPKRly7ec9JqyALyEEuTM8R4S9VHtUBSxpJkU0gwlUMpidkBvg',
      category: 'Wearables',
      rating: 4.8,
      reviewCount: 210,
    },
    quantity: 1,
    variant: 'Acabado Titanio / Correa de Cuero',
  },
  {
    product: {
      id: 'acoustics-ultra',
      name: 'Acoustics Ultra Pro',
      price: 189.5,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuASYzvbhnEzl9MwafVdA4Tv1pit4Gc3jSs-o6telksGgDRECV3Al4IiPZd0ziLCk_a-yFdQg2Jk-aOqMZuaDY3Je9nH7DjvfmhKbUoGaYAncWRHJlz-iAIjcqO5OwGGmKGDTvq22Cf1hvDKCVobMVNBVEq2JKgb_QFW7f-__pA-TTggSj8b1ZuL7gkdUD7-NI3_2XYIlHndD_Cpjr55tedVrsSG5SEDNQTDFOivpcyaG7zx4caK4FwOo8Ulevp5rP2tqpZRTNm2qZw',
      category: 'Audio',
      rating: 4.9,
      reviewCount: 340,
    },
    quantity: 1,
    variant: 'Cancelación de Ruido Activa / Negro Mate',
  },
];

export type InvoiceRow = {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'processing' | 'pending';
};

export const invoices: InvoiceRow[] = [
  { id: 'NF-2024-001', date: '28 Oct 2024', amount: 1250, method: 'Visa **** 4421', status: 'completed' },
  { id: 'NF-2024-002', date: '25 Oct 2024', amount: 850.5, method: 'Transferencia', status: 'processing' },
  { id: 'NF-2024-003', date: '20 Oct 2024', amount: 125.5, method: 'PayPal', status: 'pending' },
  { id: 'NF-2024-004', date: '15 Oct 2024', amount: 349, method: 'Visa **** 4421', status: 'completed' },
];

export const invoiceSummary = {
  paidThisMonth: 2450,
  pendingRefunds: 125.5,
  defaultMethod: 'Visa **** 4421',
};

export function orderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    delivered: 'Entregado',
    shipping: 'En camino',
    processing: 'Procesando',
    cancelled: 'Cancelado',
  };
  return labels[status];
}

export type MessageThread = {
  id: string;
  name: string;
  preview: string;
  time: string;
  avatar: string;
  online?: boolean;
  unread?: number;
  important?: boolean;
};

export type ChatMessage = {
  role: 'them' | 'me';
  text: string;
  time: string;
};

export const messageThreads: MessageThread[] = [
  {
    id: 'carlos',
    name: 'Carlos Mendoza',
    preview: '¿Podrías enviarme la factura del pedido #4421?',
    time: '14:20',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBE6zRqkpBmiA-juFUBHRW5AYtt6M7eRbcq-g_QtZMvx6pgKae9ELqfYnAPK0GUHPD135MOa96-MP-64vgXOwVPB9OpPEptPSMbDEKWAhdEkN6kQ5YghCjwiERW6H9ap6reBvAEkj4imxHembkfk3ljiRMqPQdQ_HJ2BXWRn-Cpce_E9Rsf3odlXYY2ukeEGbTHGztVM1TVZ_w6YlrncIJnYyVgpjz-ZRxWzzvD6WcXzrLQMyDA6NQ8FoFXlw2ET2R6ho9c8t-3ZuE',
    online: true,
  },
  {
    id: 'elena',
    name: 'Elena Ruiz',
    preview: '¡Recibido! Muchas gracias por la gestión.',
    time: 'Ayer',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCY6bwhKGpWfwvRFrWrBzha-nY93O--PUIbjLUEBCkGxSQoToWkWdMZ0cdR2EL8hAI91sb313YVX6ovIVTznfYgEF4_UnuA05bL3gwfFF5bSOuDArVO-YO0lrugIhkvu7U2dMuKBi6kuEOojG1ngAoVetWqTFyppSoFLKbvu8FWPEOsy1AJJNq4_BUy7ri',
    unread: 2,
  },
  {
    id: 'soporte',
    name: 'Soporte NexusFlow',
    preview: 'Tu ticket #8821 ha sido actualizado.',
    time: 'Lun',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBGGnUd8vT9hn8wkhcLL1BFlHB6HwD4AZatU7lez5S8dMEiH24Ct-pWe5olPoyKr2I33hFhyCt6-15gw4QRtTCArD12k9-4bNRnUZ_PFZcNCyfKlprd8A9zCLmW-u8nKEfGQxxKzkTYSRY0qgreZkuhN_k5WbTPEhOn3gfcnUlrCYqRI2qDlDLdcEdrQjNsr8vDRun0oGkhjHnnHDjPt0jqHtgMV8kh0R0c9njxokCGzsY_FtoM0Ub3ulmssSpMn-znnAcJDwVDSaw',
    important: true,
  },
];

export const threadMessages: Record<string, ChatMessage[]> = {
  carlos: [
    {
      role: 'them',
      text: 'Hola, estoy revisando los últimos envíos. ¿Podrías confirmarme si el paquete #LX-442 ya salió del almacén?',
      time: '14:15',
    },
    {
      role: 'me',
      text: 'Sí, Carlos. Salió esta mañana a las 9:30. Deberías recibir el tracking en tu correo en unos minutos.',
      time: '14:18',
    },
    {
      role: 'them',
      text: '¿Podrías enviarme la factura del pedido #4421?',
      time: '14:20',
    },
  ],
  elena: [
    { role: 'them', text: '¡Recibido! Muchas gracias por la gestión.', time: 'Ayer' },
  ],
  soporte: [
    {
      role: 'them',
      text: 'Tu ticket #8821 ha sido actualizado. Un agente revisará tu solicitud en las próximas 2 horas.',
      time: 'Lun 09:00',
    },
  ],
};

export const messagingAiSuggestions = [
  'Adjuntar factura #4421',
  'Ver estado de envío',
  'Traducir',
] as const;

export const homeAiQuickReplies = [
  '¿Dónde está mi pedido?',
  'Recomiéndame ofertas',
  'Ayuda con devoluciones',
] as const;

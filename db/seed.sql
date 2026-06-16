-- Seed data for NexusFlow demo tables
-- Run this script in the Supabase SQL editor or with a compatible Postgres client.

CREATE TABLE IF NOT EXISTS favoritos (
  id_favorito uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario uuid REFERENCES profiles(id) ON DELETE CASCADE,
  id_producto uuid REFERENCES productos(id_producto) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

INSERT INTO categorias (id_categoria, nombre, descripcion) VALUES
  ('11111111-1111-4111-8111-111111111111', 'accesorios', 'Accesorios para completar el look y el uso diario'),
  ('22222222-2222-4222-8222-222222222222', 'bebidas', 'Bebidas frías, energéticas y listas para consumo inmediato'),
  ('33333333-3333-4333-8333-333333333333', 'camisas', 'Camisas versátiles para uso diario, oficina y venta rápida'),
  ('44444444-4444-4444-8444-444444444444', 'consolas', 'Consolas y accesorios gamer con inventario visible'),
  ('55555555-5555-4555-8555-555555555555', 'deportes', 'Artículos para entrenamiento, movimiento y bienestar'),
  ('66666666-6666-4666-8666-666666666662', 'hogar', 'Productos prácticos para hogar, cocina y organización'),
  ('77777777-7777-4777-8777-777777777777', 'laptops', 'Laptops para trabajo, estudio y productividad'),
  ('88888888-8888-4888-8888-888888888888', 'telefonos', 'Teléfonos inteligentes de entrada y gama media')
ON CONFLICT (id_categoria) DO NOTHING;

INSERT INTO productos (id_producto, nombre, descripcion, precio, stock, id_categoria, url) VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'Smartphone Nova', 'Teléfono inteligente con cámara profesional y batería extendida.', 109999, 12, '88888888-8888-4888-8888-888888888888', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'Laptop Air 14', 'Laptop ligera para movilidad y productividad, con pantalla nítida.', 289999, 7, '77777777-7777-4777-8777-777777777777', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc3', 'Auriculares Pro', 'Auriculares con cancelación activa de ruido y audio de alta fidelidad.', 12999, 25, '11111111-1111-4111-8111-111111111111', 'https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?auto=format&fit=crop&w=800&q=80'),
  ('dddddddd-dddd-4ddd-8ddd-ddddddddddd4', 'Bebida Energy', 'Bebida energética premium con extractos naturales y sabor refrescante.', 4999, 96, '22222222-2222-4222-8222-222222222222', 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=800&q=80'),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee5', 'Capa Running', 'Chaqueta ligera para entrenamiento outdoor con alta transpirabilidad.', 7499, 4, '55555555-5555-4555-8555-555555555555', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id_producto) DO NOTHING;

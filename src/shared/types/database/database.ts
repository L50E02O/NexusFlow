import type { CarritoInsert, CarritoRow, CarritoUpdate } from './carritos';
import type { CategoriaInsert, CategoriaRow, CategoriaUpdate } from './categorias';
import type { DetalleCarritoInsert, DetalleCarritoRow, DetalleCarritoUpdate } from './detalle-carritos';
import type { DetallePedidoInsert, DetallePedidoRow, DetallePedidoUpdate } from './detalle-pedidos';
import type { EnvioInsert, EnvioRow, EnvioUpdate } from './envios';
import type { PagoInsert, PagoRow, PagoUpdate } from './pagos';
import type { PedidoInsert, PedidoRow, PedidoUpdate } from './pedidos';
import type { ProductoInsert, ProductoRow, ProductoUpdate } from './productos';
import type { ProfileInsert, ProfileRow, ProfileUpdate } from './profiles';
import type { RecomendacionInsert, RecomendacionRow, RecomendacionUpdate } from './recomendacion';
import type { ResenaInsert, ResenaRow, ResenaUpdate } from './resenas';

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: ProfileRow;
				Insert: ProfileInsert;
				Update: ProfileUpdate;
			};
			pedidos: {
				Row: PedidoRow;
				Insert: PedidoInsert;
				Update: PedidoUpdate;
			};
			categorias: {
				Row: CategoriaRow;
				Insert: CategoriaInsert;
				Update: CategoriaUpdate;
			};
			productos: {
				Row: ProductoRow;
				Insert: ProductoInsert;
				Update: ProductoUpdate;
			};
			detalle_pedidos: {
				Row: DetallePedidoRow;
				Insert: DetallePedidoInsert;
				Update: DetallePedidoUpdate;
			};
			carritos: {
				Row: CarritoRow;
				Insert: CarritoInsert;
				Update: CarritoUpdate;
			};
			detalle_carritos: {
				Row: DetalleCarritoRow;
				Insert: DetalleCarritoInsert;
				Update: DetalleCarritoUpdate;
			};
			pagos: {
				Row: PagoRow;
				Insert: PagoInsert;
				Update: PagoUpdate;
			};
			envios: {
				Row: EnvioRow;
				Insert: EnvioInsert;
				Update: EnvioUpdate;
			};
			resenas: {
				Row: ResenaRow;
				Insert: ResenaInsert;
				Update: ResenaUpdate;
			};
			recomendacion: {
				Row: RecomendacionRow;
				Insert: RecomendacionInsert;
				Update: RecomendacionUpdate;
			};
		};
	};
}
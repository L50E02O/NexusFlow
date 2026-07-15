import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductFormModal } from './ProductFormModal';

vi.mock('@/shared/i18n/I18nContext', () => ({
  useI18n: () => ({
    locale: 'es',
    setLocale: vi.fn(),
    t: (k: string) => k,
  }),
}));
vi.mock('@/shared/hooks/useCategorias', () => ({
  useCategorias: () => ({
    categories: [],
    loading: false,
    error: null,
  }),
}));
vi.mock('@/shared/hooks/useFocusTrap', () => ({
  useFocusTrap: vi.fn(),
}));
vi.mock('@/shared/ui/Icon', () => ({
  Icon: (props: any) => <span data-icon={props.name} />,
}));
vi.mock('@/entities/productos/api/productos.repository', () => ({
  productosRepository: {
    create: vi.fn(),
    update: vi.fn(),
  },
}));
vi.mock('./DragDropUpload', () => ({
  DragDropUpload: () => <div data-testid="drag-drop" />,
}));

describe('ProductFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <ProductFormModal open={false} onClose={vi.fn()} onSaved={vi.fn()} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders form in create mode', () => {
    render(
      <ProductFormModal open={true} onClose={vi.fn()} onSaved={vi.fn()} />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('merchant.newProduct')).toBeInTheDocument();
    expect(screen.getByLabelText(/merchant.productName/i)).toBeInTheDocument();
  });
});

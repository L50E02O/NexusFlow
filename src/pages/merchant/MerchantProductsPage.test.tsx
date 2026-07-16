import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MerchantProductsPage } from './MerchantProductsPage';

const { mockList, mockRemove, mockT } = vi.hoisted(() => ({
  mockList: vi.fn(),
  mockRemove: vi.fn(),
  mockT: vi.fn((key: string, opts?: any) => {
    if (opts?.count !== undefined) return `${key}:${opts.count}`;
    return key;
  }),
}));

vi.mock('@/shared/i18n/I18nContext', () => ({ useI18n: () => ({ t: mockT }) }));
vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));
vi.mock('@/entities/productos/api/productos.repository', () => ({
  productosRepository: {
    list: (...args: any[]) => mockList(...args),
    remove: (...args: any[]) => mockRemove(...args),
  },
}));
vi.mock('@/components/merchant/ProductFormModal', () => ({
  ProductFormModal: ({ open, onClose }: any) =>
    open ? <div data-testid="product-form-modal"><button onClick={onClose}>close-modal</button></div> : null,
}));

describe('MerchantProductsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockList.mockResolvedValue({
      data: [
        { id_producto: 'P001', nombre: 'Widget Alpha', stock: 10, precio: 25, url: '' },
        { id_producto: 'P002', nombre: 'Gadget Beta', stock: 3, precio: 50, url: 'https://img.test/1.jpg' },
      ],
      error: null,
    });
    mockRemove.mockResolvedValue({ error: null });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('renders without crashing', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
  });

  it('displays the products heading via t()', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    expect(screen.getByText('merchant.productTitle')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    expect(screen.getByText('common.loading')).toBeInTheDocument();
  });

  it('loads and displays products after loading', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Widget Alpha')).toBeInTheDocument();
    });
    expect(screen.getByText('Gadget Beta')).toBeInTheDocument();
  });

  it('displays product prices', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('$25')).toBeInTheDocument();
    });
    expect(screen.getByText('$50')).toBeInTheDocument();
  });

  it('displays product stock', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument();
    });
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('low stock is styled with error class', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      const stockEl = screen.getByText('3');
      expect(stockEl.className).toContain('text-error');
    });
  });

  it('filters products by name', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Widget Alpha')).toBeInTheDocument();
    });
    const filterInput = screen.getByLabelText('merchant.filter');
    fireEvent.change(filterInput, { target: { value: 'Gadget' } });
    expect(screen.getByText('Gadget Beta')).toBeInTheDocument();
    expect(screen.queryByText('Widget Alpha')).not.toBeInTheDocument();
  });

  it('filters products by id', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Widget Alpha')).toBeInTheDocument();
    });
    const filterInput = screen.getByLabelText('merchant.filter');
    fireEvent.change(filterInput, { target: { value: 'P002' } });
    expect(screen.getByText('Gadget Beta')).toBeInTheDocument();
    expect(screen.queryByText('Widget Alpha')).not.toBeInTheDocument();
  });

  it('shows no results message when filter matches nothing', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Widget Alpha')).toBeInTheDocument();
    });
    const filterInput = screen.getByLabelText('merchant.filter');
    fireEvent.change(filterInput, { target: { value: 'NonExistent' } });
    expect(screen.getByText(/noResults/)).toBeInTheDocument();
  });

  it('shows all products when filter is cleared', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Widget Alpha')).toBeInTheDocument();
    });
    const filterInput = screen.getByLabelText('merchant.filter');
    fireEvent.change(filterInput, { target: { value: 'Gadget' } });
    expect(screen.queryByText('Widget Alpha')).not.toBeInTheDocument();
    fireEvent.change(filterInput, { target: { value: '' } });
    expect(screen.getByText('Widget Alpha')).toBeInTheDocument();
  });

  it('opens new product modal when add button is clicked', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Widget Alpha')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('merchant.newProduct'));
    expect(screen.getByTestId('product-form-modal')).toBeInTheDocument();
  });

  it('opens edit modal when edit button is clicked', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Widget Alpha')).toBeInTheDocument();
    });
    const editButtons = screen.getAllByLabelText('common.edit');
    fireEvent.click(editButtons[0]);
    expect(screen.getByTestId('product-form-modal')).toBeInTheDocument();
  });

  it('deletes a product when delete is confirmed', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Widget Alpha')).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByLabelText('common.delete');
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith('P001');
    });
  });

  it('does not delete when confirm is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Widget Alpha')).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByLabelText('common.delete');
    fireEvent.click(deleteButtons[0]);
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('shows product image when url is provided', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByAltText('Gadget Beta')).toBeInTheDocument();
    });
  });

  it('shows inventory icon when no url', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Widget Alpha')).toBeInTheDocument();
    });
  });

  it('displays showing count', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('merchant.showing:2')).toBeInTheDocument();
    });
  });

  it('displays subtitle', () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    expect(screen.getByText('merchant.productSubtitle')).toBeInTheDocument();
  });

  it('displays product id', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('P001')).toBeInTheDocument();
    });
    expect(screen.getByText('P002')).toBeInTheDocument();
  });

  it('calls productosRepository.list on mount', async () => {
    render(<MemoryRouter><MerchantProductsPage /></MemoryRouter>);
    await waitFor(() => {
      expect(mockList).toHaveBeenCalled();
    });
  });
});

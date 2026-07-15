import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DragDropUpload } from './DragDropUpload';

vi.mock('@/shared/i18n/I18nContext', () => ({
  useI18n: () => ({
    locale: 'es',
    setLocale: vi.fn(),
    t: (k: string) => k,
  }),
}));
vi.mock('@/shared/ui/Icon', () => ({
  Icon: (props: any) => <span data-icon={props.name} />,
}));

describe('DragDropUpload', () => {
  let onFileSelect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    onFileSelect = vi.fn();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
  });

  it('renders the drop zone with upload text', () => {
    render(<DragDropUpload onFileSelect={onFileSelect} />);
    expect(screen.getByText('merchant.productImageDragDrop')).toBeInTheDocument();
    expect(screen.getByText('merchant.productImageTypes')).toBeInTheDocument();
  });

  it('renders file input element', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  it('accepts valid jpeg file via input change', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1024 });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('accepts valid png file via input change', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['image'], 'test.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 1024 });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('accepts valid webp file via input change', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['image'], 'test.webp', { type: 'image/webp' });
    Object.defineProperty(file, 'size', { value: 1024 });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('rejects invalid file type', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['data'], 'test.gif', { type: 'image/gif' });
    Object.defineProperty(file, 'size', { value: 1024 });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileSelect).toHaveBeenCalledWith(null);
    expect(screen.getByText('merchant.productImageInvalidType')).toBeInTheDocument();
  });

  it('rejects file exceeding 5MB size limit', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileSelect).toHaveBeenCalledWith(null);
    expect(screen.getByText('merchant.productImageInvalidSize')).toBeInTheDocument();
  });

  it('handles dragOver event', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    const dropzone = container.querySelector('[class*="border-dashed"]')!;
    fireEvent.dragOver(dropzone);
    expect(dropzone.className).toContain('border-primary');
  });

  it('handles dragLeave event', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    const dropzone = container.querySelector('[class*="border-dashed"]')!;
    fireEvent.dragOver(dropzone);
    fireEvent.dragLeave(dropzone);
    expect(dropzone.className).toContain('border-outline-variant');
  });

  it('handles drop with valid file', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    const dropzone = container.querySelector('[class*="border-dashed"]')!;
    const file = new File(['image'], 'dropped.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1024 });
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
    });
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('handles drop with invalid file type', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    const dropzone = container.querySelector('[class*="border-dashed"]')!;
    const file = new File(['data'], 'dropped.bmp', { type: 'image/bmp' });
    Object.defineProperty(file, 'size', { value: 1024 });
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
    });
    expect(onFileSelect).toHaveBeenCalledWith(null);
    expect(screen.getByText('merchant.productImageInvalidType')).toBeInTheDocument();
  });

  it('handles drop with empty file list', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    const dropzone = container.querySelector('[class*="border-dashed"]')!;
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [] },
    });
    expect(onFileSelect).not.toHaveBeenCalled();
  });

  it('shows preview image when valid file is selected', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['image'], 'preview.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1024 });
    fireEvent.change(input, { target: { files: [file] } });
    const img = screen.getByAltText('merchant.productImagePreview');
    expect(img).toBeInTheDocument();
  });

  it('removes preview when remove button is clicked', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['image'], 'preview.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1024 });
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByLabelText('common.remove'));
    expect(onFileSelect).toHaveBeenLastCalledWith(null);
    expect(screen.getByText('merchant.productImageDragDrop')).toBeInTheDocument();
  });

  it('shows error state styling for invalid type', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['data'], 'bad.bmp', { type: 'image/bmp' });
    Object.defineProperty(file, 'size', { value: 1024 });
    fireEvent.change(input, { target: { files: [file] } });
    const dropzone = container.querySelector('[class*="border-dashed"]')!;
    expect(dropzone.className).toContain('border-error');
  });

  it('clicking drop zone triggers file input', () => {
    const { container } = render(<DragDropUpload onFileSelect={onFileSelect} />);
    const dropzone = container.querySelector('[class*="border-dashed"]')!;
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');
    fireEvent.click(dropzone);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('renders with existing value prop', () => {
    const file = new File(['image'], 'existing.jpg', { type: 'image/jpeg' });
    render(<DragDropUpload onFileSelect={onFileSelect} value={file} />);
    expect(screen.getByAltText('merchant.productImagePreview')).toBeInTheDocument();
  });
});

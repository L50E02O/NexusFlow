import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import { useI18n } from '@/shared/i18n/I18nContext';
import { Icon } from '@/shared/ui/Icon';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export type FileValidationError = 'invalid-type' | 'invalid-size' | null;

type DragDropUploadProps = {
  onFileSelect: (file: File | null) => void;
  value?: File | null;
};

export function DragDropUpload({ onFileSelect, value }: DragDropUploadProps) {
  const { t } = useI18n();
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    value ? URL.createObjectURL(value) : null,
  );
  const [error, setError] = useState<FileValidationError>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('invalid-type');
        setPreview(null);
        onFileSelect(null);
        return;
      }
      if (file.size > MAX_SIZE) {
        setError('invalid-size');
        setPreview(null);
        onFileSelect(null);
        return;
      }
      setError(null);
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    },
    [onFileSelect],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        validateAndSet(files[0]);
      }
    },
    [validateAndSet],
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        validateAndSet(files[0]);
      }
    },
    [validateAndSet],
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    setError(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onFileSelect]);

  return (
    <div className="space-y-sm">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-sm rounded-xl border-2 border-dashed p-md text-center transition-all ${
          dragging
            ? 'border-primary bg-primary-container/20'
            : error
              ? 'border-error bg-error-container/10'
              : 'border-outline-variant bg-surface-container hover:border-primary hover:bg-surface-container-high'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="sr-only"
          aria-hidden="true"
        />

        {preview ? (
          <div className="relative w-full max-w-[200px]">
            <img
              src={preview}
              alt={t('merchant.productImagePreview')}
              className="w-full h-auto max-h-[160px] rounded-lg object-contain bg-surface"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove(); }}
              aria-label={t('common.remove')}
              className="absolute -top-2 -right-2 flex min-h-6 min-w-6 items-center justify-center rounded-full bg-error text-on-error text-xs shadow"
            >
              <Icon name="close" />
            </button>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-sm text-error">
            <Icon name="error" className="text-3xl" />
            <p className="text-body-md font-medium">
              {error === 'invalid-type'
                ? t('merchant.productImageInvalidType')
                : t('merchant.productImageInvalidSize')}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-sm text-on-surface-variant">
            <Icon name="cloud_upload" className="text-4xl text-outline" />
            <p className="text-body-md font-medium">
              {t('merchant.productImageDragDrop')}
            </p>
            <p className="text-label-md text-outline">
              {t('merchant.productImageTypes')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SettingsPage } from './SettingsPage';

const mocks = vi.hoisted(() => ({
  mockUseI18n: vi.fn(),
  mockUseAccessibility: vi.fn(),
  mockUseWcagCriterios: vi.fn(),
}));

vi.mock('@/shared/i18n/I18nContext', () => ({ useI18n: () => mocks.mockUseI18n() }));
vi.mock('@/shared/context/AccessibilityContext', () => ({ useAccessibility: () => mocks.mockUseAccessibility() }));
vi.mock('@/shared/hooks/useWcagCriterios', () => ({ useWcagCriterios: () => mocks.mockUseWcagCriterios() }));
vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));
vi.mock('@/shared/ui/DataStatus', () => ({ DataStatus: () => <div data-testid="data-status" /> }));

describe('SettingsPage', () => {
  const mockSetLocale = vi.fn();
  const mockSetDarkMode = vi.fn();
  const mockSetTextScale = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockUseI18n.mockReturnValue({ locale: 'es', setLocale: mockSetLocale });
    mocks.mockUseAccessibility.mockReturnValue({ darkMode: false, setDarkMode: mockSetDarkMode, textScale: 1, setTextScale: mockSetTextScale });
    mocks.mockUseWcagCriterios.mockReturnValue({ groupedByPrincipio: {}, loading: false, error: null });
  });

  it('renders page heading', () => {
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getByText('Configuración de NexusFlow')).toBeInTheDocument();
  });

  it('renders account section', () => {
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getByText('Gestión de Cuenta')).toBeInTheDocument();
  });

  it('renders danger zone', () => {
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getByText('Zona de Peligro')).toBeInTheDocument();
    expect(screen.getByText('Eliminar mi cuenta')).toBeInTheDocument();
  });

  it('renders accessibility section with WCAG criteria', () => {
    mocks.mockUseWcagCriterios.mockReturnValue({
      groupedByPrincipio: { 'Principio 1': [{ id: '1.1.1', criterio: '1.1.1', nombre: 'Textos', nivel: 'A', estado: 'C', que_verificar: 'ver', como_implementarlo: 'impl' }] },
      loading: false,
      error: null,
    });
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getAllByText('Accesibilidad').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('1.1.1')).toBeInTheDocument();
  });

  it('renders all sidebar navigation items', () => {
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getByText('Cuenta')).toBeInTheDocument();
    expect(screen.getByText('Privacidad')).toBeInTheDocument();
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    expect(screen.getByText('Preferencias')).toBeInTheDocument();
    expect(screen.getAllByText('Accesibilidad').length).toBeGreaterThanOrEqual(1);
  });

  it('renders form fields with user data', () => {
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getByLabelText(/Nombre Completo/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/)).toBeInTheDocument();
    expect(screen.getByText('Guardar cambios')).toBeInTheDocument();
    expect(screen.getByText('Cambiar contraseña')).toBeInTheDocument();
  });

  it('renders privacy section rows', () => {
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getByText('Privacidad y Datos')).toBeInTheDocument();
    expect(screen.getByText('Permisos de datos')).toBeInTheDocument();
    expect(screen.getByText('Historial de actividad')).toBeInTheDocument();
    expect(screen.getByText('Visibilidad del perfil')).toBeInTheDocument();
  });

  it('renders notification toggles', () => {
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getByText('Centro de Notificaciones')).toBeInTheDocument();
    expect(screen.getByText('Correos electrónicos')).toBeInTheDocument();
    expect(screen.getByText('Alertas Push')).toBeInTheDocument();
    expect(screen.getByText('Mensajes promocionales')).toBeInTheDocument();
    expect(screen.getByText('Actualizaciones de pedidos')).toBeInTheDocument();
  });

  it('renders language selector', () => {
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    const select = screen.getByLabelText('Idioma');
    expect(select).toBeInTheDocument();
    fireEvent.change(select, { target: { value: 'en' } });
    expect(mockSetLocale).toHaveBeenCalledWith('en');
  });

  it('toggles dark mode switch', () => {
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    const toggle = screen.getByRole('switch', { name: /modo oscuro/i });
    fireEvent.click(toggle);
    expect(mockSetDarkMode).toHaveBeenCalledWith(true);
  });

  it('renders text scale slider', () => {
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getByText('Tamaño de texto')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    const slider = screen.getByLabelText('Tamaño de texto');
    expect(slider).toBeInTheDocument();
  });

  it('renders display preferences section', () => {
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getByText('Preferencias de Visualización')).toBeInTheDocument();
    expect(screen.getByText('Modo Oscuro')).toBeInTheDocument();
    expect(screen.getByText('Activa una interfaz más descansada para tus ojos.')).toBeInTheDocument();
  });

  it('renders keyboard navigation checkbox', () => {
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getByText('Navegación Teclado')).toBeInTheDocument();
  });

  it('renders WCAG criteria with loading state', () => {
    mocks.mockUseWcagCriterios.mockReturnValue({ groupedByPrincipio: {}, loading: true, error: null });
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getAllByText('Accesibilidad').length).toBeGreaterThanOrEqual(1);
  });

  it('renders WCAG criteria with pending estado', () => {
    mocks.mockUseWcagCriterios.mockReturnValue({
      groupedByPrincipio: { 'Principio 2': [{ id: '2.1.1', criterio: '2.1.1', nombre: 'Teclado', nivel: 'A', estado: 'P', que_verificar: 'teclado', como_implementarlo: 'impl' }] },
      loading: false,
      error: null,
    });
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('renders WCAG criteria with En progreso estado', () => {
    mocks.mockUseWcagCriterios.mockReturnValue({
      groupedByPrincipio: { 'Principio 3': [{ id: '3.1.1', criterio: '3.1.1', nombre: 'Idioma', nivel: 'A', estado: 'En', que_verificar: 'lang', como_implementarlo: 'html lang' }] },
      loading: false,
      error: null,
    });
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getByText('En progreso')).toBeInTheDocument();
  });
});

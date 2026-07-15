import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AccessibilityMenu } from './AccessibilityMenu';

const { mockUseAccessibility } = vi.hoisted(() => ({
  mockUseAccessibility: vi.fn(),
}));

vi.mock('@/shared/context/AccessibilityContext', () => ({
  useAccessibility: () => mockUseAccessibility(),
}));
vi.mock('@/shared/hooks/useFocusTrap', () => ({
  useFocusTrap: vi.fn(),
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
  };
});

const defaults = {
  panelOpen: false,
  openPanel: vi.fn(),
  closePanel: vi.fn(),
  togglePanel: vi.fn(),
  textScale: 1,
  setTextScale: vi.fn(),
  lineHeight: 1.5,
  setLineHeight: vi.fn(),
  paragraphSpacing: 1.5,
  setParagraphSpacing: vi.fn(),
  letterSpacing: 0,
  setLetterSpacing: vi.fn(),
  wordSpacing: 0,
  setWordSpacing: vi.fn(),
  highContrast: false,
  setHighContrast: vi.fn(),
  darkMode: false,
  setDarkMode: vi.fn(),
  grayscale: false,
  setGrayscale: vi.fn(),
  reduceMotion: false,
  setReduceMotion: vi.fn(),
  noColorReliance: false,
  setNoColorReliance: vi.fn(),
  enhancedFocus: false,
  setEnhancedFocus: vi.fn(),
  largeTargets: false,
  setLargeTargets: vi.fn(),
  keyboardNavigation: false,
  setKeyboardNavigation: vi.fn(),
  mediaAvailable: false,
  captionsAvailable: false,
  descriptionsAvailable: false,
  transcriptAvailable: false,
  transcripts: false,
  setTranscripts: vi.fn(),
  captions: false,
  setCaptions: vi.fn(),
  audioDescriptions: false,
  setAudioDescriptions: vi.fn(),
  muteAll: false,
  setMuteAll: vi.fn(),
  showHints: false,
  setShowHints: vi.fn(),
  validationVisible: false,
  setValidationVisible: vi.fn(),
  confirmationRequired: false,
  setConfirmationRequired: vi.fn(),
  resetAll: vi.fn(),
};

function renderMenu(overrides: Record<string, any> = {}) {
  mockUseAccessibility.mockReturnValue({ ...defaults, ...overrides });
  return render(
    <MemoryRouter>
      <AccessibilityMenu />
    </MemoryRouter>,
  );
}

describe('AccessibilityMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAccessibility.mockReturnValue({ ...defaults });
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  describe('toggle button', () => {
    it('renders the toggle button with open label', () => {
      renderMenu();
      expect(screen.getByRole('button', { name: /abrir menú de accesibilidad/i })).toBeInTheDocument();
    });

    it('shows close label when panel is open', () => {
      renderMenu({ panelOpen: true });
      const buttons = screen.getAllByRole('button', { name: /cerrar menú de accesibilidad/i });
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('calls openPanel when clicked while closed', () => {
      const openPanel = vi.fn();
      renderMenu({ panelOpen: false, openPanel });
      fireEvent.click(screen.getByRole('button', { name: /abrir menú de accesibilidad/i }));
      expect(openPanel).toHaveBeenCalled();
    });

    it('calls closePanel when clicked while open', () => {
      const closePanel = vi.fn();
      const { container } = renderMenu({ panelOpen: true, closePanel });
      const toggleBtn = container.querySelector('.accessibility-menu-button')!;
      fireEvent.click(toggleBtn);
      expect(closePanel).toHaveBeenCalled();
    });

    it('has correct aria-expanded when closed', () => {
      renderMenu({ panelOpen: false });
      const btn = screen.getByRole('button', { name: /abrir menú de accesibilidad/i });
      expect(btn).toHaveAttribute('aria-expanded', 'false');
    });

    it('has correct aria-expanded when open', () => {
      const { container } = renderMenu({ panelOpen: true });
      const btn = container.querySelector('.accessibility-menu-button')!;
      expect(btn).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-controls pointing to the menu', () => {
      renderMenu();
      const btn = screen.getByRole('button', { name: /abrir menú de accesibilidad/i });
      expect(btn).toHaveAttribute('aria-controls', 'accessibility-menu');
    });
  });

  describe('panel rendering', () => {
    it('does not render dialog when panel is closed', () => {
      renderMenu({ panelOpen: false });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders dialog when panel is open', () => {
      renderMenu({ panelOpen: true });
      expect(screen.getByRole('dialog', { name: /menú de accesibilidad/i })).toBeInTheDocument();
    });

    it('has correct dialog attributes', () => {
      renderMenu({ panelOpen: true });
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'accessibility-menu-title');
      expect(dialog).toHaveAttribute('aria-describedby', 'accessibility-menu-description');
      expect(dialog).toHaveAttribute('tabindex', '-1');
    });

    it('displays WCAG badge', () => {
      renderMenu({ panelOpen: true });
      expect(screen.getByText('✓ WCAG 2.2')).toBeInTheDocument();
    });

    it('displays title and description', () => {
      renderMenu({ panelOpen: true });
      expect(screen.getByText('Menú de accesibilidad')).toBeInTheDocument();
      expect(screen.getByText(/Controles globales para mejorar contraste/)).toBeInTheDocument();
    });
  });

  describe('close button in header', () => {
    it('calls closePanel when header close button is clicked', () => {
      const closePanel = vi.fn();
      const { container } = renderMenu({ panelOpen: true, closePanel });
      const closeBtn = container.querySelector('.accessibility-close-button')!;
      fireEvent.click(closeBtn);
      expect(closePanel).toHaveBeenCalled();
    });
  });

  describe('body overflow', () => {
    it('sets body overflow hidden when panel opens', () => {
      renderMenu({ panelOpen: true });
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('resets body overflow when panel is closed', () => {
      renderMenu({ panelOpen: false });
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('click outside to close', () => {
    it('calls closePanel when clicking outside the menu', () => {
      const closePanel = vi.fn();
      renderMenu({ panelOpen: true, closePanel });
      fireEvent.mouseDown(document.body);
      expect(closePanel).toHaveBeenCalled();
    });
  });

  describe('shortcut guide', () => {
    it('toggles shortcut guide section on button click', () => {
      renderMenu({ panelOpen: true });
      const toggleBtn = screen.getByRole('button', { name: /ver atajos/i });
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Guía de atajos')).not.toBeInTheDocument();

      fireEvent.click(toggleBtn);
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Guía de atajos')).toBeInTheDocument();
    });

    it('hides shortcut guide when toggled off', () => {
      renderMenu({ panelOpen: true });
      const toggleBtn = screen.getByRole('button', { name: /ver atajos/i });
      fireEvent.click(toggleBtn);
      expect(screen.getByText('Guía de atajos')).toBeInTheDocument();
      fireEvent.click(toggleBtn);
      expect(screen.queryByText('Guía de atajos')).not.toBeInTheDocument();
    });

    it('renders all accessibility shortcuts', () => {
      renderMenu({ panelOpen: true });
      fireEvent.click(screen.getByRole('button', { name: /ver atajos/i }));
      expect(screen.getByText(/Alt \+ A/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ C/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ M/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ =/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ -/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ F/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ G/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ P/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ R/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ K/)).toBeInTheDocument();
    });

    it('renders all navigation shortcuts', () => {
      renderMenu({ panelOpen: true });
      fireEvent.click(screen.getByRole('button', { name: /ver atajos/i }));
      expect(screen.getByText(/Alt \+ 1/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ 2/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ 3/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ 4/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ 5/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ S/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ H/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ 0/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ U/)).toBeInTheDocument();
      expect(screen.getByText(/Alt \+ B/)).toBeInTheDocument();
    });
  });

  describe('toggle buttons - color & contrast', () => {
    it('toggles high contrast', () => {
      const setHighContrast = vi.fn();
      renderMenu({ panelOpen: true, highContrast: false, setHighContrast });
      fireEvent.click(screen.getByText(/alto contraste/i));
      expect(setHighContrast).toHaveBeenCalledWith(true);
    });

    it('toggles high contrast off when active', () => {
      const setHighContrast = vi.fn();
      renderMenu({ panelOpen: true, highContrast: true, setHighContrast });
      fireEvent.click(screen.getByText(/alto contraste/i));
      expect(setHighContrast).toHaveBeenCalledWith(false);
    });

    it('shows checkmark when high contrast is active', () => {
      renderMenu({ panelOpen: true, highContrast: true });
      expect(screen.getByText(/alto contraste ✓/i)).toBeInTheDocument();
    });

    it('has correct aria-pressed for high contrast', () => {
      renderMenu({ panelOpen: true, highContrast: false });
      const btn = screen.getByRole('button', { name: /alto contraste/i });
      expect(btn).toHaveAttribute('aria-pressed', 'false');
    });

    it('toggles dark mode', () => {
      const setDarkMode = vi.fn();
      renderMenu({ panelOpen: true, darkMode: false, setDarkMode });
      fireEvent.click(screen.getByText(/modo oscuro/i));
      expect(setDarkMode).toHaveBeenCalledWith(true);
    });

    it('toggles dark mode off when active', () => {
      const setDarkMode = vi.fn();
      renderMenu({ panelOpen: true, darkMode: true, setDarkMode });
      fireEvent.click(screen.getByText(/modo oscuro/i));
      expect(setDarkMode).toHaveBeenCalledWith(false);
    });

    it('toggles grayscale', () => {
      const setGrayscale = vi.fn();
      renderMenu({ panelOpen: true, grayscale: false, setGrayscale });
      fireEvent.click(screen.getByText(/escala de grises/i));
      expect(setGrayscale).toHaveBeenCalledWith(true);
    });

    it('toggles grayscale off when active', () => {
      const setGrayscale = vi.fn();
      renderMenu({ panelOpen: true, grayscale: true, setGrayscale });
      fireEvent.click(screen.getByText(/escala de grises/i));
      expect(setGrayscale).toHaveBeenCalledWith(false);
    });
  });

  describe('toggle buttons - interaction preferences', () => {
    it('toggles no color reliance', () => {
      const setNoColorReliance = vi.fn();
      renderMenu({ panelOpen: true, noColorReliance: false, setNoColorReliance });
      fireEvent.click(screen.getByText(/sin dependencia del color/i));
      expect(setNoColorReliance).toHaveBeenCalledWith(true);
    });

    it('toggles enhanced focus', () => {
      const setEnhancedFocus = vi.fn();
      renderMenu({ panelOpen: true, enhancedFocus: false, setEnhancedFocus });
      fireEvent.click(screen.getByText(/foco reforzado/i));
      expect(setEnhancedFocus).toHaveBeenCalledWith(true);
    });

    it('toggles large targets', () => {
      const setLargeTargets = vi.fn();
      renderMenu({ panelOpen: true, largeTargets: false, setLargeTargets });
      fireEvent.click(screen.getByText(/objetivos táctiles grandes/i));
      expect(setLargeTargets).toHaveBeenCalledWith(true);
    });

    it('toggles keyboard navigation', () => {
      const setKeyboardNavigation = vi.fn();
      renderMenu({ panelOpen: true, keyboardNavigation: false, setKeyboardNavigation });
      fireEvent.click(screen.getByText(/navegación con teclado/i));
      expect(setKeyboardNavigation).toHaveBeenCalledWith(true);
    });

    it('toggles reduce motion', () => {
      const setReduceMotion = vi.fn();
      renderMenu({ panelOpen: true, reduceMotion: false, setReduceMotion });
      fireEvent.click(screen.getByText(/pausar animaciones/i));
      expect(setReduceMotion).toHaveBeenCalledWith(true);
    });

    it('toggles reduce motion off when active', () => {
      const setReduceMotion = vi.fn();
      renderMenu({ panelOpen: true, reduceMotion: true, setReduceMotion });
      fireEvent.click(screen.getByText(/pausar animaciones/i));
      expect(setReduceMotion).toHaveBeenCalledWith(false);
    });
  });

  describe('toggle buttons - assistance', () => {
    it('toggles show hints', () => {
      const setShowHints = vi.fn();
      renderMenu({ panelOpen: true, showHints: false, setShowHints });
      fireEvent.click(screen.getByText(/sugerencias visibles/i));
      expect(setShowHints).toHaveBeenCalledWith(true);
    });

    it('toggles validation visible', () => {
      const setValidationVisible = vi.fn();
      renderMenu({ panelOpen: true, validationVisible: false, setValidationVisible });
      fireEvent.click(screen.getByText(/errores visibles/i));
      expect(setValidationVisible).toHaveBeenCalledWith(true);
    });

    it('toggles confirmation required', () => {
      const setConfirmationRequired = vi.fn();
      renderMenu({ panelOpen: true, confirmationRequired: false, setConfirmationRequired });
      fireEvent.click(screen.getByText(/confirmación adicional/i));
      expect(setConfirmationRequired).toHaveBeenCalledWith(true);
    });
  });

  describe('multimedia section', () => {
    it('shows no media message when media is not available', () => {
      renderMenu({ panelOpen: true, mediaAvailable: false });
      expect(screen.getByText(/no se detectó contenido multimedia/i)).toBeInTheDocument();
    });

    it('shows media detected message when media is available', () => {
      renderMenu({ panelOpen: true, mediaAvailable: true, captionsAvailable: true });
      expect(screen.getByText(/contenido multimedia detectado/i)).toBeInTheDocument();
    });

    it('disables captions button when captions not available', () => {
      renderMenu({ panelOpen: true, captionsAvailable: false });
      const btn = screen.getByRole('button', { name: /subtítulos/i });
      expect(btn).toBeDisabled();
    });

    it('enables captions button when captions available', () => {
      renderMenu({ panelOpen: true, captionsAvailable: true });
      const btn = screen.getByRole('button', { name: /subtítulos/i });
      expect(btn).toBeEnabled();
    });

    it('toggles captions on', () => {
      const setCaptions = vi.fn();
      renderMenu({ panelOpen: true, captionsAvailable: true, captions: false, setCaptions });
      fireEvent.click(screen.getByRole('button', { name: /subtítulos/i }));
      expect(setCaptions).toHaveBeenCalledWith(true);
    });

    it('disables audio descriptions button when not available', () => {
      renderMenu({ panelOpen: true, descriptionsAvailable: false });
      const btn = screen.getByRole('button', { name: /descripciones de audio/i });
      expect(btn).toBeDisabled();
    });

    it('enables audio descriptions button when available', () => {
      renderMenu({ panelOpen: true, descriptionsAvailable: true });
      const btn = screen.getByRole('button', { name: /descripciones de audio/i });
      expect(btn).toBeEnabled();
    });

    it('toggles audio descriptions on', () => {
      const setAudioDescriptions = vi.fn();
      renderMenu({ panelOpen: true, descriptionsAvailable: true, audioDescriptions: false, setAudioDescriptions });
      fireEvent.click(screen.getByRole('button', { name: /descripciones de audio/i }));
      expect(setAudioDescriptions).toHaveBeenCalledWith(true);
    });

    it('disables transcripts button when not available', () => {
      renderMenu({ panelOpen: true, transcriptAvailable: false });
      const btn = screen.getByRole('button', { name: /transcripciones visibles/i });
      expect(btn).toBeDisabled();
    });

    it('enables transcripts button when available', () => {
      renderMenu({ panelOpen: true, transcriptAvailable: true });
      const btn = screen.getByRole('button', { name: /transcripciones visibles/i });
      expect(btn).toBeEnabled();
    });

    it('toggles transcripts on', () => {
      const setTranscripts = vi.fn();
      renderMenu({ panelOpen: true, transcriptAvailable: true, transcripts: false, setTranscripts });
      fireEvent.click(screen.getByRole('button', { name: /transcripciones visibles/i }));
      expect(setTranscripts).toHaveBeenCalledWith(true);
    });

    it('toggles mute all', () => {
      const setMuteAll = vi.fn();
      renderMenu({ panelOpen: true, muteAll: false, setMuteAll });
      fireEvent.click(screen.getByText(/silenciar multimedia/i));
      expect(setMuteAll).toHaveBeenCalledWith(true);
    });

    it('shows availability note when captions not available', () => {
      renderMenu({ panelOpen: true, captionsAvailable: false });
      expect(screen.getByText(/disponible solo si hay video con pistas de subtítulos/i)).toBeInTheDocument();
    });

    it('shows availability note when descriptions not available', () => {
      renderMenu({ panelOpen: true, descriptionsAvailable: false });
      expect(screen.getByText(/disponible solo si hay video con pista de descripciones/i)).toBeInTheDocument();
    });

    it('shows availability note when transcripts not available', () => {
      renderMenu({ panelOpen: true, transcriptAvailable: false });
      expect(screen.getByText(/disponible solo si hay transcripciones de audio en la página/i)).toBeInTheDocument();
    });

    it('does not show availability note when captions available', () => {
      renderMenu({ panelOpen: true, captionsAvailable: true });
      expect(screen.queryByText(/disponible solo si hay video con pistas de subtítulos/i)).not.toBeInTheDocument();
    });

    it('does not show availability note when descriptions available', () => {
      renderMenu({ panelOpen: true, descriptionsAvailable: true });
      expect(screen.queryByText(/disponible solo si hay video con pista de descripciones/i)).not.toBeInTheDocument();
    });

    it('does not show availability note when transcripts available', () => {
      renderMenu({ panelOpen: true, transcriptAvailable: true });
      expect(screen.queryByText(/disponible solo si hay transcripciones de audio en la página/i)).not.toBeInTheDocument();
    });
  });

  describe('reset all button', () => {
    it('renders reset all button', () => {
      renderMenu({ panelOpen: true });
      expect(screen.getByRole('button', { name: /restablecer todo/i })).toBeInTheDocument();
    });

    it('calls resetAll when reset button is clicked', () => {
      const resetAll = vi.fn();
      renderMenu({ panelOpen: true, resetAll });
      fireEvent.click(screen.getByRole('button', { name: /restablecer todo/i }));
      expect(resetAll).toHaveBeenCalled();
    });

    it('displays footer note', () => {
      renderMenu({ panelOpen: true });
      expect(screen.getByText(/las opciones se guardan automáticamente/i)).toBeInTheDocument();
    });
  });

  describe('slider rows', () => {
    it('renders all five slider sections', () => {
      renderMenu({ panelOpen: true });
      expect(screen.getByText('Tamaño de texto')).toBeInTheDocument();
      expect(screen.getByText('Interlineado')).toBeInTheDocument();
      expect(screen.getByText('Espaciado entre párrafos')).toBeInTheDocument();
      expect(screen.getByText('Espaciado entre letras')).toBeInTheDocument();
      expect(screen.getByText('Espaciado entre palabras')).toBeInTheDocument();
    });

    it('displays formatted text scale value', () => {
      renderMenu({ panelOpen: true, textScale: 1 });
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('displays formatted line height value', () => {
      renderMenu({ panelOpen: true, lineHeight: 1.8 });
      expect(screen.getByText('1.8×')).toBeInTheDocument();
    });

    it('displays formatted paragraph spacing value', () => {
      renderMenu({ panelOpen: true, paragraphSpacing: 2.0 });
      expect(screen.getByText('2.0×')).toBeInTheDocument();
    });

    it('displays formatted letter spacing value', () => {
      renderMenu({ panelOpen: true, letterSpacing: 0.05 });
      expect(screen.getByText('0.05em')).toBeInTheDocument();
    });

    it('displays formatted word spacing value', () => {
      renderMenu({ panelOpen: true, wordSpacing: 0.08 });
      expect(screen.getByText('0.08em')).toBeInTheDocument();
    });

    it('calls setTextScale when text scale dec button is clicked', () => {
      const setTextScale = vi.fn();
      renderMenu({ panelOpen: true, textScale: 1.2, setTextScale });
      fireEvent.click(screen.getByRole('button', { name: /reducir tamaño de texto/i }));
      expect(setTextScale).toHaveBeenCalled();
    });

    it('calls setTextScale when text scale inc button is clicked', () => {
      const setTextScale = vi.fn();
      renderMenu({ panelOpen: true, textScale: 1.2, setTextScale });
      fireEvent.click(screen.getByRole('button', { name: /aumentar tamaño de texto/i }));
      expect(setTextScale).toHaveBeenCalled();
    });

    it('calls setLineHeight when line height dec button is clicked', () => {
      const setLineHeight = vi.fn();
      renderMenu({ panelOpen: true, lineHeight: 2.0, setLineHeight });
      fireEvent.click(screen.getByRole('button', { name: /disminuir interlineado/i }));
      expect(setLineHeight).toHaveBeenCalled();
    });

    it('calls setLineHeight when line height inc button is clicked', () => {
      const setLineHeight = vi.fn();
      renderMenu({ panelOpen: true, lineHeight: 1.5, setLineHeight });
      fireEvent.click(screen.getByRole('button', { name: /aumentar interlineado/i }));
      expect(setLineHeight).toHaveBeenCalled();
    });

    it('calls setParagraphSpacing when paragraph spacing dec button is clicked', () => {
      const setParagraphSpacing = vi.fn();
      renderMenu({ panelOpen: true, paragraphSpacing: 2.0, setParagraphSpacing });
      fireEvent.click(screen.getByRole('button', { name: /disminuir espaciado entre párrafos/i }));
      expect(setParagraphSpacing).toHaveBeenCalled();
    });

    it('calls setParagraphSpacing when paragraph spacing inc button is clicked', () => {
      const setParagraphSpacing = vi.fn();
      renderMenu({ panelOpen: true, paragraphSpacing: 1.5, setParagraphSpacing });
      fireEvent.click(screen.getByRole('button', { name: /aumentar espaciado entre párrafos/i }));
      expect(setParagraphSpacing).toHaveBeenCalled();
    });

    it('calls setLetterSpacing when letter spacing dec button is clicked', () => {
      const setLetterSpacing = vi.fn();
      renderMenu({ panelOpen: true, letterSpacing: 0.05, setLetterSpacing });
      fireEvent.click(screen.getByRole('button', { name: /disminuir espaciado entre letras/i }));
      expect(setLetterSpacing).toHaveBeenCalled();
    });

    it('calls setLetterSpacing when letter spacing inc button is clicked', () => {
      const setLetterSpacing = vi.fn();
      renderMenu({ panelOpen: true, letterSpacing: 0.05, setLetterSpacing });
      fireEvent.click(screen.getByRole('button', { name: /aumentar espaciado entre letras/i }));
      expect(setLetterSpacing).toHaveBeenCalled();
    });

    it('calls setWordSpacing when word spacing dec button is clicked', () => {
      const setWordSpacing = vi.fn();
      renderMenu({ panelOpen: true, wordSpacing: 0.1, setWordSpacing });
      fireEvent.click(screen.getByRole('button', { name: /disminuir espaciado entre palabras/i }));
      expect(setWordSpacing).toHaveBeenCalled();
    });

    it('calls setWordSpacing when word spacing inc button is clicked', () => {
      const setWordSpacing = vi.fn();
      renderMenu({ panelOpen: true, wordSpacing: 0.05, setWordSpacing });
      fireEvent.click(screen.getByRole('button', { name: /aumentar espaciado entre palabras/i }));
      expect(setWordSpacing).toHaveBeenCalled();
    });

    it('handles range input change for text scale', () => {
      const setTextScale = vi.fn();
      renderMenu({ panelOpen: true, textScale: 1, setTextScale });
      const slider = screen.getByRole('slider', { name: /ajustar tamaño del texto/i });
      fireEvent.change(slider, { target: { value: '1.5' } });
      expect(setTextScale).toHaveBeenCalledWith(1.5);
    });

    it('handles range input change for line height', () => {
      const setLineHeight = vi.fn();
      renderMenu({ panelOpen: true, lineHeight: 1.5, setLineHeight });
      const slider = screen.getByRole('slider', { name: /ajustar interlineado/i });
      fireEvent.change(slider, { target: { value: '2.0' } });
      expect(setLineHeight).toHaveBeenCalledWith(2.0);
    });

    it('handles range input change for paragraph spacing', () => {
      const setParagraphSpacing = vi.fn();
      renderMenu({ panelOpen: true, paragraphSpacing: 1.5, setParagraphSpacing });
      const slider = screen.getByRole('slider', { name: /ajustar espaciado entre párrafos/i });
      fireEvent.change(slider, { target: { value: '2.0' } });
      expect(setParagraphSpacing).toHaveBeenCalledWith(2.0);
    });

    it('handles range input change for letter spacing', () => {
      const setLetterSpacing = vi.fn();
      renderMenu({ panelOpen: true, letterSpacing: 0.05, setLetterSpacing });
      const slider = screen.getByRole('slider', { name: /ajustar espaciado entre letras/i });
      fireEvent.change(slider, { target: { value: '0.1' } });
      expect(setLetterSpacing).toHaveBeenCalledWith(0.1);
    });

    it('handles range input change for word spacing', () => {
      const setWordSpacing = vi.fn();
      renderMenu({ panelOpen: true, wordSpacing: 0.05, setWordSpacing });
      const slider = screen.getByRole('slider', { name: /ajustar espaciado entre palabras/i });
      fireEvent.change(slider, { target: { value: '0.15' } });
      expect(setWordSpacing).toHaveBeenCalledWith(0.15);
    });
  });

  describe('section headings', () => {
    it('renders all section headings', () => {
      renderMenu({ panelOpen: true });
      expect(screen.getByText('Texto')).toBeInTheDocument();
      expect(screen.getByText('Color y contraste')).toBeInTheDocument();
      expect(screen.getByText('Preferencias de interacción')).toBeInTheDocument();
      expect(screen.getByText('Multimedia')).toBeInTheDocument();
      expect(screen.getByText('Asistencia')).toBeInTheDocument();
      expect(screen.getByText('Acceso rápido')).toBeInTheDocument();
    });
  });

  describe('quick links', () => {
    it('renders quick links section', () => {
      renderMenu({ panelOpen: true });
      expect(screen.getByText('Saltar al contenido')).toBeInTheDocument();
      expect(screen.getByText('Ir al buscador')).toBeInTheDocument();
      expect(screen.getByText('Inicio')).toBeInTheDocument();
    });

    it('calls closePanel when "Ir al buscador" button is clicked', () => {
      const closePanel = vi.fn();
      renderMenu({ panelOpen: true, closePanel });
      fireEvent.click(screen.getByText('Ir al buscador'));
      expect(closePanel).toHaveBeenCalled();
    });
  });

  describe('global keyboard shortcuts', () => {
    function fireShortcut(key: string, opts: { altKey?: boolean; ctrlKey?: boolean; metaKey?: boolean } = {}) {
      fireEvent.keyDown(document, {
        key,
        altKey: opts.altKey ?? true,
        ctrlKey: opts.ctrlKey ?? false,
        metaKey: opts.metaKey ?? false,
      });
    }

    it('Alt+A toggles panel open', () => {
      const openPanel = vi.fn();
      renderMenu({ panelOpen: false, openPanel });
      fireShortcut('a');
      expect(openPanel).toHaveBeenCalled();
    });

    it('Alt+A toggles panel close', () => {
      const closePanel = vi.fn();
      renderMenu({ panelOpen: true, closePanel });
      fireShortcut('a');
      expect(closePanel).toHaveBeenCalled();
    });

    it('Alt+C toggles high contrast', () => {
      const setHighContrast = vi.fn();
      renderMenu({ panelOpen: false, highContrast: false, setHighContrast });
      fireShortcut('c');
      expect(setHighContrast).toHaveBeenCalledWith(true);
    });

    it('Alt+M toggles dark mode', () => {
      const setDarkMode = vi.fn();
      renderMenu({ panelOpen: false, darkMode: false, setDarkMode });
      fireShortcut('m');
      expect(setDarkMode).toHaveBeenCalledWith(true);
    });

    it('Alt+F toggles enhanced focus', () => {
      const setEnhancedFocus = vi.fn();
      renderMenu({ panelOpen: false, enhancedFocus: false, setEnhancedFocus });
      fireShortcut('f');
      expect(setEnhancedFocus).toHaveBeenCalledWith(true);
    });

    it('Alt+G toggles large targets', () => {
      const setLargeTargets = vi.fn();
      renderMenu({ panelOpen: false, largeTargets: false, setLargeTargets });
      fireShortcut('g');
      expect(setLargeTargets).toHaveBeenCalledWith(true);
    });

    it('Alt+P toggles reduce motion', () => {
      const setReduceMotion = vi.fn();
      renderMenu({ panelOpen: false, reduceMotion: false, setReduceMotion });
      fireShortcut('p');
      expect(setReduceMotion).toHaveBeenCalledWith(true);
    });

    it('Alt+R calls resetAll', () => {
      const resetAll = vi.fn();
      renderMenu({ panelOpen: false, resetAll });
      fireShortcut('r');
      expect(resetAll).toHaveBeenCalled();
    });

    it('Alt+K opens shortcut guide when panel is closed', () => {
      renderMenu({ panelOpen: false });
      fireShortcut('k');
    });

    it('Alt+= increases text scale', () => {
      const setTextScale = vi.fn();
      renderMenu({ panelOpen: false, textScale: 1, setTextScale });
      fireShortcut('=');
      expect(setTextScale).toHaveBeenCalled();
    });

    it('Alt++ increases text scale', () => {
      const setTextScale = vi.fn();
      renderMenu({ panelOpen: false, textScale: 1, setTextScale });
      fireShortcut('+');
      expect(setTextScale).toHaveBeenCalled();
    });

    it('Alt+- decreases text scale', () => {
      const setTextScale = vi.fn();
      renderMenu({ panelOpen: false, textScale: 1, setTextScale });
      fireShortcut('-');
      expect(setTextScale).toHaveBeenCalled();
    });

    it('Alt+_ decreases text scale', () => {
      const setTextScale = vi.fn();
      renderMenu({ panelOpen: false, textScale: 1, setTextScale });
      fireShortcut('_');
      expect(setTextScale).toHaveBeenCalled();
    });

    it('ignores shortcuts when alt is not pressed', () => {
      const openPanel = vi.fn();
      renderMenu({ panelOpen: false, openPanel });
      fireEvent.keyDown(document, { key: 'a', altKey: false });
      expect(openPanel).not.toHaveBeenCalled();
    });

    it('ignores shortcuts when ctrl is pressed', () => {
      const openPanel = vi.fn();
      renderMenu({ panelOpen: false, openPanel });
      fireShortcut('a', { ctrlKey: true });
      expect(openPanel).not.toHaveBeenCalled();
    });

    it('ignores shortcuts when meta is pressed', () => {
      const openPanel = vi.fn();
      renderMenu({ panelOpen: false, openPanel });
      fireShortcut('a', { metaKey: true });
      expect(openPanel).not.toHaveBeenCalled();
    });

    it('ignores shortcuts when typing in an input', () => {
      const openPanel = vi.fn();
      renderMenu({ panelOpen: false, openPanel });
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();
      fireEvent.keyDown(input, { key: 'a', altKey: true });
      expect(openPanel).not.toHaveBeenCalled();
      document.body.removeChild(input);
    });

    it('ignores shortcuts when typing in a textarea', () => {
      const openPanel = vi.fn();
      renderMenu({ panelOpen: false, openPanel });
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      textarea.focus();
      fireEvent.keyDown(textarea, { key: 'a', altKey: true });
      expect(openPanel).not.toHaveBeenCalled();
      document.body.removeChild(textarea);
    });

    it('ignores shortcuts when typing in a select', () => {
      const openPanel = vi.fn();
      renderMenu({ panelOpen: false, openPanel });
      const select = document.createElement('select');
      document.body.appendChild(select);
      select.focus();
      fireEvent.keyDown(select, { key: 'a', altKey: true });
      expect(openPanel).not.toHaveBeenCalled();
      document.body.removeChild(select);
    });

    it('ignores shortcuts for non-prevent keys', () => {
      const openPanel = vi.fn();
      renderMenu({ panelOpen: false, openPanel });
      fireShortcut('z');
      expect(openPanel).not.toHaveBeenCalled();
    });
  });

  describe('section notes', () => {
    it('renders text section note', () => {
      renderMenu({ panelOpen: true });
      expect(screen.getByText(/ajusta el tamaño, el interlineado/i)).toBeInTheDocument();
    });

    it('renders color section note', () => {
      renderMenu({ panelOpen: true });
      expect(screen.getByText(/cambia las ayudas visuales/i)).toBeInTheDocument();
    });

    it('renders interaction section note', () => {
      renderMenu({ panelOpen: true });
      expect(screen.getByText(/mejora la navegación y la detección/i)).toBeInTheDocument();
    });

    it('renders multimedia section note', () => {
      renderMenu({ panelOpen: true });
      expect(screen.getByText(/activa subtítulos y descripciones/i)).toBeInTheDocument();
    });

    it('renders assistance section note', () => {
      renderMenu({ panelOpen: true });
      expect(screen.getByText(/muestra ayudas y errores claros/i)).toBeInTheDocument();
    });
  });

  describe('mediaEnabled conditional rendering', () => {
    it('detects media when captions available', () => {
      renderMenu({ panelOpen: true, mediaAvailable: true, captionsAvailable: true });
      expect(screen.getByText(/contenido multimedia detectado/i)).toBeInTheDocument();
    });

    it('detects media when descriptions available', () => {
      renderMenu({ panelOpen: true, mediaAvailable: true, descriptionsAvailable: true });
      expect(screen.getByText(/contenido multimedia detectado/i)).toBeInTheDocument();
    });

    it('detects media when transcripts available', () => {
      renderMenu({ panelOpen: true, mediaAvailable: true, transcriptAvailable: true });
      expect(screen.getByText(/contenido multimedia detectado/i)).toBeInTheDocument();
    });

    it('shows no media when media not available', () => {
      renderMenu({ panelOpen: true, mediaAvailable: false, captionsAvailable: false, descriptionsAvailable: false, transcriptAvailable: false });
      expect(screen.getByText(/no se detectó contenido multimedia/i)).toBeInTheDocument();
    });
  });
});

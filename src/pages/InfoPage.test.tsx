import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InfoPage } from './InfoPage';

const sections = [
  { title: 'Section One', paragraphs: ['Paragraph 1a', 'Paragraph 1b'] },
  { title: 'Section Two', paragraphs: ['Paragraph 2a'] },
];

describe('InfoPage', () => {
  it('renders title and subtitle', () => {
    render(
      <MemoryRouter>
        <InfoPage title="My Info" subtitle="A subtitle" sections={sections} />
      </MemoryRouter>,
    );
    expect(screen.getByText('My Info')).toBeInTheDocument();
    expect(screen.getByText('A subtitle')).toBeInTheDocument();
  });

  it('renders sections and paragraphs', () => {
    render(
      <MemoryRouter>
        <InfoPage title="T" sections={sections} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Section One')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 1a')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 1b')).toBeInTheDocument();
    expect(screen.getByText('Section Two')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2a')).toBeInTheDocument();
  });

  it('renders footer links', () => {
    render(
      <MemoryRouter>
        <InfoPage title="T" sections={[]} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Contactar soporte')).toBeInTheDocument();
    expect(screen.getByText('Volver al inicio')).toBeInTheDocument();
  });
});

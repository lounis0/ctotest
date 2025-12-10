import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AppShell } from './components/AppShell';
import { HomePage } from './pages/HomePage';

describe('AppShell', () => {
  it('renders navigation and content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Monorepo Starter/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
  });
});

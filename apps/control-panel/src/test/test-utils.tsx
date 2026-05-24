import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';

function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: Providers, ...options });
}

export * from '@testing-library/react';

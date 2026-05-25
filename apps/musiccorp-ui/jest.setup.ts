import '@testing-library/jest-dom';

const push = jest.fn();
const replace = jest.fn();
const refresh = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push,
    replace,
    refresh,
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

beforeEach(() => {
  push.mockReset();
  replace.mockReset();
  refresh.mockReset();
});

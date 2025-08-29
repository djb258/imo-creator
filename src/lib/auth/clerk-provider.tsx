'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export function ClerkThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
        elements: {
          formButtonPrimary: 
            'bg-slate-900 hover:bg-slate-800 text-white border-0',
          formButtonSecondary: 
            'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
          footerActionLink: 
            'text-slate-600 hover:text-slate-900',
          card: 
            'shadow-lg border border-gray-200',
        },
        variables: {
          colorPrimary: '#0f172a',
          colorText: theme === 'dark' ? '#f1f5f9' : '#0f172a',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
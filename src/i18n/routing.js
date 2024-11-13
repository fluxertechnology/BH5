import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

// Define the routing configuration
export const routing = defineRouting({
  locales: ['en', 'tc'], // Supported locales
  defaultLocale: 'en', // Default locale to use
  localeDetection: true, // Enable automatic locale detection
});

// Create navigation helpers
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
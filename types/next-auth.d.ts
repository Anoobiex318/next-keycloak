// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in session types to include the user property
   */
  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    keycloakUsername?: string; // Add custom properties as needed
  }

  /**
   * Extends the built-in session types to include the user property
   */
  interface Session {
    user?: User;
    keycloakUsername?: string;
  }
}

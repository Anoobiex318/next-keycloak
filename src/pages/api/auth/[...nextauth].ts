import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

const keycloakClientId = process.env.KEYCLOAK_ID;
const keycloakClientSecret = process.env.KEYCLOAK_SECRET;
const keycloakIssuer = process.env.KEYCLOAK_ISSUER;

if (!keycloakClientId || !keycloakClientSecret || !keycloakIssuer) {
  throw new Error('The Keycloak ID, secret, and issuer environment variables must be set.');
}

export default NextAuth({
  providers: [
    KeycloakProvider({
      clientId: keycloakClientId,
      clientSecret: keycloakClientSecret,
      issuer: keycloakIssuer,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // If account is not null and we have an access token, we can fetch additional user details
      if (account && account.access_token) {
        // Fetch user details from Keycloak using the access token
        const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`, {
          headers: {
            Authorization: `Bearer ${account.access_token}`,
          },
        });

        const profile = await response.json();

        // Add the username to the token
        if (profile.preferred_username) {
          token.keycloakUsername = profile.preferred_username;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Assign the Keycloak username to the session
      if (token.keycloakUsername) {
        (session.user as any).keycloakUsername = token.keycloakUsername;
      }

      return session;
    },
  },
  // ...other NextAuth options
  
});

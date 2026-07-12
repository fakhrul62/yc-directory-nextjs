export function getOAuthCredentials(
  primaryId: string | undefined,
  primarySecret: string | undefined,
  fallbackId: string | undefined,
  fallbackSecret: string | undefined,
) {
  const clientId = primaryId ?? fallbackId;
  const clientSecret = primarySecret ?? fallbackSecret;

  return clientId && clientSecret ? { clientId, clientSecret } : null;
}

function getSiteUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();

  if (baseUrl) {
    let parsed: URL;

    try {
      parsed = new URL(baseUrl);
    } catch {
      throw new Error(
        `Invalid NEXT_PUBLIC_BASE_URL: "${baseUrl}" is not a valid absolute URL`
      );
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error(
        `Invalid NEXT_PUBLIC_BASE_URL: unsupported protocol "${parsed.protocol}". Use http: or https:`
      );
    }

    return baseUrl.replace(/\/+$/, '');
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing environment variable: NEXT_PUBLIC_BASE_URL');
  }

  return 'http://localhost:3000';
}

export const SITE_URL = getSiteUrl();

export function normalizePathname(pathname?: string | null): string {
  if (!pathname) return '/';

  const [pathWithoutHash] = pathname.split('#');
  const [pathWithoutQuery] = pathWithoutHash.split('?');
  const withLeadingSlash = pathWithoutQuery.startsWith('/')
    ? pathWithoutQuery
    : `/${pathWithoutQuery}`;
  const normalizedPath = withLeadingSlash.replace(/\/{2,}/g, '/');

  if (normalizedPath === '/') return normalizedPath;

  return normalizedPath.replace(/\/+$/, '') || '/';
}

export function resolveCanonicalUrl(pathname?: string | null): string {
  return `${SITE_URL}${normalizePathname(pathname)}`;
}

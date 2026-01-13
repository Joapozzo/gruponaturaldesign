/**
 * Parsea search params de tablas de forma reutilizable
 */
export function parseTableSearchParams(searchParams: {
  page?: string;
  limit?: string;
  search?: string;
}, defaults?: { page?: number; limit?: number }) {
  const defaultPage = defaults?.page ?? 1;
  const defaultLimit = defaults?.limit ?? 20;

  return {
    page: parseInt(searchParams.page || String(defaultPage), 10),
    limit: parseInt(searchParams.limit || String(defaultLimit), 10),
    search: searchParams.search || '',
  };
}


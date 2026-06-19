import { useQuery } from '@tanstack/react-query';
import { searchAdmin } from '@/app/services/adminSearch.service';
import { useDebounce } from './useDebounce';

const MIN_QUERY_LENGTH = 2;

export function useAdminSearch(query: string, enabled = true) {
  const debouncedQuery = useDebounce(query.trim(), 300);
  const canSearch = debouncedQuery.length >= MIN_QUERY_LENGTH;

  return useQuery({
    queryKey: ['admin-search', debouncedQuery],
    queryFn: () => searchAdmin(debouncedQuery),
    enabled: enabled && canSearch,
    staleTime: 30_000,
  });
}

export interface AdminSearchResult {
  id: string;
  label: string;
  meta?: string;
  href: string;
}

export interface AdminSearchResponse {
  results: AdminSearchResult[];
}

import { useState, useCallback } from 'react';
import { Filters, Location } from '../types/filters';

interface SearchState {
  location: Location | null;
  filters: Filters;
  isLoading: boolean;
  error: string | null;
}

const initialFilters: Filters = {
  service: 0,
  price_range: 0,
  rating: 0,
  has_parking: false,
  is_open_24h: false,
};

export const useSearchState = () => {
  const [state, setState] = useState<SearchState>({
    location: null,
    filters: initialFilters,
    isLoading: false,
    error: null,
  });

  const setLocation = useCallback((location: Location) => {
    setState((prev) => ({ ...prev, location }));
  }, []);

  const setFilters = useCallback((filters: Filters) => {
    setState((prev) => ({ ...prev, filters }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      location: null,
      filters: initialFilters,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    setLocation,
    setFilters,
    setLoading,
    setError,
    resetState,
  };
}; 
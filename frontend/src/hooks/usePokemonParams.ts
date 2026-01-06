import { useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';

export const usePokemonParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || '';
  const captured = searchParams.get('captured') || '';
  const sortBy = searchParams.get('sortBy') || 'number';
  const order = (searchParams.get('order') || 'asc') as 'asc' | 'desc';
  const limit = parseInt(searchParams.get('limit') || '20');

  const updateParams = (
    updates: Record<string, string | number | undefined>
  ) => {
    const performUpdate = () => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      if (updates.page === undefined) {
        newParams.set('page', '1');
      }
      setSearchParams(newParams);
    };

    // use transition for filters/search/sort, not for pagination
    if (updates.page !== undefined) {
      performUpdate();
    } else {
      startTransition(performUpdate);
    }
  };

  return {
    params: {
      page,
      search,
      type,
      captured,
      sortBy,
      order,
      limit,
    },
    updateParams,
    isPending,
    searchParams,
  };
};

import { useMemo, useState } from 'react';
import debounce from 'lodash/debounce';

import { message } from '@/utils/message';

import { fetchLocations } from '@/services/geocodeService';
import { LocationOption } from '@/model/types';

export const useLocationSearch = () => {
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  const search = async (query: string) => {
    setLoading(true);

    try {
      const result = await fetchLocations(query);
      setOptions(result);
    } catch (error) {
      setOptions([]);
      const errorMessage =
        error instanceof Error ? error.message : 'Error searching location';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useMemo(() => debounce(search, 300), []);

  const handleSearch = (v: string) => {
    setValue(v);
    debouncedSearch(v);
  };

  return {
    options,
    loading,
    value,
    handleSearch,
  };
};

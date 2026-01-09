import { AutoComplete, Spin } from 'antd';

import { Coordinates } from '@/model/types';
import { useLocationSearch } from '@/hooks/useLocationSearch';

interface Props {
  onSetCoordinates: (coordinates: Coordinates) => void;
}

export const SearchLocation: React.FC<Props> = ({ onSetCoordinates }) => {
  const { options, loading, value, handleSearch } = useLocationSearch();

  return (
    <AutoComplete
      className="w-full"
      options={options}
      onSearch={handleSearch}
      onSelect={(_, option) => onSetCoordinates(option.coordinates)}
      placeholder="Enter city or address..."
      value={value}
      notFoundContent={loading ? <Spin size="small" /> : null}
      allowClear
    />
  );
};

import React from 'react';
import { Input, Button, Space, message } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Search } = Input;

interface SearchTasksProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  loading: boolean;
}

const SearchTasks: React.FC<SearchTasksProps> = ({ onSearch, onClear, loading }) => {
  const handleSearch = (value: string) => {
    if (value.trim()) {
      onSearch(value.trim());
    } else {
      message.warning('Please enter a search term');
    }
  };

  return (
    <Space style={{ marginBottom: 16, width: '100%' }}>
      <Search
        placeholder="Search tasks by name..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={handleSearch}
        style={{ width: 400 }}
        disabled={loading}
      />
      <Button
        icon={<ReloadOutlined />}
        onClick={onClear}
        size="large"
        disabled={loading}
      >
        Show All
      </Button>
    </Space>
  );
};

export default SearchTasks;

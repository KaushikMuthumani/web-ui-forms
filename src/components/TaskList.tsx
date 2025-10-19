import React from 'react';
import { Table, Button, Space, Tag, message, Popconfirm } from 'antd';
import { DeleteOutlined, PlayCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Task } from '../types/task';
import { taskService } from '../services/api';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onRefresh: () => void;
  onViewDetails: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loading, onRefresh, onViewDetails }) => {
  const handleDelete = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      message.success('Task deleted successfully');
      onRefresh();
    } catch (error) {
      message.error('Failed to delete task');
    }
  };

  const handleExecute = async (id: string) => {
    try {
      await taskService.executeTask(id);
      message.success('Task executed successfully');
      onRefresh();
    } catch (error) {
      message.error('Failed to execute task');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: 120,
    },
    {
      title: 'Command',
      dataIndex: 'command',
      key: 'command',
      ellipsis: true,
    },
    {
      title: 'Executions',
      dataIndex: 'taskExecutions',
      key: 'executions',
      width: 100,
      render: (executions: any[]) => (
        <Tag color={executions.length > 0 ? 'green' : 'default'}>
          {executions.length}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_: any, record: Task) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => onViewDetails(record)}
          >
            Details
          </Button>
          <Button
            icon={<PlayCircleOutlined />}
            type="primary"
            size="small"
            onClick={() => handleExecute(record.id)}
          >
            Run
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this task?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tasks}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
      scroll={{ x: 800 }}
    />
  );
};

export default TaskList;

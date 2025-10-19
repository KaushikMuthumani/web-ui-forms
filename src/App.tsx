import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Button, 
  Space, 
  message, 
  Typography, 
  Card,
  Spin,
  Alert 
} from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import './App.css';

import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import SearchTasks from './components/SearchTasks';
import { taskService } from './services/api';
import { Task, CreateTaskRequest } from './types/task';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchMode, setSearchMode] = useState(false);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  useEffect(() => {
    checkBackendConnection();
    loadTasks();
  }, []);

  const checkBackendConnection = async () => {
    try {
      // First try the health endpoint
      await fetch('http://localhost:8081/health');
      setBackendConnected(true);
    } catch (error) {
      console.warn('Health endpoint not available, trying tasks endpoint...');
      try {
        // If health endpoint fails, try the tasks endpoint
        await taskService.getTasks();
        setBackendConnected(true);
      } catch (tasksError) {
        console.error('Backend connection failed:', tasksError);
        setBackendConnected(false);
        message.error('Cannot connect to backend. Make sure the Java API is running on port 8081.');
      }
    }
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading tasks...');
      const data = await taskService.getTasks();
      setTasks(data || []);
      setSearchMode(false);
      console.log('✅ Tasks loaded successfully:', data);
    } catch (error: any) {
      console.error('❌ Failed to load tasks:', error);
      setBackendConnected(false);
      
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        message.error('Backend connection failed. Please ensure the Java API is running on http://localhost:8081');
      } else if (error.response?.status === 404) {
        // 404 is okay - just means no tasks yet
        setTasks([]);
      } else {
        message.error('Failed to load tasks: ' + (error.message || 'Unknown error'));
      }
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      console.log('🔍 Searching tasks:', query);
      const data = await taskService.searchTasks(query);
      setTasks(data || []);
      setSearchMode(true);
      message.success(`Found ${data.length} task(s) matching "${query}"`);
    } catch (error: any) {
      console.error('❌ Search failed:', error);
      if (error.response?.status === 404) {
        setTasks([]);
        message.info(`No tasks found matching "${query}"`);
      } else {
        message.error('Failed to search tasks: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    try {
      console.log('📝 Creating task:', taskData);
      
      // Validate required fields
      if (!taskData.id || !taskData.name || !taskData.owner || !taskData.command) {
        message.error('All fields are required');
        return;
      }

      const createdTask = await taskService.createOrUpdateTask(taskData);
      console.log('✅ Task created successfully:', createdTask);
      
      message.success('Task created successfully!');
      setFormVisible(false);
      
      // Reload tasks to show the new task
      await loadTasks();
      
    } catch (error: any) {
      console.error('❌ Task creation failed:', error);
      
      // Specific error handling
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorData = error.response.data;
        
        switch (status) {
          case 400:
            message.error(`Validation error: ${errorData || 'Invalid task data'}`);
            break;
          case 500:
            message.error('Server error: Please check backend logs');
            break;
          default:
            message.error(`Error ${status}: ${errorData || 'Failed to create task'}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        message.error('Cannot connect to backend server. Please ensure the Java API is running on http://localhost:8081');
        setBackendConnected(false);
      } else {
        // Something else happened
        message.error('Failed to create task: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailsVisible(true);
  };

  const handleClearSearch = () => {
    loadTasks();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            🚀 Task Manager
          </Title>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadTasks}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setFormVisible(true)}
              disabled={backendConnected === false}
            >
              New Task
            </Button>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        {backendConnected === false && (
          <Alert
            message="Backend Connection Issue"
            description="Cannot connect to the Java backend API. Please ensure the Task 1 Java application is running on http://localhost:8081"
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            action={
              <Button size="small" onClick={checkBackendConnection}>
                Retry Connection
              </Button>
            }
          />
        )}

        <Card>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <SearchTasks 
              onSearch={handleSearch}
              onClear={handleClearSearch}
              loading={loading}
            />
            
            {searchMode && (
              <div style={{ textAlign: 'center' }}>
                <Button type="link" onClick={handleClearSearch}>
                  ← Back to all tasks
                </Button>
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" tip="Loading tasks..." />
              </div>
            ) : tasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                {searchMode ? (
                  <div>
                    <Title level={4} type="secondary">No tasks found</Title>
                    <p>Try a different search term or create a new task.</p>
                  </div>
                ) : (
                  <div>
                    <Title level={4} type="secondary">No tasks yet</Title>
                    <p>Create your first task to get started!</p>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => setFormVisible(true)}
                      style={{ marginTop: 16 }}
                    >
                      Create First Task
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                loading={loading}
                onRefresh={loadTasks}
                onViewDetails={handleViewDetails}
              />
            )}
          </Space>
        </Card>

        <TaskForm
          visible={formVisible}
          onCancel={() => setFormVisible(false)}
          onSave={handleCreateTask}
        />

        <TaskDetails
          task={selectedTask}
          visible={detailsVisible}
          onClose={() => setDetailsVisible(false)}
        />
      </Content>
    </Layout>
  );
};

export default App;

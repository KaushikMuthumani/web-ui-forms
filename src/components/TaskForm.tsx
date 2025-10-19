import React from 'react';
import { Modal, Form, Input, Button, message, Space } from 'antd';
import { Task, CreateTaskRequest } from '../types/task';

interface TaskFormProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (task: CreateTaskRequest) => void;
  task?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, onCancel, onSave, task }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      const taskData: CreateTaskRequest = {
        id: values.id,
        name: values.name,
        owner: values.owner,
        command: values.command,
      };
      onSave(taskData);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save task');
    }
  };

  const validateCommand = (_: any, value: string) => {
    const dangerousCommands = ['rm -rf', 'format', 'del', 'shutdown', 'reboot'];
    if (dangerousCommands.some(cmd => value.toLowerCase().includes(cmd))) {
      return Promise.reject(new Error('Unsafe command detected!'));
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title={task ? 'Edit Task' : 'Create New Task'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={task}
      >
        <Form.Item
          label="Task ID"
          name="id"
          rules={[
            { required: true, message: 'Please enter task ID' },
            { pattern: /^[a-zA-Z0-9-_]+$/, message: 'ID can only contain letters, numbers, hyphens, and underscores' }
          ]}
        >
          <Input placeholder="Enter unique task ID" disabled={!!task} />
        </Form.Item>

        <Form.Item
          label="Task Name"
          name="name"
          rules={[{ required: true, message: 'Please enter task name' }]}
        >
          <Input placeholder="Enter task name" />
        </Form.Item>

        <Form.Item
          label="Owner"
          name="owner"
          rules={[{ required: true, message: 'Please enter owner name' }]}
        >
          <Input placeholder="Enter owner name" />
        </Form.Item>

        <Form.Item
          label="Command"
          name="command"
          rules={[
            { required: true, message: 'Please enter shell command' },
            { validator: validateCommand }
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter shell command (e.g., echo Hello World, ls -la, etc.)"
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {task ? 'Update Task' : 'Create Task'}
            </Button>
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;

import React from 'react';
import { Modal, Descriptions, Tag, Timeline, Card } from 'antd';
import { Task, TaskExecution } from '../types/task';

interface TaskDetailsProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, visible, onClose }) => {
  if (!task) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Modal
      title={`Task Details: ${task.name}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="ID">{task.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{task.name}</Descriptions.Item>
        <Descriptions.Item label="Owner">{task.owner}</Descriptions.Item>
        <Descriptions.Item label="Command">
          <code>{task.command}</code>
        </Descriptions.Item>
        <Descriptions.Item label="Total Executions">
          <Tag color="blue">{task.taskExecutions.length}</Tag>
        </Descriptions.Item>
      </Descriptions>

      {task.taskExecutions.length > 0 && (
        <Card title="Execution History" style={{ marginTop: 16 }}>
          <Timeline>
            {task.taskExecutions.map((execution: TaskExecution, index: number) => (
              <Timeline.Item key={execution.executionId || index}>
                <div>
                  <strong>Start:</strong> {formatDate(execution.startTime)}<br />
                  <strong>End:</strong> {formatDate(execution.endTime)}<br />
                  <strong>Output:</strong>
                  <pre style={{ 
                    background: '#f5f5f5', 
                    padding: '8px', 
                    borderRadius: '4px',
                    marginTop: '8px',
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}>
                    {execution.output}
                  </pre>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      )}
    </Modal>
  );
};

export default TaskDetails;

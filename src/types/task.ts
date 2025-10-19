export interface TaskExecution {
  executionId?: string;
  startTime: string;
  endTime: string;
  output: string;
}

export interface Task {
  id: string;
  name: string;
  owner: string;
  command: string;
  taskExecutions: TaskExecution[];
}

export interface CreateTaskRequest {
  id: string;
  name: string;
  owner: string;
  command: string;
}

// Response types for API
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

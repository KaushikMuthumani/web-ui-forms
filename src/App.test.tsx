import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Basic test that should always pass
test('renders without crashing', () => {
  render(<App />);
});

test('contains task management text', () => {
  render(<App />);
  const taskElement = screen.getByText(/Task Manager|task management|tasks/i);
  expect(taskElement).toBeInTheDocument();
});

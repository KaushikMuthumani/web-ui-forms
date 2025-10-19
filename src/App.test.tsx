import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders task manager header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Task Manager/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders new task button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/New Task/i);
  expect(buttonElement).toBeInTheDocument();
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders product catalog header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Financial Product Catalog Filter/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders search input', () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Search financial products/i);
  expect(searchInput).toBeInTheDocument();
});

test('renders add products button', () => {
  render(<App />);
  const addButton = screen.getByRole('button', { name: /Adding...|Add Products/i });
  expect(addButton).toBeInTheDocument();
});

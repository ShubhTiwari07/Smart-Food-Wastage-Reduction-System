import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Smart Food Wastage Reduction title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Smart Food Wastage Reduction/i);
  expect(titleElement).toBeInTheDocument();
});

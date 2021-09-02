import { render, screen } from '@testing-library/react';
import FollowersColumn from './components/FollowersColumn';

test('renders Following in the sidebar', () => {
  render(<FollowersColumn />);
  const titleElement = screen.getByText(/Following/i);
  expect(titleElement).toBeInTheDocument();
});

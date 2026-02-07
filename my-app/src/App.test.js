import { render } from '@testing-library/react';
import App from './App';

// smoke test - verifies the app renders without crashing
test('renders without crashing', () => {
  render(<App />);
});

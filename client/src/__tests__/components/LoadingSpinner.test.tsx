import { render, screen } from '@testing-library/react';

import { LoadingSpinner } from 'components';

describe('Loading spinner', () => {
  it('renders spinner', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('loadingText.default')).toBeInTheDocument();
  });

  it('renders custom loading phrase', () => {
    const loadingText = 'Loading meetup list';
    render(<LoadingSpinner text={loadingText} />);
    expect(screen.getByText(loadingText)).toBeInTheDocument();
  });
});

import { screen, render } from '@testing-library/react';

import { HelperText, InputFieldVariant } from 'components';

describe('HelperText', () => {
  it('renders text content', () => {
    render(<HelperText>Hint text</HelperText>);

    const hintText = screen.getByText('Hint text');
    expect(hintText).toBeInTheDocument();
  });

  it('can be assigned an external class or attribute', () => {
    render(
      <HelperText
        variant={InputFieldVariant.Error}
        className="test-class"
        style={{ visibility: 'hidden' }}
      >
        Error message
      </HelperText>,
    );

    const errorMessage = screen.queryByText('Error message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).not.toBeVisible();
  });
});

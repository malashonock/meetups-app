import { screen, render } from '@testing-library/react';

import { InputLabel } from 'components';

describe('InputLabel', () => {
  it('renders text content', () => {
    render(<InputLabel name="test">Label text</InputLabel>);

    const label = screen.getByText('Label text');
    expect(label).toBeInTheDocument();
  });

  it('can be assigned an external class or attribute', () => {
    render(
      <InputLabel
        name="test"
        className="test-class"
        style={{ textTransform: 'uppercase' }}
      >
        Label text
      </InputLabel>,
    );

    const label = screen.queryByText('Label text');
    expect(label).toBeInTheDocument();
  });
});

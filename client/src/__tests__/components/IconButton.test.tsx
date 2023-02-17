import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ReactComponent as TestImage } from 'assets/images/logo.svg';

import { IconButton } from 'components';

describe('IconButton', () => {
  it('renders image', () => {
    render(
      <IconButton>
        <TestImage data-testid="test-image" />
      </IconButton>,
    );

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button).toBeInTheDocument();

    const image = screen.getByTestId('test-image');
    expect(image).toBeInTheDocument();
  });

  it('handles clicks', () => {
    const handleClick = jest.fn();

    render(
      <IconButton onClick={handleClick}>
        <TestImage />
      </IconButton>,
    );

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button).toBeInTheDocument();

    userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be assigned an external class or attribute', () => {
    render(
      <IconButton className="test-class" type="submit">
        <TestImage />
      </IconButton>,
    );

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button).toBeInTheDocument();

    expect(button.classList).toContain('test-class');
    expect(button.type).toBe('submit');
  });
});

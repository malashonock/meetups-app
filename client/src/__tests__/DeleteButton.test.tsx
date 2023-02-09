import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DeleteButton } from 'components';

describe('DeleteButton', () => {
  it('handles clicks', () => {
    const handleClick = jest.fn();

    render(<DeleteButton onClick={handleClick} />);

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button).toBeInTheDocument();

    userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be assigned an external class or attribute', () => {
    render(<DeleteButton className="test-class" type="submit" />);

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button).toBeInTheDocument();

    expect(button.classList).toContain('test-class');
    expect(button.type).toBe('submit');
  });
});

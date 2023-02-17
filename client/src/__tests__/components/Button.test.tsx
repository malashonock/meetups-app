import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from 'components';

describe('Button', () => {
  it('handles clicks', () => {
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Test button</Button>);

    const button = screen.getByText('Test button');
    expect(button).toBeInTheDocument();

    userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be assigned an external class or attribute', () => {
    render(
      <Button className="test-class" type="submit">
        Test button
      </Button>,
    );

    const button = screen.getByText('Test button') as HTMLButtonElement;
    expect(button).toBeInTheDocument();

    expect(button.classList).toContain('test-class');
    expect(button.type).toBe('submit');
  });
});

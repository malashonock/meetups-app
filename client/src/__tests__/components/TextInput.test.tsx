import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TextInput } from 'components';

const TEXT = 'Hello, world!';

describe('TextInput', () => {
  it('handles clicks', () => {
    render(<TextInput name="message" />);

    const input = screen.getByTestId('text-input-message') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    userEvent.type(input, TEXT);
    expect(input.value).toBe(TEXT);
  });

  it('can be assigned an external class or event handler', () => {
    const mockHandleChange = jest.fn();

    render(
      <TextInput
        name="message"
        className="test-class"
        onChange={mockHandleChange}
      />,
    );

    const input = screen.getByTestId('text-input-message') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    expect(input.classList).toContain('test-class');

    userEvent.type(input, TEXT);
    expect(mockHandleChange).toHaveBeenCalledTimes(TEXT.length);
  });
});

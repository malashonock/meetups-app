import { FormEvent, useState } from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TextArea, TextAreaProps } from 'components';

const TEXT = 'Hello, world!';

const ControlledTextArea = (props: TextAreaProps): JSX.Element => {
  const [value, setValue] = useState<string>('');

  const handleChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const textArea = event.target as HTMLTextAreaElement;
    setValue(textArea.value);
  };

  return <TextArea value={value} onChange={handleChange} {...props} />;
};

describe('TextArea', () => {
  it('handles clicks', () => {
    render(<TextArea name="description" />);

    const textArea = screen.getByTestId(
      'text-area-description',
    ) as HTMLInputElement;
    expect(textArea).toBeInTheDocument();

    userEvent.type(textArea, TEXT);
    expect(textArea.value).toBe(TEXT);
  });

  it('can be assigned an external class or event handler', () => {
    const mockHandleChange = jest.fn();

    render(
      <TextArea
        name="description"
        className="test-class"
        onChange={mockHandleChange}
      />,
    );

    const textArea = screen.getByTestId(
      'text-area-description',
    ) as HTMLInputElement;
    expect(textArea).toBeInTheDocument();

    expect(textArea.classList).toContain('test-class');

    userEvent.type(textArea, TEXT);
    expect(mockHandleChange).toHaveBeenCalledTimes(TEXT.length);
  });

  it('limits max char count if maxCharCount prop is set', () => {
    render(<ControlledTextArea name="description" maxCharCount={5} />);

    const textArea = screen.getByTestId(
      'text-area-description',
    ) as HTMLInputElement;
    userEvent.type(textArea, TEXT);

    expect(textArea.value).toBe(TEXT.slice(0, 5));
  });

  it('renders char counter if showCharCounter & maxCharCount props are set', () => {
    render(
      <ControlledTextArea
        name="description"
        maxCharCount={50}
        showCharCounter
      />,
    );

    const textArea = screen.getByTestId(
      'text-area-description',
    ) as HTMLInputElement;
    const charCounter = screen.getByTestId('char-counter');
    expect(charCounter.textContent).toBe('0 / 50');

    userEvent.type(textArea, TEXT.slice(0, 5));
    expect(charCounter.textContent).toBe('5 / 50');

    userEvent.type(textArea, TEXT.slice(5));
    expect(charCounter.textContent).toBe(`${TEXT.length} / 50`);
  });
});

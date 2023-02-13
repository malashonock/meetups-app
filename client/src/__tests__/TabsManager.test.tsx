/* eslint-disable testing-library/no-node-access */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TabsManager } from 'components';

const testTabs = [
  {
    title: 'Tab 1',
    element: <h1>Tab 1 content</h1>,
  },
  {
    title: 'Tab 2',
    element: <h1>Tab 2 content</h1>,
  },
];

describe('TabsManager', () => {
  it('renders all provided tabs', () => {
    render(<TabsManager tabs={testTabs} />);

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('renders only the selected tab content', () => {
    render(<TabsManager tabs={testTabs} />);

    expect(screen.queryByText('Tab 1 content')?.parentElement).toHaveClass(
      'visible',
    );
    expect(screen.queryByText('Tab 2 content')?.parentElement).toHaveClass(
      'hidden',
    );

    userEvent.click(screen.getByText('Tab 2') as HTMLElement);

    expect(screen.queryByText('Tab 1 content')?.parentElement).toHaveClass(
      'hidden',
    );
    expect(screen.queryByText('Tab 2 content')?.parentElement).toHaveClass(
      'visible',
    );

    userEvent.click(screen.queryByText('Tab 1') as HTMLElement);

    expect(screen.queryByText('Tab 1 content')?.parentElement).toHaveClass(
      'visible',
    );
    expect(screen.queryByText('Tab 2 content')?.parentElement).toHaveClass(
      'hidden',
    );
  });
});

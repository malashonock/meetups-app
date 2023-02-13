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

    const tab1 = screen.queryByText('Tab 1') as HTMLElement;
    expect(tab1).toBeInTheDocument();

    const tab2 = screen.getByText('Tab 2') as HTMLElement;
    expect(tab2).toBeInTheDocument();

    userEvent.click(tab2);

    expect(tab1).toBeInTheDocument();
    expect(tab2).toBeInTheDocument();

    userEvent.click(tab1);

    expect(tab1).toBeInTheDocument();
    expect(tab2).toBeInTheDocument();
  });

  it('renders only the selected tab content', () => {
    render(<TabsManager tabs={testTabs} />);

    const tab1 = screen.queryByText('Tab 1') as HTMLElement;
    const tab2 = screen.getByText('Tab 2') as HTMLElement;

    const tabContent1 = screen.queryByText('Tab 1 content');
    expect(tabContent1?.parentElement).toHaveClass('visible');

    const tabContent2 = screen.queryByText('Tab 2 content');
    expect(tabContent2?.parentElement).toHaveClass('hidden');

    userEvent.click(tab2);

    expect(tabContent1?.parentElement).toHaveClass('hidden');
    expect(tabContent2?.parentElement).toHaveClass('visible');

    userEvent.click(tab1);

    expect(tabContent1?.parentElement).toHaveClass('visible');
    expect(tabContent2?.parentElement).toHaveClass('hidden');
  });
});

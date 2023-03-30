import { PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tab, Tabs, TabsContext } from 'components';

const spiedOnSetActiveTabValue = jest.fn();

const TestContext = ({ children }: PropsWithChildren): JSX.Element => (
  <TabsContext.Provider
    value={{
      activeTabValue: '1',
      setActiveTabValue: spiedOnSetActiveTabValue,
    }}
  >
    {children}
  </TabsContext.Provider>
);

afterEach(() => {
  jest.resetAllMocks();
});

describe('Tabs', () => {
  it('calls setActiveTabValue on tab change', () => {
    render(
      <Tabs>
        <Tab value="1">Tab 1</Tab>
        <Tab value="2">Tab 2</Tab>
      </Tabs>,
      {
        wrapper: TestContext,
      },
    );

    const tab2 = screen.getByText('Tab 2') as HTMLElement;

    userEvent.click(tab2);

    expect(spiedOnSetActiveTabValue).toBeCalledWith('2');
  });
});

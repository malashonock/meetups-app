import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route, Outlet, NavLink } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NavTabs } from 'components';

const MockRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/']}>
    <Routes>
      <Route
        path="/"
        element={
          <div>
            {children}
            <Outlet />
          </div>
        }
      >
        <Route path="meetups" element={<h1>Meetups page</h1>} />
        <Route path="news" element={<h1>News page</h1>} />
      </Route>
    </Routes>
  </MemoryRouter>
);

describe('NavTabs', () => {
  it('renders all provided nav tabs', () => {
    render(
      <NavTabs>
        <NavLink to="/meetups">Meetups</NavLink>
        <NavLink to="/news">News</NavLink>
      </NavTabs>,
      {
        wrapper: MockRouter,
      },
    );

    expect(screen.getByText('Meetups')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();

    const newsTab = screen.getByText('News') as HTMLElement;
    userEvent.click(newsTab);

    expect(screen.getByText('Meetups')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();

    const meetupsTab = screen.getByText('Meetups') as HTMLElement;
    userEvent.click(meetupsTab);

    expect(screen.getByText('Meetups')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
  });

  it('renders only the selected nav tab content', () => {
    render(
      <NavTabs>
        <NavLink to="/meetups">Meetups</NavLink>
        <NavLink to="/news">News</NavLink>
      </NavTabs>,
      {
        wrapper: MockRouter,
      },
    );

    expect(screen.queryByText('Meetups page')).not.toBeInTheDocument();
    expect(screen.queryByText('News page')).not.toBeInTheDocument();

    const meetupsTab = screen.getByText('Meetups') as HTMLElement;
    userEvent.click(meetupsTab);

    expect(screen.getByText('Meetups page')).toBeInTheDocument();
    expect(screen.queryByText('News page')).not.toBeInTheDocument();

    const newsTab = screen.getByText('News') as HTMLElement;
    userEvent.click(newsTab);

    expect(screen.queryByText('Meetups page')).not.toBeInTheDocument();
    expect(screen.getByText('News page')).toBeInTheDocument();
  });
});

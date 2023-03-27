import {render, screen, configure} from '@testing-library/react';
import {fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import Login from '../Login';
import {BrowserRouter as Router} from 'react-router-dom';

const URL = 'http://localhost:3010/v0/login';

const server = setupServer(
  rest.post(URL, async (req, res, ctx) => {
    const user = await req.json();
    return user.email === 'molly@books.com' ?
      res(ctx.json({name: 'Molly Member', accessToken: 'some-old-jwt'})) :
      res(ctx.status(401, 'Username or password incorrect'));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Login loads correctly
test('Loads correctly', () => {
  render(
    <Router>
      <Login />
    </Router>,
  );
  configure({testIdAttribute: 'id'});
  expect(screen.getByTestId('email')).not.toBeNull();
  expect(screen.getByTestId('password')).not.toBeNull();
  expect(screen.getByTestId('submit')).not.toBeNull();
});

// Incorrect credentials
it('Incorrect creds', async () => {
  render(
    <Router>
      <Login />
    </Router>,
  );
  let alerted = false;
  window.alert = () => {
    alerted = true;
  };
  fireEvent.click(screen.getByTestId('submit'));
  await waitFor(() => {
    expect(alerted).toBe(true);
  });
  expect(sessionStorage.getItem('user')).toBe(null);
});

// Correct credentials
test('Correct creds', async () => {
  render(
    <Router>
      <Login />
    </Router>,
  );
  window.alert = () => { };
  const email = screen.getByTestId('email');
  await userEvent.type(email, 'molly@books.com');
  const passwd = screen.getByTestId('password');
  await userEvent.type(passwd, 'mollymember');
  fireEvent.click(screen.getByTestId('submit'));
  await waitFor(() => {
    expect(sessionStorage.getItem('user')).not.toBe(null);
  });
});


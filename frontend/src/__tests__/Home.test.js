import {render, screen, configure} from '@testing-library/react';
import {fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import App from '../App';

const email = [
  {'to': {'name': 'mollymember', 'email': 'molly@books.com'},
    'from': {'name': 'Andy Vere', 'email': 'averev@shareasale.com'},
    'subject': 'F.', 'body': 'e.', 'received': '2022-05-11T05:55:22Z',
    'read': 'True', 'starred': 'True'},
  {'to': {'name': 'mollymember', 'email': 'molly@books.com'},
    'from': {'name': 'Andy Vere', 'email': 'averev@shareasale.com'},
    'subject': 'F.', 'body': 'f.', 'received': '2022-05-11T05:55:22Z',
    'read': 'False', 'starred': 'False'}];

const server = setupServer(
  rest.post('http://localhost:3010/v0/login', async (req, res, ctx) => {
    const user = await req.json();
    return user.email === 'molly@books.com' ?
      res(ctx.json({name: 'Molly Member', accessToken: 'some-old-jwt'})) :
      res(ctx.status(401, 'Username or password incorrect'));
  }),
  rest.get('http://localhost:3010/v0/mail', async (req, res, ctx) => {
    return req.headers.get('authorization') === 'Bearer bad-jwt' ?
      res(ctx.status(401, 'Bad JWT')) : res(ctx.json(email));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Login Logout
test('Login Logout', async () => {
  render(<App />);
  configure({testIdAttribute: 'id'});

  expect(screen.getByTestId('email')).not.toBeNull();
  expect(screen.getByTestId('password')).not.toBeNull();
  expect(screen.getByTestId('submit')).not.toBeNull();
  window.alert = () => { };
  const email = screen.getByTestId('email');
  await userEvent.type(email, 'molly@books.com');
  const passwd = screen.getByTestId('password');
  await userEvent.type(passwd, 'mollymember');
  fireEvent.click(screen.getByTestId('submit'));
  await waitFor(() => {
    expect(screen.getAllByText('Inbox')).not.toBeNull();
  });
  fireEvent.click(screen.getByTestId('logout'));
  expect(screen.getByTestId('email')).not.toBeNull();
  expect(screen.getByTestId('password')).not.toBeNull();
  expect(screen.getByTestId('submit')).not.toBeNull();
  expect(sessionStorage.getItem('user')).toBe(null);
});

// Home loads correctly
test('Home Loads Correctly', async () => {
  render(<App />);
  configure({testIdAttribute: 'id'});

  expect(screen.getByTestId('email')).not.toBeNull();
  expect(screen.getByTestId('password')).not.toBeNull();
  expect(screen.getByTestId('submit')).not.toBeNull();
  window.alert = () => { };
  const email = screen.getByTestId('email');
  await userEvent.type(email, 'molly@books.com');
  const passwd = screen.getByTestId('password');
  await userEvent.type(passwd, 'mollymember');
  fireEvent.click(screen.getByTestId('submit'));
  await waitFor(() => {
    expect(screen.getAllByText('Inbox')).not.toBeNull();
  });
  await waitFor(() => {
    expect(screen.getAllByText('Andy Vere')).not.toBeNull();
  });
  fireEvent.click(screen.getByTestId('logout'));
  expect(screen.getByTestId('email')).not.toBeNull();
  expect(screen.getByTestId('password')).not.toBeNull();
  expect(screen.getByTestId('submit')).not.toBeNull();
  expect(sessionStorage.getItem('user')).toBe(null);
});

// Without logging in
test('Without Logging in', async () => {
  render(<App />);
  configure({testIdAttribute: 'id'});

  expect(screen.getByTestId('email')).not.toBeNull();
  expect(screen.getByTestId('password')).not.toBeNull();
  expect(screen.getByTestId('submit')).not.toBeNull();
  window.alert = () => { };
  const email = screen.getByTestId('email');
  await userEvent.type(email, 'molly@books.com');
  const passwd = screen.getByTestId('password');
  await userEvent.type(passwd, 'mollymember');
  fireEvent.click(screen.getByTestId('submit'));
  await waitFor(() => {
    expect(screen.getAllByText('Inbox')).not.toBeNull();
  });
  sessionStorage.setItem('user',
    JSON.stringify({'name': 'Molly Member', 'accessToken': 'bad-jwt'}));
  await waitFor(() => {
    expect(screen.getByTestId('email')).not.toBeNull();
  });
});

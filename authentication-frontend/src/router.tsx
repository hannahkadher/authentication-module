import { RouteObject } from 'react-router-dom';
import SignUp from './containers/signup';
import SignIn from './containers/login';
import ApplicationPage from './containers/application';
import PrivateRoute from './components/private-route/PrivateRoute';
import RedirectToApplication from './components/redirect-application';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RedirectToApplication />,
  },
  {
    path: '/login',
    element: <SignIn />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/application',
    element: <PrivateRoute />,
    children: [
      {
        path: '',
        element: <ApplicationPage />
      }
    ],
  },
];

export default routes;

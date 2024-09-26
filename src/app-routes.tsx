import { HomePage, ProfilePage, UsersPage, EditUserPage } from './pages';
import { withNavigationWatcher } from './contexts/navigation';

const routes = [
  {
    path: '/',
    element: HomePage
  },
  {
    path: '/profile',
    element: ProfilePage
  },
  {
    path: '/users',
    element: UsersPage
  },
  {
    path: '/edit-user/:id',
    element: EditUserPage
  }
];

export default routes.map(route => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path)
  };
});

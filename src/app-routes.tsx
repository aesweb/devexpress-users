import { HomePage, UsersPage, ProfilePage } from './pages';
import { withNavigationWatcher } from './contexts/navigation';

const routes = [
  {
    path: '/users',
    element: UsersPage,
  },
  {
    path: '/profile',
    element: ProfilePage,
  },
  {
    path: '/home',
    element: HomePage,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});

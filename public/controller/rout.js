import { home_page } from '../viewpage/home_page.js';
import { users_page } from '../viewpage/users_page.js';

export const routePathNames = {
	HOME: '/',
	USERS: '/users',
};

export const routes = [
	{ path: routePathNames.HOME, page: home_page },
	{ path: routePathNames.USERS, page: users_page },
];

export function routing(pathname, hash) {
	const route = routes.find((r) => r.path == pathname);
	if (route) route.page();
	else routes[0].page();
}

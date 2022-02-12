import * as Elements from './elements.js';
import { routePathNames } from '../controller/rout.js';

export function addEventListeners() {
	Elements.menuUsers.addEventListener('click', () => {
		history.pushState(null, null, routePathNames.USERS);
		users_page();
	});
}
export function users_page() {
	Elements.root.innerHTML = '<h1>Users Page </h1>';
}

import * as FirebaseAuth from './controller/firebase_auth.js';
import { routing } from './controller/rout.js';
import * as HomePage from './viewpage/home_page.js';
import * as UsersPage from './viewpage/users_page.js';
import * as EditProduct from './controller/edit_product.js';
window.onload = () => {
	const pathname = window.location.pathname;
	const hash = window.location.hash;

	routing(pathname, hash);
};

window.addEventListener('popstate', (e) => {
	e.preventDefault();
	const pathname = window.location.pathname;
	const hash = window.location.hash;
	routing(pathname, hash);
});

EditProduct.addEventListeners();
FirebaseAuth.addEventListeners();
HomePage.addEventListeners();
UsersPage.addEventListeners();

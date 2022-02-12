import {
	getAuth,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	createUserWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js';
import * as Elements from '../viewpage/elements.js';
import * as Util from '../viewpage/util.js';
import * as Constants from '../model/constants.js';
import { routePathNames, routing } from './rout.js';
import * as WelcomeMessage from '../viewpage/welcome_message.js';

const auth = getAuth();

export let currentUser = null;

export function addEventListeners() {
	Elements.formSignin.addEventListener('submit', async (e) => {
		e.preventDefault();
		const email = e.target.email.value;
		const password = e.target.password.value;

		if (!Constants.adminEmails.includes(email)) {
			Util.info('Error', 'Only for admins', Elements.modalSignin);
			return;
		}

		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			Elements.modalSignin.hide();
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			Util.info('Sign in error', JSON.stringify(error), Elements.modalSignin);
			if (Constants.DEV) {
				console.log(`error: ${errorCode} | ${errorMessage}`);
			}
		}
	});

	Elements.menuSignout.addEventListener('click', async () => {
		//sign out from Firebase Auth
		try {
			await signOut(auth);
		} catch (error) {
			Util.info('Sign Out Error: Try again\n', JSON.stringify(error));
			if (Constants.DEV) {
				console.log(`sign out error: Try again\n ${error}`);
			}
		}
	});

	onAuthStateChanged(auth, authStateChangedObserver);
}

function authStateChangedObserver(user) {
	if (user) {
		// signed in
		currentUser = user;
		let elements = document.getElementsByClassName('modal-preauth');
		for (let i = 0; i < elements.length; i++) {
			elements[i].style.display = 'none';
		}
		elements = document.getElementsByClassName('modal-postauth');
		for (let i = 0; i < elements.length; i++) {
			elements[i].style.display = 'block';
		}
		const pathname = window.location.pathname;
		const hash = window.location.hash;
		routing(pathname, hash);
	} else {
		// signed out
		currentUser = null;
		let elements = document.getElementsByClassName('modal-preauth');
		for (let i = 0; i < elements.length; i++) {
			elements[i].style.display = 'block';
		}
		elements = document.getElementsByClassName('modal-postauth');
		for (let i = 0; i < elements.length; i++) {
			elements[i].style.display = 'none';
		}
		history.pushState(null, null, routePathNames.HOME);
		Elements.root.innerHTML = WelcomeMessage.html;
	}
}

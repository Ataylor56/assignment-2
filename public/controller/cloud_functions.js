import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-functions.js';
import { Product } from '../model/product.js';

const functions = getFunctions();

//setup emulator
const hostname = window.location.hostname;
if (hostname == 'localhost' || hostname == '127.0.0.1') {
	connectFunctionsEmulator(functions, hostname, '5001');
}

const cfn_addProduct = httpsCallable(functions, 'cfn_addProduct');
export async function addProduct(product) {
	const result = await cfn_addProduct(product);
	return result.data;
}

const cfn_getProductList = httpsCallable(functions, 'cfn_getProductList');
export async function getProductList() {
	const products = [];
	const result = await cfn_getProductList({});
	result.data.forEach((element) => {
		const p = new Product(element);
		p.set_docId(element.docId);
		products.push(p);
	});
	return products;
}

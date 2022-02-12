import * as Elements from './elements.js';
import { routePathNames } from '../controller/rout.js';
import { currentUser } from '../controller/firebase_auth.js';
import { Product } from '../model/product.js';
import * as CloudFunctions from '../controller/cloud_functions.js';
import * as Util from './util.js';
import * as Constants from '../model/constants.js';
import * as CloudStorage from '../controller/cloud_storage.js';

let imageFileToUpload = null;

export function addEventListeners() {
	Elements.menuHome.addEventListener('click', async () => {
		history.pushState(null, null, routePathNames.HOME);
		const button = Elements.menuHome;
		const label = Util.disableButton(button);
		await home_page();
		Util.enableButton(button, label);
	});

	Elements.formAddProduct.imageButton.addEventListener('change', (e) => {
		imageFileToUpload = e.target.files[0];
		if (!imageFileToUpload) {
			Elements.formAddProduct.imageTag.removeAttribute('src');
			Elements.formAddProduct.imageTag.style.display = 'none';
			return;
		}
		const reader = new FileReader();
		reader.readAsDataURL(imageFileToUpload);
		Elements.formAddProduct.imageTag.style.display = 'block';
		reader.onload = () => (Elements.formAddProduct.imageTag.src = reader.result);
	});

	Elements.formAddProduct.form.addEventListener('submit', addNewProduct);
}
export async function home_page() {
	if (!currentUser) {
		Elements.root.innerHTML = '<h1>Protected Page </h1>';
		return;
	}
	let html = `
        <div>
            <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modal-add-product">
                + Add Product
            </button>
        </div>
    `;

	let products;

	try {
		products = await CloudFunctions.getProductList();
	} catch (e) {
		if (Constants.DEV) console.log(e);
		Util.info('Cannot get product list', JSON.stringify(e));
		Elements.root.innerHTML = html;
		return;
	}

	products.forEach((p) => {
		html += buildProductCard(p);
	});

	Elements.root.innerHTML = html;
}

async function addNewProduct(e) {
	e.preventDefault();
	const name = e.target.name.value;
	const price = e.target.price.value;
	const summary = e.target.summary.value;

	const product = new Product({
		name,
		price,
		summary,
	});
	const button = e.target.getElementsByTagName('button')[0];
	const label = Util.disableButton(button);

	try {
		//upload product image => imageName, imageURL
		const { imageName, imageURL } = await CloudStorage.uploadImage(imageFileToUpload);
		product.imageName = imageName;
		product.imageURL = imageURL;
		const docId = await CloudFunctions.addProduct(product.toFirestore());
		Util.info('Success!', `Added: ${product.name}, imageName = ${imageName} was added to the store`, Elements.modalAddProduct);
		e.target.reset();
		Elements.formAddProduct.imageTag.removeAttribute('src');
		Elements.formAddProduct.imageTag.style.display = 'none';
		await home_page();
	} catch (e) {
		if (Constants.DEV) console.log(JSON.stringify(e));
		Util.info('Add product failed', `${JSON.stringify(e)}`, Elements.modalAddProduct);
		e.target.reset();
		Elements.formAddProduct.imageTag.removeAttribute('src');
		Elements.formAddProduct.imageTag.style.display = 'none';
	}

	Util.enableButton(button, label);
}

function buildProductCard(product) {
	return `
    <div class="card d-inline-flex" style="width: 18rem;">
        <img src="${product.imageURL}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.price.toFixed(2)}<br>${product.summary}</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
    </div>
    `;
}

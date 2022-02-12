import * as Elements from './elements.js';

export function info(title, body, closeModal) {
	if (closeModal) closeModal.hide();
	Elements.modalInfobox.title.innerHTML = title;
	Elements.modalInfobox.body.innerHTML = body;
	Elements.modalInfobox.modal.show();
}

export function disableButton(button) {
	button.disabled = true;
	const ogLabel = button.innerHTML;
	button.innerHTML = 'Wait...';
	return ogLabel;
}

export function enableButton(button, label) {
	if (label) button.innerHTML = label;
	button.disabled = false;
}

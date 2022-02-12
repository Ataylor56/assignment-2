export class Product {
	constructor(data) {
		this.name = data.name.toLowerCase().trim();
		this.price = typeof data.price == 'number' ? data.price : Number(data.price);
		this.summary = data.summary.trim();
		this.imageName = data.imageName;
		this.imageURL = data.imageURL;
	}

	set_docId(id) {
		this.docId = id;
	}

	toFirestore() {
		return {
			name: this.name,
			price: this.price,
			summary: this.summary,
			imageName: this.imageName,
			imageURL: this.imageURL,
		};
	}
}

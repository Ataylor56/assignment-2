export class Product {
	constructor(data) {
		if (data) {
			this.name = data.name.trim();
			this.brand = data.brand.trim();
			this.model = data.model.trim();
			this.productStyle = data.productStyle.trim();
			this.price = typeof data.price == 'number' ? data.price : Number(data.price);
			this.stock = typeof data.stock == 'number' ? data.stock : Number(data.stock);
			this.summary = data.summary.trim();
			this.imageName = data.imageName;
			this.imageURL = data.imageURL;
		}
	}

	set_docId(id) {
		this.docId = id;
	}

	toFirestore() {
		return {
			name: this.name,
			brand: this.brand,
			model: this.model,
			productStyle: this.productStyle,
			price: this.price,
			stock: this.stock,
			summary: this.summary,
			imageName: this.imageName,
			imageURL: this.imageURL,
		};
	}

	toFirestoreForUpdate() {
		const p = {};
		if (this.name) p.name = this.name;
		if (this.brand) p.brand = this.brand;
		if (this.model) p.model = this.model;
		if (this.productStyle) p.productStyle = this.productStyle;
		if (this.price) p.price = this.price;
		if (this.stock) p.stock = this.stock;
		if (this.summary) p.summary = this.summary;
		if (this.imageName) p.imageName = this.imageName;
		if (this.imageURL) p.imageURL = this.imageURL;

		return p;
	}
}

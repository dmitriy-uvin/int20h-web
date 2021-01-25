module.exports = Product => {
    return {
        title: Product.title,
        unit: Product.unit,
        bundle: Product.bundle,
        price: Product.price / 100,
        link: Product.web_url,
        image: Product.img.s200x200,
        tm: Product.producer.trademark,
        weight: Product.weight,
        quantity:Product.quantity,
        promotion:Product.discount.status,
        pricePerGramm: 0,
        country:Product.country,
    };
}
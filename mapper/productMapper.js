module.exports = Product => {
    return {
        title: Product.title,
        unit: Product.unit,
        bundle: Product.bundle,
        price: Product.price,
        link: Product.web_url,
        image: Product.img.s200x200,
        tm: Product.producer.trademark,
        weight: Product.weight ? Product.weight : 0,
        pricePerGramm: Product.pricePerGramm ? Product.pricePerGramm : 0,
        quantity:Product.quantity,
        country:Product.country,
    };
}
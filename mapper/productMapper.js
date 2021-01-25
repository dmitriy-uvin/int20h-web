module.exports = Product => ({
    title: Product.title,
    unit: Product.unit,
    bundle: Product.bundle,
    price: Product.price / 100,
    link: Product.web_url,
    image: Product.img.s200x200,
    producer: Product.producer.trademark,
    weight: Product.weight,
    pricePerGramm: 0
});
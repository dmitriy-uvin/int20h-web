export const productMapper = Product => ({
    title: Product.title,
    unit: Product.unit,
    bundle: Product.bundle,
    price: Product.price,
    link: Product.web_url,
    image: Product.image ? Product.image : null,
    producer: Product.producer,
    weight: Product.weight ? Product.weight : 0,
    pricePerGramm: Product.pricePerGramm ? Product.pricePerGramm : 0
});
export const productMapper = Product => {
    return {
        title: Product.title,
        unit: Product.unit,
        bundle: Product.bundle,
        price: Product.price / 100,
        link: Product.link,
        image: Product.image ? Product.image : null,
        tm: Product.tm,
        weight: Product.weight,
        pricePerGramm: Product.pricePerGramm/100,
        quantity:Product.quantity,
        country:Product.country,
    }
};
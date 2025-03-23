exports.totalPrice = async (cartData) => {
    let total = 0;
    for(const [key, quantity] of Object.entries(cartData)) {
        if(quantity > 0) {
            let product = await Product.findOne({id: key})
            total += product.new_price * quantity
        }
    }

    let tax = 0.05 * total;
    let shippingPrice = 10;

    return total + tax + shippingPrice;
}

exports.filterdCartItems = (cartData) => {
    return Object.entries(cartData)
    .filter(([_, quantity]) => quantity > 0)
    .reduce((filteredCart, [key, quantity]) => {
        filteredCart[key] = quantity;
        return filteredCart;
    }, {});
}
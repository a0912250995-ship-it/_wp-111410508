function calculateTotal(cart, discountFunc) {
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        total += cart[i];
    }

    return discountFunc(total);
}

const cart = [100, 200, 300];

const result = calculateTotal(cart, function(total) {
    return total - 50;
});

console.log(result);
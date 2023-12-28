document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.addToCartBtn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => addToCart(button.dataset.productId));
    });

    function addToCart(productId) {
        fetch('/addToCart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            body: JSON.stringify({ productId })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }
});

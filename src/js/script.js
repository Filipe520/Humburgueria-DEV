const menu = document.querySelector("#menu")
const cartBTN = document.querySelector('#cart-btn')
const cartModal = document.getElementById('card-modal')
const cartItemsContainer = document.querySelector("#cart-items")
const cartTotal = document.querySelector("#cart-total")
const checkoutBTN = document.querySelector("#checkout-btn")
const closeModalBTN = document.querySelector("#close-modal-btn")
const cartCounter = document.querySelector("#cart-count")
const addressInput = document.querySelector("#address")
const addressWarn = document.querySelector("#address-warn")

let cart = [];

// Abrir o modal do carrinho
cartBTN.addEventListener("click", function () {
    updateCartModal()
    cartModal.style.display = "flex"
})

// Fechar o modal quando clicar fora

cartModal.addEventListener('click', function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none'
    }
})

closeModalBTN.addEventListener('click', function () {
    cartModal.style.display = 'none'
})

menu.addEventListener('click', function (event) {
    let parentButton = event.target.closest('.add-to-cart-btn')

    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        // Adicionar no carrinho
        addToCart(name, price)
    }
})


// Função para adicionar no carrinho

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        // Se o item já existe, aumente apenas a quantidade
        existingItem.quantity += 1
    } else {
        cart.push({
            name, price, quantity: 1,
        })
    }

    updateCartModal()
}

// Atualiza o carrinho

function updateCartModal() {
    let total = 0;
    cartItemsContainer.innerHTML = "";

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class="font-medium mt-2">R$${item.price.toFixed(2)}</p>
            </div>
        
        
        <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
        </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = `Total: ${total.toLocaleString("pt-BR", {
        style: "currency", currency: "BRL"
    })}`

    cartCounter.innerHTML = cart.length
}

// Função para remover o item do carrinho

cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains('remove-from-cart-btn')) {
        let name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = cart[index];
        
        if(item.quantity > 1) {
            item.quantity -= 1
            updateCartModal();
            return
        }

        cart.splice(index, 1)
        updateCartModal()
    }
}

addressInput.addEventListener('input', function(event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove('border-red-500')
        addressWarn.classList.add("hidden")
    }
})


// Finalizar pedido
checkoutBTN.addEventListener('click', function() {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        return;
    }
    if (cart.length === 0) return;
    if(addressInput.value === '') {
        addressWarn.classList.remove('hidden')
        addressInput.classList.add('border-red-500')
        return;
    }


    // Enviar o pedido para api do whatsApp
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }) .join("")
    const message = encodeURIComponent(cartItems)
    const phone = '61985543989'
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart.length = 0
    updateCartModal()
})


// Verificar a hora e manipular o card horário
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    // True = restarante está aberto
}

const spanItem = document.querySelector("#date-span")
const isOpen = checkRestaurantOpen();

if(isOpen) {
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-green-600')
} else {
    spanItem.classList.remove('bg-green-600')
    spanItem.classList.add('bg-red-500')
}
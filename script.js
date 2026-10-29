
const starterProducts = [
    {
        id: 1,
        name: "Air Sprint ",
        price: 2499,
        category: "Sports",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
        description: "Lightweight shoes for daily walks and active days."
    },
    {
        id: 2,
        name: "Classic Street Sneaker",
        price: 1899,
        category: "Casual",
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
        description: "An easy-to-style sneaker for everyday outfits."
    },
    {
        id: 3,
        name: "Urban White Trainer",
        price: 2199,
        category: "Casual",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
        description: "Clean for casual occasions."
    },
    {
        id: 4,
        name: "Active Flex Shoe",
        price: 2799,
        category: "Sports",
        image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80",
        description: "Comfortable footwear for exercise"
    },
    {
        id: 5,
        name: "Everyday Canvas Shoe",
        price: 1299,
        category: "Casual",
        image: "https://images.unsplash.com/photo-1520256862855-9981c41fc7b4?auto=format&fit=crop&w=900&q=80",
        description: "Simple casual shoes for relaxed wear"
    },
    {
        id: 6,
        name: "Smart Formal Shoe",
        price: 3299,
        category: "Formal",
        image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=80",
        description: "A polished look for events and formal outfits."
    },
    {
        id: 7,
        name: "Junior Play Shoe",
        price: 999,
        category: "Kids",
        image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80",
        description: "A fun, comfortable option for little one feet."
    },
    {
        id: 8,
        name: "Road Runner Pro",
        price: 2999,
        category: "Sports",
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80",
        description: "Sport  inspired shoes for busy days."
    }
];

/*GET SAVED DATA*/
function readSavedData(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
        console.warn("Could not read saved data:", error);
        return fallback;
    }
}

let products = readSavedData("ShoesStoreProducts", null);
if (!Array.isArray(products) || products.length === 0) {
    products = starterProducts.map(product => ({ ...product }));
    saveProducts();
}

let cart = readSavedData("ShoesStoreCart", []);
if (!Array.isArray(cart)) {
    cart = [];
}

function saveProducts() {
    localStorage.setItem("ShoesStoreProducts", JSON.stringify(products));
}

function saveCart() {
    localStorage.setItem("ShoesStoreCart", JSON.stringify(cart));
}

/*variables let JavaScript update the page. */
const productList = document.getElementById("product-list");
const productCount = document.getElementById("product-count");
const emptyMessage = document.getElementById("empty-message");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");

const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartSubtotal = document.getElementById("cart-subtotal");

const adminModal = document.getElementById("admin-modal");
const adminProductList = document.getElementById("admin-product-list");
const productForm = document.getElementById("product-form");
const adminMessage = document.getElementById("admin-message");

/*HELPER*/
function formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function findProduct(productId) {
    return products.find(product => product.id === Number(productId));
}

/*SHOW PRODUCTS*/
function displayProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    let visibleProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            (product.description || "").toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "All" || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (sortFilter.value === "low-high") {
        visibleProducts.sort((a, b) => a.price - b.price);
    } else if (sortFilter.value === "high-low") {
        visibleProducts.sort((a, b) => b.price - a.price);
    } else if (sortFilter.value === "name") {
        visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    productList.innerHTML = visibleProducts.map(product => `
        <article class="product-card">
            <div class="product-image-wrap">
                <img class="product-image"
                     src="${escapeHTML(product.image)}"
                     alt="${escapeHTML(product.name)}"
                     loading="lazy"
                     onerror="this.onerror=null;this.src='https://placehold.co/600x450?text=Shoe+Image';">
                <span class="product-badge">${escapeHTML(product.category)}</span>
            </div>
            <div class="product-info">
                <p class="product-category">${escapeHTML(product.category)} footwear</p>
                <h3>${escapeHTML(product.name)}</h3>
                <p class="product-description">${escapeHTML(product.description || "Comfortable shoes for everyday use.")}</p>
                <div class="product-bottom">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="add-cart-button" type="button" data-add-to-cart="${product.id}">Add to cart</button>
                </div>
            </div>
        </article>
    `).join("");

    productCount.textContent = `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"}`;
    emptyMessage.classList.toggle("hidden", visibleProducts.length > 0);
}

/*SHOP SEARCH, CATEGORY AND SORT */
searchInput.addEventListener("input", displayProducts);
categoryFilter.addEventListener("change", displayProducts);
sortFilter.addEventListener("change", displayProducts);

/*ADD AND REMOVE CART ITEMS */
function addToCart(productId) {
    const product = findProduct(productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === product.id);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ id: product.id, quantity: 1 });
    }

    saveCart();
    displayCart();
    showMessage("Added to cart", `${product.name} has been added to your cart.`);
}

function changeQuantity(productId, amount) {
    const item = cart.find(cartItem => cartItem.id === Number(productId));
    if (!item) return;

    item.quantity += amount;
    if (item.quantity <= 0) {
        cart = cart.filter(cartItem => cartItem.id !== Number(productId));
    }

    saveCart();
    displayCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== Number(productId));
    saveCart();
    displayCart();
}

function displayCart() {
    // Remove cart entries for products that have been deleted.
    cart = cart.filter(item => findProduct(item.id));
    saveCart();

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => {
        const product = findProduct(item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    cartCount.textContent = totalQuantity;
    cartSubtotal.textContent = formatPrice(subtotal);

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="muted">Your cart is empty. Add a pair you like.</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const product = findProduct(item.id);
        return `
            <div class="cart-item">
                <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}"
                     onerror="this.onerror=null;this.src='https://placehold.co/150x150?text=Shoe';">
                <div>
                    <h3>${escapeHTML(product.name)}</h3>
                    <p>${formatPrice(product.price)} each</p>
                    <div class="quantity-controls">
                        <button type="button" data-quantity-change="${product.id}" data-amount="-1" aria-label="Decrease quantity">−</button>
                        <span>${item.quantity}</span>
                        <button type="button" data-quantity-change="${product.id}" data-amount="1" aria-label="Increase quantity">+</button>
                        <button class="remove-button" type="button" data-remove-cart="${product.id}">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

/*CART PANEL AND BUTTON CLICKS */
function openCart() {
    cartPanel.classList.remove("hidden");
    cartOverlay.classList.remove("hidden");
}

function closeCart() {
    cartPanel.classList.add("hidden");
    cartOverlay.classList.add("hidden");
}

document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
        addToCart(addButton.dataset.addToCart);
    }

    const quantityButton = event.target.closest("[data-quantity-change]");
    if (quantityButton) {
        changeQuantity(quantityButton.dataset.quantityChange, Number(quantityButton.dataset.amount));
    }

    const removeButton = event.target.closest("[data-remove-cart]");
    if (removeButton) {
        removeFromCart(removeButton.dataset.removeCart);
    }

    const editButton = event.target.closest("[data-edit-product]");
    if (editButton) {
        startEditingProduct(editButton.dataset.editProduct);
    }

    const deleteButton = event.target.closest("[data-delete-product]");
    if (deleteButton) {
        deleteProduct(deleteButton.dataset.deleteProduct);
    }
});

/*PRODUCT MANAGER: ADD,EDIT,DELETE */
function openAdmin() {
    adminModal.classList.remove("hidden");
    renderAdminProducts();
}

function closeAdmin() {
    adminModal.classList.add("hidden");
    resetProductForm();
}

document.getElementById("open-admin").addEventListener("click", openAdmin);
document.getElementById("close-admin").addEventListener("click", closeAdmin);

function renderAdminProducts() {
    if (products.length === 0) {
        adminProductList.innerHTML = '<p class="muted">No products yet. Use the form above to add one.</p>';
        return;
    }

    adminProductList.innerHTML = products.map(product => `
        <div class="admin-product-row">
            <img src="${escapeHTML(product.image)}" alt=""
                 onerror="this.onerror=null;this.src='https://placehold.co/100x100?text=Shoe';">
            <div>
                <strong>${escapeHTML(product.name)}</strong>
                <small>${formatPrice(product.price)} · ${escapeHTML(product.category)}</small>
            </div>
            <button type="button" data-edit-product="${product.id}">Edit</button>
            <button type="button" class="delete-product" data-delete-product="${product.id}">Delete</button>
        </div>
    `).join("");
}

function resetProductForm() {
    productForm.reset();
    document.getElementById("edit-product-id").value = "";
    document.getElementById("save-product-button").textContent = "Add product";
    document.getElementById("cancel-edit-button").classList.add("hidden");
    adminMessage.textContent = "";
}

document.getElementById("cancel-edit-button").addEventListener("click", resetProductForm);

productForm.addEventListener("submit", event => {
    event.preventDefault();

    const editId = document.getElementById("edit-product-id").value;
    const name = document.getElementById("product-name").value.trim();
    const price = Number(document.getElementById("product-price").value);
    const category = document.getElementById("product-category").value;
    const image = document.getElementById("product-image").value.trim();
    const description = document.getElementById("product-description").value.trim();

    if (!name || !Number.isFinite(price) || price <= 0 || !image) {
        adminMessage.textContent = "Please enter a name, valid price and image URL.";
        return;
    }

    if (editId) {
        const product = findProduct(editId);
        if (!product) return;
        Object.assign(product, { name, price, category, image, description });
        adminMessage.textContent = "Product updated successfully.";
    } else {
        const newProduct = {
            id: Date.now(),
            name,
            price,
            category,
            image,
            description: description || "Comfortable shoes for everyday use."
        };
        products.unshift(newProduct);
        adminMessage.textContent = "Product added successfully.";
    }

    saveProducts();
    displayProducts();
    displayCart();
    renderAdminProducts();
    resetProductForm();
});

function startEditingProduct(productId) {
    const product = findProduct(productId);
    if (!product) return;

    document.getElementById("edit-product-id").value = product.id;
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-category").value = product.category;
    document.getElementById("product-image").value = product.image;
    document.getElementById("product-description").value = product.description || "";
    document.getElementById("save-product-button").textContent = "Save changes";
    document.getElementById("cancel-edit-button").classList.remove("hidden");
    adminMessage.textContent = "Editing product. Change the fields and save.";
    document.getElementById("product-name").focus();
}

function deleteProduct(productId) {
    const product = findProduct(productId);
    if (!product) return;

    const confirmed = window.confirm(`Delete "${product.name}" from the store?`);
    if (!confirmed) return;

    products = products.filter(item => item.id !== Number(productId));
    cart = cart.filter(item => item.id !== Number(productId));

    saveProducts();
    saveCart();
    displayProducts();
    displayCart();
    renderAdminProducts();
    adminMessage.textContent = "Product deleted.";
    resetProductForm();
}

/*DEMO ORDER AND MESSAGE*/
const messageModal = document.getElementById("message-modal");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");

function showMessage(title, message) {
    messageTitle.textContent = title;
    messageText.textContent = message;
    messageModal.classList.remove("hidden");
}

function closeMessage() {
    messageModal.classList.add("hidden");
}

document.getElementById("close-message").addEventListener("click", closeMessage);
document.getElementById("message-ok").addEventListener("click", closeMessage);

document.getElementById("checkout-button").addEventListener("click", () => {
    if (cart.length === 0) {
        showMessage("Your cart is empty", "Add a shoe to the cart before placing a demo order.");
        return;
    }

    const total = cart.reduce((sum, item) => {
        const product = findProduct(item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    cart = [];
    saveCart();
    displayCart();
    closeCart();
    showMessage("Demo order placed!", `Your sample order total was ${formatPrice(total)}. This is a college-project demo only; no payment or delivery has been arranged.`);
});

/*CONTACT FORM*/

const contactForm = document.getElementById("contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document
            .getElementById("contact-name")
            .value.trim();

        const email = document
            .getElementById("contact-email")
            .value.trim();

        const subject = document
            .getElementById("contact-subject")
            .value.trim();

        const message = document
            .getElementById("contact-message")
            .value.trim();

        const status = document.getElementById("contact-status");

        if (!name || !email || !subject || !message) {
            status.textContent = "Please fill in all fields.";
            return;
        }

        status.textContent =
            "Thank you, " + name +
            "! Your message has been entered successfully.";

        contactForm.reset();

    });

}

displayProducts();
displayCart();

import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productIndex = cartItems.findIndex(item => item.Id === this.product.Id);

  if (productIndex > -1) {
    // Product already in cart, increment quantity
    cartItems[productIndex].Quantity = (cartItems[productIndex].Quantity || 1) + 1;
  } else {
    // Add new product with quantity 1
    const productToAdd = { ...this.product, Quantity: 1 };
    cartItems.push(productToAdd);
  }

  setLocalStorage("so-cart", cartItems);
}

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
  
}

function productDetailsTemplate(product) {
  document.querySelector('h2').textContent = product.Brand.Name;
  document.querySelector('h3').textContent = product.NameWithoutBrand;

  const productImage = document.getElementById('productImage');
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById('productColor').textContent = product.Colors[0].ColorName;
  document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;

  document.getElementById('addToCart').dataset.id = product.Id;

  // Discount indicator
  // Verify if the product is discounted
  if (product.FinalPrice < product.SuggestedRetailPrice) {
    // If the product is discounted, calculate the discount percentage
    const discountPercent = Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100);
    const productDetails = document.querySelector('.product-detail');
    // Create a new paragraph element for the old price
    const sugestedRetailPrice = document.createElement('p');
    sugestedRetailPrice.classList.add('product-card__old-price');
    sugestedRetailPrice.innerHTML = `<small>from:<s>$${product.SuggestedRetailPrice}</s></small>`;
    // Insert the new paragraph before the product price
    // Use document.getElementById('productPrice') to ensure the correct context
    productDetails.insertBefore(sugestedRetailPrice, document.getElementById('productPrice'));
    document.getElementById('productPrice').innerHTML = `$${product.FinalPrice} <span class="discount-badge">-${discountPercent}% OFF</span>`;
  } else {
    document.getElementById('productPrice').textContent = product.FinalPrice;
  }
}
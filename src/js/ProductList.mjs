import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  // Check if the product is discounted
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  // Calculate the discount percentage
  // Use Math.round to round the discount percentage to the nearest integer
  const discountPercent = isDiscounted
    ? Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100)
    : 0;

  // Return the HTML string for the product card
  // Use template literals for better readability
  return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <img src="${product.Image}" alt="${product.Name}">
        <h3>${product.Brand.Name}</h3>
        <h2>${product.Name}</h2>
        ${isDiscounted ? `<p class="product-card__old-price"><small>from:<s>$${product.SuggestedRetailPrice}</s></small></p>` : ""}
        <p class="product-card__price">
          $${product.FinalPrice}
          ${isDiscounted ? `<span class="discount-badge">-${discountPercent}%</span>` : ""}
        </p>
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  renderList(list) {
    // Filter out specific products by their Id
    // This filtering logic meets the requirement of not showing specific products by now
    // Most likely, this will be refactored in the future when we can show all products
    const filteredList = list.filter(product => product.Id !== "989CG" && product.Id !== "880RT");
    // apply use new utility function instead of the commented code above
    renderListWithTemplate(productCardTemplate, this.listElement, filteredList);
  }
}
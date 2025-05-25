import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import CartCount from "./CartCount.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";
import { sortProducts } from "./ProductSort.mjs";

// 1. Call our function to load the header and footer
loadHeaderFooter();

// 2. Listen for when header/footer are finished loading
// This is like waiting for someone to announce "dinner is ready!" before you go eat
document.addEventListener("headerfooterloaded", () => {
  // 3. Now we can set up the cart count (the number in the cart icon)
  const cartCount = new CartCount(document.querySelector(".cart"));
  cartCount.render();
});

// 4. The rest of the code for listing products stays the same
const category = getParam("category");
const dataSource = new ProductData();
const element = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, element);
productList.init();

const title = document.querySelector("title");
const heading = document.querySelector("h2");
const categoryText = category
  .replace("-", " ")
  .split(" ")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
heading.textContent = "Top Products: " + categoryText;
title.textContent = `Sleep Outside | ${categoryText}`;

// set up sorting dropdown
const sortOptions = [
  { value: "default", text: "" },
  { value: "name-a-z", text: "Name: A → Z" },
  { value: "name-z-a", text: "Name: Z → A" },
  { value: "price-low-to-high", text: "Price: Low to High" },
  { value: "price-high-to-low", text: "Price: High to Low" },
];

const select = document.createElement("select");
const sortLabel = document.createElement("label");
sortLabel.setAttribute("for", "sortSelect");
sortLabel.textContent = "Sort by: ";
document.querySelector("#sortContainer").appendChild(sortLabel);
select.id = "sortSelect";
select.name = "sortSelect";

sortOptions.forEach((option) => {
  const optionElement = document.createElement("option");
  optionElement.value = option.value;
  optionElement.text = option.text;
  select.add(optionElement);
});
document.querySelector("#sortContainer").appendChild(select);

const sortSelect = document.getElementById("sortSelect");
sortSelect.addEventListener("change", () => {
  const sorted = sortProducts(productList.products, sortSelect.value);
  productList.renderList(sorted);
});

import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import CartCount from "./CartCount.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";
import { sortProducts } from "./ProductSort.mjs";

loadHeaderFooter();

document.addEventListener("headerfooterloaded", () => {
  const cartCount = new CartCount(document.querySelector(".cart"));
  cartCount.render();
  cartCount.listenForUpdates();
});

const category = getParam("category");
const dataSource = new ExternalServices();
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










document.addEventListener("productsLoaded", () => {
  const searchInput = document.getElementById("searchInput");

  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    
    const filtered = productList.products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );

    
    productList.renderList(filtered);
  });
});
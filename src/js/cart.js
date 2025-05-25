import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";
import CartCount from "./CartCount.mjs";

// Load header and footer
loadHeaderFooter();

document.addEventListener("headerfooterloaded", () => {
  const cartCount = new CartCount(document.querySelector(".cart"));
  cartCount.render();
  cartCount.listenForUpdates();
});
// Declare the cart variable
// This will be used to manage the shopping cart
const cart = new ShoppingCart();

// Initialize the shopping cart
cart.init();

import { loadHeaderFooter } from "./utils.mjs";
import CartCount from "./CartCount.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// Load header and footer
loadHeaderFooter();

document.addEventListener("headerfooterloaded", () => {
  const cartCount = new CartCount(document.querySelector(".cart"));
  cartCount.render();
  cartCount.listenForUpdates();
});

let order;

window.addEventListener("DOMContentLoaded", () => {
  order = new CheckoutProcess("so-cart", ".checkout-summary ");
  order.init();
  
  document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateOrderTotal.bind(order));

// listening for click on the button
  document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
    e.preventDefault();

    order.checkout();
  });
});
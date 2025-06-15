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

  // listening for submit on the form (not click on button)
  document
    .querySelector("form[name='checkout']")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      // Get the form element
      const form = document.forms["checkout"];

      // Check form validity
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // If validation passes, proceed with checkout
      order.checkout();
    });
});

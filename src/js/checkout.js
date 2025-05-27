import { loadHeaderFooter } from "./utils.mjs";
import CartCount from "./CartCount.mjs";

// Load header and footer
loadHeaderFooter();

document.addEventListener("headerfooterloaded", () => {
  const cartCount = new CartCount(document.querySelector(".cart"));
  cartCount.render();
  cartCount.listenForUpdates();
});



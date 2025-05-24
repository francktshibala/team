import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

// Load header and footer
loadHeaderFooter();

// Declare the cart variable
// This will be used to manage the shopping cart
const cart = new ShoppingCart();

// Initialize the shopping cart
cart.init();

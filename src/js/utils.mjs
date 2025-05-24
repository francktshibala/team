// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error('Error parsing localStorage data:', error);
    return null;
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  const element = qs(selector);
  if (element) {
    element.addEventListener("touchend", (event) => {
      event.preventDefault();
      callback();
    });
    element.addEventListener("click", callback);
  }
}

// get URL parameter
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// render a list with template
export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  if (!parentElement) {
    console.error('Parent element not found');
    return;
  }
  
  const htmlStrings = list.map(template);
  
  if (clear) {
    parentElement.innerHTML = "";
  }
  
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// render a single template with data
export function renderWithTemplate(template, parentElement, data, callback) {
  if (!parentElement) {
    console.error('Parent element not found');
    return;
  }
  
  parentElement.innerHTML = template;
  
  if (callback) {
    callback(data);
  }
}

// load template from path
export async function loadTemplate(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`Failed to load template: ${res.status}`);
    }
    const template = await res.text();
    return template;
  } catch (error) {
    console.error('Error loading template:', error);
    return '<div>Error loading template</div>';
  }
}

// load header and footer templates
export async function loadHeaderFooter() {
  try {
    // load the header and footer templates
    const headerTemplate = await loadTemplate("../partials/header.html");
    const footerTemplate = await loadTemplate("../partials/footer.html");
    
    // get the header and footer elements
    const headerElement = document.getElementById("main-header");
    const footerElement = document.getElementById("main-footer");
    
    // render the templates
    if (headerElement) {
      renderWithTemplate(headerTemplate, headerElement);
    }
    
    if (footerElement) {
      renderWithTemplate(footerTemplate, footerElement);
    }
  } catch (error) {
    console.error('Error loading header/footer:', error);
  }
}

// Add to utils.mjs - Cart counter functionality
export function updateCartCounter() {
  const cartItems = getLocalStorage("so-cart") || [];
  const totalItems = cartItems.reduce((total, item) => total + (item.Quantity || 1), 0);
  
  // Create or update cart counter badge
  let cartBadge = document.querySelector('.cart-counter');
  
  if (totalItems > 0) {
    if (!cartBadge) {
      cartBadge = document.createElement('span');
      cartBadge.className = 'cart-counter';
      document.querySelector('.cart').appendChild(cartBadge);
    }
    cartBadge.textContent = totalItems;
    cartBadge.style.display = 'block';
  } else if (cartBadge) {
    cartBadge.style.display = 'none';
  }
}
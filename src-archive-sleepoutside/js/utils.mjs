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
    
    // dispatch custom event
    const event = new CustomEvent("headerfooterloaded");
    document.dispatchEvent(event);
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

// Alert message function for displaying user notifications
export function alertMessage(message, scroll = true) {
  // Remove any existing alerts
  const existingAlert = document.querySelector('.alert-message');
  if (existingAlert) {
    existingAlert.remove();
  }

  // Create the alert element
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert-message';
  alertDiv.innerHTML = `
    <div class="alert-content">
      <span class="alert-text">${message}</span>
      <span class="alert-close">&times;</span>
    </div>
  `;

  // Add CSS styles
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--tertiary-color);
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    font-family: Arial, sans-serif;
    font-size: 16px;
    max-width: 90%;
    word-wrap: break-word;
  `;

  const alertContent = alertDiv.querySelector('.alert-content');
  alertContent.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  `;

  const closeButton = alertDiv.querySelector('.alert-close');
  closeButton.style.cssText = `
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    border: none;
    background: none;
    color: white;
    padding: 0;
    margin: 0;
  `;

  // Insert the alert at the top of the main element
  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.insertBefore(alertDiv, mainElement.firstChild);
  } else {
    document.body.insertBefore(alertDiv, document.body.firstChild);
  }

  // Add close functionality
  closeButton.addEventListener('click', () => {
    alertDiv.remove();
  });

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);

  // Scroll to top if requested
  if (scroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
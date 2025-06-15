import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function packageItems(items) {
    const simplifiedItems = items.map((item) => {
        console.log(item);
        return {
            id: item.Id,
            name: item.Name,
            price: item.FinalPrice,
            quantity: 1
        }
    });

    return simplifiedItems;
}

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    return data;
}

export default class CheckoutProcess {
    constructor(key, outputSelector)
    {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubtotal();
        this.calculateOrderTotal();
    }

    calculateItemSubtotal() {
        const summary = document.querySelector(
            this.outputSelector + "#cartTotal"
        );
        const itemNumber = document.querySelector(
            this.outputSelector + "#num-items"
        );

        itemNumber.innerText = this.list.length;

        const amounts = this.list.map(item => item.FinalPrice);
        this.itemTotal = amounts.reduce((sum, item) => sum + item);
        summary.innerText = `$${this.itemTotal}`;
    }

    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;
        this.shipping = 10 + (this.list.length - 1) * 2;
        this.orderTotal = (
            parseFloat(this.itemTotal) +
            parseFloat(this.tax) +
            parseFloat(this.shipping));
        
        this.displayOrderTotal();
    }

    displayOrderTotal() {
        const tax = document.querySelector(this.outputSelector + "#tax");
        const shipping = document.querySelector(this.outputSelector + "#shipping");
        const orderTotal = document.querySelector(this.outputSelector + "#orderTotal");

        tax.innerText = `$${this.tax.toFixed(2)}`;
        shipping.innerText = `$${this.shipping.toFixed(2)}`;
        orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    async checkout(form) {
        const formElement = document.forms["checkout"];
        const order = formDataToJSON(formElement);

        order.orderDate = new Date().toISOString();
        order.items = packageItems(this.list);
        order.orderTotal = this.orderTotal;
        order.tax = this.tax;
        order.shipping = this.shipping;
        console.log(order);

        try {
            const response = await services.checkout(order);
            console.log(response);
            
            // If we get here, the order was successful
            // Clear the cart
            setLocalStorage(this.key, []);
            
            // Redirect to success page
            window.location.href = "success.html";
            
        } catch (error) {
            console.error(error);
            
            // Handle different types of errors
            let errorMessage = "An error occurred during checkout. Please try again.";
            
            if (error.name === 'servicesError' && error.message) {
                // Server returned specific error details
                if (typeof error.message === 'object') {
                    // If the error message is an object, extract meaningful information
                    if (error.message.message) {
                        errorMessage = error.message.message;
                    } else if (error.message.error) {
                        errorMessage = error.message.error;
                    } else {
                        // Try to get the first error from the object
                        const firstError = Object.values(error.message)[0];
                        if (typeof firstError === 'string') {
                            errorMessage = firstError;
                        }
                    }
                } else if (typeof error.message === 'string') {
                    errorMessage = error.message;
                }
            }
            
            // Display the error message to the user
            alertMessage(errorMessage);
        }
    }
}
import { getLocalStorage } from "./utils.mjs";


export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.orderTotal = 0;
        this.subtotal = 0;
        this.tax = 0;
        this.shipping = 0;
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.displaySubtotal();
    }
    
    calculateItemSummary() {
        const summaryElement = document.querySelector(
            this.outputSelector + "#subtotal"
        );
        const itemNumElement = document.querySelector(
            this.outputSelector + "#num-items"
        );
        itemNumElement.innerText = this.list.length;
        
        const amounts = this.list.map((item) => item.FinalPrice);
        this.itemTotal = amounts.reduce((sum, item) => sum + item, 0);

        summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;
        this.shipping = 10 + (this.list.length - 1) * 2;
        this.orderTotal = (
            parseFloat(this.itemTotal) +
            parseFloat(this.tax) +
            parseFloat(this.shipping)
        )

        this.displayTotals();
    }

    displayTotals() {
        const taxElement = document.querySelector(
            this.outputSelector + "#tax"
        );
        const shippingElement = document.querySelector(
            this.outputSelector + "#shipping"
        );
        const orderTotalElement = document.querySelector(
            this.outputSelector + "#orderTotal"
        );
        taxElement.innerText = `$${this.tax.toFixed(2)}`;
        shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
        orderTotalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    async checkout() {
        const formElement = document.forms["checkout"];
        const order
    }
}
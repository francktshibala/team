import { getLocalStorage } from "./utils.mjs";

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

    }

    calculateItemSubtotal() {
        const summary = document.querySelector(this.outputSelector + "#cartTotal");
        const itemNumber = document.querySelector(this.outputSelector + "#num-items");

        itemNumber.innerText = this.list.length;
        const amounts = this.list.map(item => item.FinalPrice);
        this.itemTotal = amounts.reduce((sum, item) => sum + item);
        summary.innerText = this.itemTotal.toFixed(2);
    }

    calcuateOrderTotal() {
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

        tax.innerText = this.tax.toFixed(2);
        shipping.innerText = this.shipping.toFixed(2);
        orderTotal.innerText = this.orderTotal.toFixed(2);
    }
}
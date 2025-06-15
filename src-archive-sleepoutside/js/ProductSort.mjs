export function sortProducts(productList, sortParam) {
    const sorted = [...productList]

    switch (sortParam) {
        case "price-low-to-high":
            return sorted.sort((a, b) => a.FinalPrice - b.FinalPrice)
        case "price-high-to-low":
            return sorted.sort((a, b) => b.FinalPrice - a.FinalPrice)
        case "name-a-z":
            return sorted.sort((a, b) => a.Name.localeCompare(b.Name))
        case "name-z-a":
            return sorted.sort((a, b) => b.Name.localeCompare(a.Name))
        default:
            return sorted
    }
    
}
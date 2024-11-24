import { EQUIVALENT_PURCHASES } from "./equivalentPurchases";

export const calculateEquivalentPurchases = (value) => {
  // Filter items that could be bought with the value
  const affordableItems = EQUIVALENT_PURCHASES.filter(item => item.price <= value);
  
  if (affordableItems.length === 0) {
    return [];
  }

  // Group items by price range
  const priceRanges = {
    expensive: affordableItems.filter(item => item.price > value * 0.1),
    medium: affordableItems.filter(item => item.price <= value * 0.1 && item.price > value * 0.01),
    cheap: affordableItems.filter(item => item.price <= value * 0.01)
  };

  let selected = [];

  // Try to select one expensive item
  if (priceRanges.expensive.length > 0) {
    const randomExpensive = priceRanges.expensive[Math.floor(Math.random() * priceRanges.expensive.length)];
    selected.push(randomExpensive);
  }

  // Try to select one medium item
  if (priceRanges.medium.length > 0) {
    const randomMedium = priceRanges.medium[Math.floor(Math.random() * priceRanges.medium.length)];
    selected.push(randomMedium);
  }

  // Try to select one cheap item
  if (priceRanges.cheap.length > 0) {
    const randomCheap = priceRanges.cheap[Math.floor(Math.random() * priceRanges.cheap.length)];
    selected.push(randomCheap);
  }

  // Shuffle and limit to 3 items
  selected = selected.sort(() => 0.5 - Math.random()).slice(0, 3);

  // Calculate quantities with more dramatic scaling
  return selected.map(item => {
    const quantity = Math.floor(value / item.price);
    
    // Dynamic max quantity based on price ratio
    const priceRatio = item.price / value;
    let maxQuantity;
    
    if (priceRatio > 0.1) {
      maxQuantity = Math.min(quantity, 2);
    } else if (priceRatio > 0.01) {
      maxQuantity = Math.min(quantity, 10);
    } else if (priceRatio > 0.001) {
      maxQuantity = Math.min(quantity, 100);
    } else {
      maxQuantity = Math.min(quantity, 1000);
    }
    
    maxQuantity = Math.min(maxQuantity, Math.ceil(value * 0.8 / item.price));
    
    return {
      ...item,
      quantity: Math.max(1, maxQuantity)
    };
  }).sort((a, b) => b.quantity - a.quantity); // Sort by quantity in descending order
};
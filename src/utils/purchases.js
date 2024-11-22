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

  // Calculate quantities with more reasonable limits
  return selected.map(item => {
    const quantity = Math.floor(value / item.price);
    
    // Dynamic max quantity based on price ranges
    let maxQuantity;
    if (item.price > value * 0.1) {  // expensive items
      maxQuantity = Math.min(quantity, 5);  // Cap expensive items at 5
    } else if (item.price > value * 0.01) {  // medium items
      maxQuantity = Math.min(quantity, 20);  // Cap medium items at 20
    } else {  // cheap items
      maxQuantity = Math.min(quantity, 100);  // Cap cheap items at 100
    }
    
    // Additional sanity check based on total cost
    maxQuantity = Math.min(maxQuantity, Math.ceil(value * 0.6 / item.price)); // Max 60% of value
    
    return {
      ...item,
      quantity: Math.max(1, maxQuantity) // Ensure at least 1 item
    };
  });
};
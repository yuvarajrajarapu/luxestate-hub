export function formatPropertyPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 1)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)} L`;
  }

  return `₹${price.toLocaleString('en-IN')}`;
}

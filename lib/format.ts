export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function formatNumber(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount);
}

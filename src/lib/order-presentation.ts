import type { Order } from "../types";
export const summarizeOrderItems = (orders: Order[]) => {
  const lines = new Map<string, { order: Order; quantity: number }>();
  orders.forEach((order) => {
    const options =
      order.category === "normal_cocktail"
        ? [order.color1, order.color2, order.carbonated, order.aphrodisiac]
        : [];
    const key = JSON.stringify([
      order.productId,
      order.productName,
      order.productImageUrl,
      order.category,
      order.category === "original_cocktail" || order.category === "halloween" ? order.recipe || "" : "",
      ...options,
    ]);
    const existing = lines.get(key);
    if (existing) existing.quantity += 1;
    else lines.set(key, { order, quantity: 1 });
  });
  return [...lines.values()];
};
export const getOrderAge = (createdAt: string, now: number) => {
  const seconds = Math.max(
    0,
    Math.floor((now - new Date(createdAt).getTime()) / 1000),
  );
  const minutes = Math.floor(seconds / 60);
  return {
    label: minutes < 1 ? "1分未満" : `${minutes}分経過`,
    level: minutes >= 10 ? "late" : minutes >= 5 ? "waiting" : "normal",
    isNew: seconds < 30,
  };
};

/** Elapsed time since the order was placed, as mm:ss (with hours once past one hour). */
export const formatElapsed = (createdAt: string, now: number) => {
  const total = Math.max(0, Math.floor((now - Date.parse(createdAt)) / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const value = [minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
  return hours ? `${String(hours).padStart(2, "0")}:${value}` : value;
};

export const elapsedTone = (createdAt: string, now: number) => {
  const total = Math.max(0, Math.floor((now - Date.parse(createdAt)) / 1000));
  if (total >= 900) return "critical";
  if (total >= 600) return "late";
  if (total >= 300) return "waiting";
  return "normal";
};

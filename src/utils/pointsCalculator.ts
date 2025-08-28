// src/utils/pointsCalculator.ts
export function calculatePoints(type: string, quantity: number): number {
  const rates: Record<string, number> = {
    plastic: 5,     // بلاستيك
    paper: 3,       // ورق
    metal: 8,       // معادن
    glass: 6,       // زجاج
    organic: 2,     // عضوي
    electronics: 15 // إلكترونيات
  };

  const rate = rates[type] || 0;
  return quantity * rate;
}

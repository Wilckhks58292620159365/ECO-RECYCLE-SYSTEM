// backend/src/seeds/locations.ts
import PickupLocation from "../models/PickupLocation";

const uaeLocations = [
  // دبي
  { nameAr: "دبي - مردف", nameEn: "Dubai - Mirdif", lat: 25.2191, lng: 55.4103 },
  { nameAr: "دبي - المارينا", nameEn: "Dubai - Marina", lat: 25.0803, lng: 55.1400 },
  // أبوظبي
  { nameAr: "أبوظبي - الكورنيش", nameEn: "Abu Dhabi - Corniche", lat: 24.4814, lng: 54.3508 },
  // الشارقة
  { nameAr: "الشارقة - النهدة", nameEn: "Sharjah - Al Nahda", lat: 25.3085, lng: 55.3725 },
  // عجمان
  { nameAr: "عجمان - الجرف", nameEn: "Ajman - Al Jurf", lat: 25.4171, lng: 55.5136 },
  // أم القيوين
  { nameAr: "أم القيوين - المدينة", nameEn: "Umm Al Quwain - City", lat: 25.5630, lng: 55.5761 },
  // رأس الخيمة
  { nameAr: "رأس الخيمة - النخيل", nameEn: "Ras Al Khaimah - Al Nakheel", lat: 25.7895, lng: 55.9432 },
  // الفجيرة
  { nameAr: "الفجيرة - المدينة", nameEn: "Fujairah - City", lat: 25.1236, lng: 56.3269 }
];

(async () => {
  await PickupLocation.sync();
  for (const loc of uaeLocations) {
    const exists = await PickupLocation.findOne({ where: { nameEn: loc.nameEn } });
    if (!exists) {
      await PickupLocation.create(loc as any);
      console.log(`✅ Seeded: ${loc.nameEn}`);
    } else {
      console.log(`ℹ️ Exists: ${loc.nameEn}`);
    }
  }
  process.exit(0);
})();

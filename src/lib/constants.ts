// หมวดหมู่สินค้าทั้งหมดที่ใช้ในระบบ
export const CATEGORIES = [
  "อิเล็กทรอนิกส์",
  "เครื่องใช้ไฟฟ้า",
  "อาหารและเครื่องดื่ม",
  "เครื่องเขียน",
  "ของใช้ในบ้าน",
  "เสื้อผ้า",
  "อื่นๆ",
] as const;

export type Category = (typeof CATEGORIES)[number];

// จำนวนสินค้าต่อหน้าสำหรับการแบ่งหน้า (Pagination)
export const PAGE_SIZE = 10;

// เกณฑ์จำนวนสินค้าคงเหลือที่ถือว่า "ใกล้หมด" (Low Stock)
export const LOW_STOCK_THRESHOLD = 5;

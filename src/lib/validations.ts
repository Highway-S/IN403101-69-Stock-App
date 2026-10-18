import { z } from "zod";

// สคีมาสำหรับตรวจสอบข้อมูลสินค้า (Product Schema)
export const productSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อสินค้า"),
  sku: z.string().min(1, "กรุณากรอก SKU").max(50, "SKU ต้องไม่เกิน 50 ตัวอักษร"),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  price: z.number({ invalid_type_error: "กรุณากรอกราคาเป็นตัวเลข" }).positive("ราคาต้องมากกว่า 0"),
  quantity: z.number({ invalid_type_error: "กรุณากรอกจำนวนเป็นตัวเลข" }).int("จำนวนต้องเป็นจำนวนเต็ม").min(0, "จำนวนต้องไม่ติดลบ"),
  unit: z.string().min(1, "กรุณากรอกหน่วยสินค้า"),
  description: z.string().optional().default(""),
});

export type ProductInput = z.infer<typeof productSchema>;

// สคีมาสำหรับการลงทะเบียนผู้ใช้ใหม่ (Register Schema)
export const registerSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// สคีมาสำหรับการเข้าสู่ระบบ (Login Schema)
export const loginSchema = z.object({
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export type LoginInput = z.infer<typeof loginSchema>;

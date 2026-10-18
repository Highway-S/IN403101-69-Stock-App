// หน้าแรกของระบบ - ทำการ redirect ผู้ใช้งานไปยังหน้ารายการสินค้า (/products) โดยอัตโนมัติ
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/products");
}

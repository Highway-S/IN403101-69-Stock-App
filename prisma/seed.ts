import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// สร้างอินสแตนซ์ของ Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 เริ่มต้นการ Seed ข้อมูลจำลอง...");

  // แฮชรหัสผ่านสำหรับผู้ใช้เริ่มต้น
  const defaultPassword = await bcrypt.hash("password123", 10);

  // 1. สร้างบัญชี Admin (สิทธิ์ผู้ดูแลระบบ)
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      name: "Admin",
      role: "ADMIN",
    },
    create: {
      name: "Admin",
      email: "admin@example.com",
      password: defaultPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ ผู้ใช้ Admin: ${adminUser.email} (Role: ${adminUser.role})`);

  // 2. สร้างบัญชี User ทั่วไป
  const regularUser = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {
      name: "User",
      role: "USER",
    },
    create: {
      name: "User",
      email: "user@example.com",
      password: defaultPassword,
      role: "USER",
    },
  });
  console.log(`✅ ผู้ใช้ทั่วไป: ${regularUser.email} (Role: ${regularUser.role})`);

  // 3. ข้อมูลจำลองสินค้าไทย 20 รายการ ครบทุกหมวดหมู่
  // มีทั้งสินค้าสต็อกปกติ, สต็อกใกล้หมด (1-5 ชิ้น), และสินค้าหมดสต็อก (0 ชิ้น)
  const sampleProducts = [
    // หมวด: อิเล็กทรอนิกส์
    {
      name: "หูฟังบลูทูธไร้สาย TWS",
      sku: "ELEC-001",
      category: "อิเล็กทรอนิกส์",
      price: 890,
      quantity: 15,
      unit: "ชิ้น",
      description: "หูฟัง TWS รองรับบลูทูธ 5.3 ตัดเสียงรบกวน ไมค์ชัด แบตเตอรี่อึด ใช้งานได้ 6 ชม.",
    },
    {
      name: "แบตเตอรี่สำรอง 20,000 mAh Fast Charge",
      sku: "ELEC-002",
      category: "อิเล็กทรอนิกส์",
      price: 590,
      quantity: 3, // สต็อกใกล้หมด
      unit: "เครื่อง",
      description: "พาวเวอร์แบงก์ชาร์จเร็ว PD 20W และ QC 3.0 พกพาสะดวก ขึ้นเครื่องบินได้",
    },
    {
      name: "สายชาร์จ Type-C to Lightning 1 เมตร",
      sku: "ELEC-003",
      category: "อิเล็กทรอนิกส์",
      price: 199,
      quantity: 0, // สินค้าหมด
      unit: "เส้น",
      description: "สายชาร์จและถ่ายโอนข้อมูลความเร็วสูง หุ้มสายถักไนลอนแข็งแรงทนทาน",
    },

    // หมวด: เครื่องใช้ไฟฟ้า
    {
      name: "พัดลมตั้งโต๊ะ 16 นิ้ว ปรับแรงลม 3 ระดับ",
      sku: "APPL-001",
      category: "เครื่องใช้ไฟฟ้า",
      price: 650,
      quantity: 8,
      unit: "เครื่อง",
      description: "พัดลมตั้งโต๊ะ ดีไซน์ทันสมัย มอเตอร์ทองแดงแท้ ประหยัดไฟเบอร์ 5",
    },
    {
      name: "กาต้มน้ำไฟฟ้าร้อนเร็ว 1.8 ลิตร สแตนเลส",
      sku: "APPL-002",
      category: "เครื่องใช้ไฟฟ้า",
      price: 350,
      quantity: 2, // สต็อกใกล้หมด
      unit: "เครื่อง",
      description: "กาต้มน้ำสแตนเลสสตีล 304 ตัดไฟอัตโนมัติเมื่อน้ำเดือด ปลอดภัยทุกการใช้งาน",
    },
    {
      name: "หม้อหุงข้าวดิจิตอล 1.8 ลิตร อเนกประสงค์",
      sku: "APPL-003",
      category: "เครื่องใช้ไฟฟ้า",
      price: 1290,
      quantity: 12,
      unit: "เครื่อง",
      description: "หม้อหุงข้าวสารพัดประโยชน์ หุงข้าวสวย ข้าวต้ม ซุป นึ่งอาหาร เคลือบสารกันติด",
    },

    // หมวด: อาหารและเครื่องดื่ม
    {
      name: "ข้าวหอมมะลิแท้ 100% คัดพิเศษ 5 กก.",
      sku: "FOOD-001",
      category: "อาหารและเครื่องดื่ม",
      price: 215,
      quantity: 25,
      unit: "ถุง",
      description: "ข้าวหอมมะลิใหม่ต้นฤดูจากทุ่งกุลาร้องไห้ เหนียวนุ่ม กลิ่นหอมใบเตยธรรมชาติ",
    },
    {
      name: "กาแฟดริปอาราบิก้าแท้ ดอยช้าง (กล่อง 10 ซอง)",
      sku: "FOOD-002",
      category: "อาหารและเครื่องดื่ม",
      price: 180,
      quantity: 4, // สต็อกใกล้หมด
      unit: "กล่อง",
      description: "กาแฟคั่วบดดอยช้าง เกรดพรีเมียม กลิ่นหอมเข้มข้น รสชาตินุ่มละมุน ชงง่าย",
    },
    {
      name: "นมถั่วเหลืองยูเอชที สูตรดั้งเดิม 250 มล. (แพ็ค 6)",
      sku: "FOOD-003",
      category: "อาหารและเครื่องดื่ม",
      price: 65,
      quantity: 0, // สินค้าหมด
      unit: "แพ็ค",
      description: "นมถั่วเหลืองคั้นสด ไม่ผสมนมผง โปรตีนสูง ไม่มีคอเลสเตอรอล",
    },
    {
      name: "ชาเขียวใบชาแท้คัดยอด 100 กรัม",
      sku: "FOOD-004",
      category: "อาหารและเครื่องดื่ม",
      price: 120,
      quantity: 30,
      unit: "ซอง",
      description: "ใบชาเขียวอบแห้งจากยอดดอยแม่สลอง ชงดื่มสดชื่น อุดมด้วยสารต้านอนุมูลอิสระ",
    },

    // หมวด: เครื่องเขียน
    {
      name: "ปากกาเจลหมึกน้ำเงิน 0.5 มม. (กล่อง 12 ด้าม)",
      sku: "STAT-001",
      category: "เครื่องเขียน",
      price: 150,
      quantity: 50,
      unit: "กล่อง",
      description: "ปากกาหมึกเจลเขียนลื่น ลายเส้นคมชัด หมึกแห้งไว ไม่เลอะมือ",
    },
    {
      name: "สมุดบันทึกริมลวด A5 กระดาษถนอมสายตา",
      sku: "STAT-002",
      category: "เครื่องเขียน",
      price: 45,
      quantity: 1, // สต็อกใกล้หมด
      unit: "เล่ม",
      description: "สมุดบันทึกปกแข็ง สันห่วงริมลวด กระดาษถนอมสายตา 80 แกรม จำนวน 70 แผ่น",
    },
    {
      name: "ชุดดินสอกด 0.5 มม. พร้อมไส้ดินสอ 2B",
      sku: "STAT-003",
      category: "เครื่องเขียน",
      price: 85,
      quantity: 20,
      unit: "ชุด",
      description: "ดินสอกดจับถนัดมือ ยางจับนุ่ม พร้อมไส้ดินสอ 2B ความเข้มมาตรฐาน 40 ไส้",
    },

    // หมวด: ของใช้ในบ้าน
    {
      name: "น้ำยาซักผ้าสูตรเข้มข้น กลิ่นฟลอรัล 700 มล.",
      sku: "HOME-001",
      category: "ของใช้ในบ้าน",
      price: 89,
      quantity: 40,
      unit: "ถุง",
      description: "ผลิตภัณฑ์ซักผ้าสูตรเข้มข้น ขจัดคราบฝังแน่น กลิ่นหอมติดทนนาน ไม่อับชื้น",
    },
    {
      name: "กระดาษชำระม้วนหนา 3 ชั้น (แพ็ค 24 ม้วน)",
      sku: "HOME-002",
      category: "ของใช้ในบ้าน",
      price: 199,
      quantity: 5, // สต็อกใกล้หมด
      unit: "แพ็ค",
      description: "ทิชชู่ม้วนหนา 3 ชั้น เนื้อสัมผัสนุ่มเหนียว ไม่เปื่อยยุ่ยง่าย ซึมซับดี",
    },
    {
      name: "กล่องเก็บของพลาสติกฝาล็อก 50 ลิตร มีล้อเลื่อน",
      sku: "HOME-003",
      category: "ของใช้ในบ้าน",
      price: 299,
      quantity: 0, // สินค้าหมด
      unit: "ใบ",
      description: "กล่องอเนกประสงค์พลาสติกหนาเกรด A ฝาล็อกแน่นหนา ป้องกันฝุ่นและความชื้น",
    },

    // หมวด: เสื้อผ้า
    {
      name: "เสื้อยืดคอกลมผ้าฝ้ายแท้ Cotton 100% สีขาว",
      sku: "CLOTH-001",
      category: "เสื้อผ้า",
      price: 190,
      quantity: 35,
      unit: "ตัว",
      description: "เสื้อยืดเบสิกใส่สบาย ระบายอากาศดีเยี่ยม ทรงสวย ใส่ได้ทั้งชายและหญิง",
    },
    {
      name: "กางเกงขาสั้นลำลองผ้ายืด มีเชือกผูก",
      sku: "CLOTH-002",
      category: "เสื้อผ้า",
      price: 250,
      quantity: 4, // สต็อกใกล้หมด
      unit: "ตัว",
      description: "กางเกงขาสั้นสไตล์มินิมอล ผ้านิ่มยืดหยุ่น กระเป๋าข้างลึก สวมใส่สบายทุกวัน",
    },
    {
      name: "ถุงเท้าข้อสั้นคอตตอนสปอร์ต (แพ็ค 5 คู่)",
      sku: "CLOTH-003",
      category: "เสื้อผ้า",
      price: 99,
      quantity: 18,
      unit: "แพ็ค",
      description: "ถุงเท้าข้อสั้นผ้านุ่ม กระชับข้อเท้า ระบายอากาศได้ดี ลดการสะสมของกลิ่น",
    },

    // หมวด: อื่นๆ
    {
      name: "ร่มพับ 3 ตอน ออโต้ กันแดด UV และกันฝน",
      sku: "MISC-001",
      category: "อื่นๆ",
      price: 159,
      quantity: 10,
      unit: "คัน",
      description: "ร่มพับปุ่มกดเปิด-ปิดอัตโนมัติ เคลือบสารป้องกันรังสี UV 50+ โครงสร้างทนทานต้านลม",
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: product,
      create: product,
    });
  }

  console.log(`✅ Seed สินค้าตัวอย่างครบเรียบร้อยแล้ว ทั้งหมด ${sampleProducts.length} รายการ`);
}

main()
  .catch((e) => {
    console.error("❌ เกิดข้อผิดพลาดในการ Seed ข้อมูล:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

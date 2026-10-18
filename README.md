# 📦 ระบบจัดการสต็อกสินค้า (Small Shop Stock Management System)

ระบบจัดการสต็อกสินค้าสำหรับร้านค้าขนาดเล็ก พัฒนาด้วย **Next.js (App Router) + TypeScript**, **Prisma + SQLite**, **Auth.js (NextAuth v5)**, **Tailwind CSS** และตรวจสอบความถูกต้องของข้อมูลด้วย **Zod**

---

## 🌟 จุดเด่นและระบบสิทธิ์การใช้งาน (Role-Based Access Control)

ระบบออกแบบการจำกัดสิทธิ์ทั้งฝั่งหน้าบ้าน (UI Components) และฝั่งหลังบ้าน (API Protection):

### 🛡️ 1. สิทธิ์ ADMIN (ผู้ดูแลระบบ)
- **การจัดการสินค้า (CRUD):** เพิ่ม (Create), ดู (Read), แก้ไข (Update) และลบ (Delete) ข้อมูลสินค้าได้ทั้งหมด
- **การมองเห็นข้อมูลสต็อก:** มองเห็นจำนวนคงเหลือจริง (`quantity`) พร้อมหน่วยนับ (`unit`)
- **การแจ้งเตือนสต็อก:** 
  - 🔴 ป้ายเตือนสีแดง เมื่อสินค้าหมดสต็อก (`quantity = 0`)
  - ⚠️ ป้ายเตือนสีส้ม เมื่อสินค้าใกล้หมดสต็อก (`quantity 1 - 5`)
- **การกรองข้อมูลพิเศษ:** มีตัวเลือกตัวกรอง **"ใกล้หมด (Low Stock)"** เพิ่มเติมในแถบค้นหา

### 👤 2. สิทธิ์ USER (ผู้ใช้งานทั่วไป / พนักงานขาย)
- **การจัดการสินค้า:** สามารถดูรายการสินค้าและค้นหา/กรองข้อมูลได้อย่างเดียว (Read-only)
- **การมองเห็นข้อมูลสต็อก:** เห็นเพียงสถานะ **"มีของ"** (สีเขียว) หรือ **"หมดของ"** (สีแดง)
- **การป้องกันข้อมูลฝั่ง API:** API จะตัดฟิลด์ `quantity` ออกทันที และส่งเพียง boolean `inStock` ให้เท่านั้น ไม่สามารถแอบดูจำนวนคงเหลือได้

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

| ส่วนประกอบ | เทคโนโลยี |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database & ORM** | SQLite + Prisma ORM 6 |
| **Authentication** | Auth.js (NextAuth v5 beta) + Credentials (bcryptjs) & GitHub OAuth |
| **Data Validation** | Zod 3 (ตรวจสอบทั้งฝั่งฟอร์ม UI และ Route Handler API) |

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
stock-app/
├── prisma/
│   ├── schema.prisma          # Prisma Schema (User, Account, Session, Product)
│   └── seed.ts                # สคริปต์สร้างข้อมูลจำลอง (Admin, User, สินค้า 20 รายการ)
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/         # หน้าเข้าสู่ระบบ (Credentials + GitHub)
│   │   │   └── register/      # หน้าสมัครสมาชิก (Auto-login)
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts  # จัดการ Authentication Route
│   │   │   ├── products/
│   │   │   │   ├── route.ts                 # GET (List + Filter), POST (Admin)
│   │   │   │   └── [id]/route.ts            # GET (Detail), PUT (Admin), DELETE (Admin)
│   │   │   └── register/route.ts            # POST สมัครสมาชิก
│   │   ├── products/
│   │   │   ├── page.tsx       # หน้ารายการสินค้า ค้นหา กรอง แบ่งหน้า
│   │   │   ├── new/page.tsx   # หน้าเพิ่มสินค้าใหม่ (Admin Only)
│   │   │   └── [id]/edit/page.tsx # หน้าแก้ไขสินค้า (Admin Only)
│   │   ├── globals.css        # Tailwind CSS Directives
│   │   ├── layout.tsx         # Root Layout พร้อม Navbar และ Providers
│   │   └── page.tsx           # Redirect ไปที่ /products
│   ├── components/
│   │   ├── DeleteButton.tsx   # ปุ่มลบสินค้าพร้อม Modal ยืนยัน
│   │   ├── Navbar.tsx         # แถบเมนูด้านบน พร้อมแสดงบทบาท (Role Badge)
│   │   ├── Pagination.tsx     # คอมโพเนนต์แบ่งหน้า
│   │   ├── ProductForm.tsx    # แบบฟอร์มเพิ่ม/แก้ไขสินค้า พร้อม Zod Validation
│   │   ├── ProductTable.tsx   # ตารางแสดงข้อมูลสินค้า แยกการแสดงผลตามสิทธิ์
│   │   ├── Providers.tsx      # NextAuth SessionProvider Wrapper
│   │   ├── SearchFilterBar.tsx# ช่องค้นหา (ชื่อ/SKU) + ตัวกรองหมวดหมู่และสถานะ
│   │   └── StockBadge.tsx     # ป้ายแสดงสถานะสต็อก (แยกตาม Role)
│   ├── lib/
│   │   ├── auth.ts            # คอนฟิก NextAuth v5 + JWT Callbacks
│   │   ├── constants.ts       # หมวดหมู่สินค้า, PAGE_SIZE, LOW_STOCK_THRESHOLD
│   │   ├── prisma.ts          # Prisma Client Singleton Instance
│   │   └── validations.ts     # Zod Schemas (Product, Register, Login)
│   ├── middleware.ts          # ตรวจสอบสิทธิ์และป้องกันเส้นทาง (Protected Routes)
│   └── types/
│       ├── next-auth.d.ts     # Type Augmentation ขยาย Session & User เพิ่ม role
│       └── product.ts         # Types สำหรับ Product, API Response, Pagination
├── .env                       # ตัวแปรสภาพแวดล้อม (Database, Auth Secret)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 ขั้นตอนการติดตั้งและเริ่มต้นใช้งาน (Installation & Setup)

### 1. เข้าสู่โฟลเดอร์โปรเจกต์
```bash
cd "stock-app"
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตรวจสอบไฟล์ `.env`
ไฟล์ `.env` มีการตั้งค่าเริ่มต้นสำหรับ SQLite ดังนี้:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="super-secret-key-change-in-production-12345"
AUTH_TRUST_HOST=true
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```
*(หากต้องการใช้งาน GitHub Login ให้กรอก `GITHUB_CLIENT_ID` และ `GITHUB_CLIENT_SECRET` ที่ได้จาก GitHub Developer Settings)*

### 4. ซิงค์ฐานข้อมูลและสร้างข้อมูลเริ่มต้น (Database Migration & Seed)
```bash
# ซิงค์ตารางฐานข้อมูล SQLite
npm run db:push

# เพิ่มข้อมูลบัญชีผู้ใช้เริ่มต้นและสินค้าจำลอง 20 รายการ
npm run db:seed
```

### 5. บัญชีผู้ใช้งานเริ่มต้นสำหรับทดสอบ (Seed Accounts)

| บทบาท (Role) | อีเมล (Email) | รหัสผ่าน (Password) | สิทธิ์ที่ได้รับ |
|---|---|---|---|
| **ADMIN** | `admin@example.com` | `password123` | จัดการสินค้าได้ทั้งหมด (CRUD), เห็นจำนวนสต็อกจริง, ตัวกรองใกล้หมด |
| **USER** | `user@example.com` | `password123` | ดูสินค้าได้อย่างเดียว (Read-only), เห็นสถานะ มีของ/หมด |

### 6. เริ่มต้นเซิร์ฟเวอร์สำหรับพัฒนา (Development Server)
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่: **http://localhost:3000** ระบบจะนำทางไปยังหน้าเข้าสู่ระบบอัตโนมัติ

---

## 💡 วิธีการใช้งานระบบ

1. **เข้าสู่ระบบ:**
   - ใช้บัญชี **Admin** หรือ **User** ตามตารางด้านบน
   - หรือกดปุ่ม "สมัครสมาชิก" เพื่อสร้างบัญชีใหม่ (บัญชีใหม่จะได้รับสิทธิ์ `USER` โดยอัตโนมัติ)
2. **การค้นหาและกรองข้อมูล:**
   - ค้นหาได้ทั้ง **ชื่อสินค้า** หรือ **รหัส SKU**
   - กรองตาม **หมวดหมู่**: อิเล็กทรอนิกส์, เครื่องใช้ไฟฟ้า, อาหารและเครื่องดื่ม, เครื่องเขียน, ของใช้ในบ้าน, เสื้อผ้า, อื่นๆ
   - กรองตาม **สถานะสต็อก**: มีของ, หมดของ (และ *ใกล้หมด* เฉพาะผู้ดูแลระบบ)
3. **การจัดการสินค้า (เฉพาะ Admin):**
   - กดปุ่ม **"➕ เพิ่มสินค้าใหม่"** ที่แถบเมนูด้านบนหรือหัวตาราง
   - มีการตรวจสอบข้อมูล (Validation) ทันที: SKU ซ้ำไม่ได้, ราคาและจำนวนห้ามติดลบ
   - กดปุ่ม **"✏️ แก้ไข"** หรือ **"🗑️ ลบ"** สินค้าได้จากตาราง

---

## 📡 ตัวอย่างการเรียกใช้งาน API (cURL Examples)

API ทั้งหมดได้รับการปกป้องด้วย Session Cookie จาก NextAuth

### 1. เข้าสู่ระบบเพื่อรับ Session Cookie
```bash
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=admin@example.com&password=password123" \
  -c cookies.txt
```

---

### 2. ดึงรายการสินค้า (GET /api/products)
รองรับ Query Parameters:
- `search`: ค้นหาชื่อหรือ SKU
- `category`: หมวดหมู่
- `status`: `in_stock`, `out_of_stock`, หรือ `low_stock` (เฉพาะ Admin)
- `page`: หมายเลขหน้า (เริ่มต้น 1)
- `limit`: จำนวนรายการต่อหน้า (เริ่มต้น 10)

```bash
# ค้นหาคำว่า "หูฟัง" และกรองเฉพาะหมวด "อิเล็กทรอนิกส์"
curl -X GET "http://localhost:3000/api/products?search=หูฟัง&category=อิเล็กทรอนิกส์&page=1&limit=10" \
  -b cookies.txt
```

#### ตัวอย่างผลลัพธ์ (Response) เมื่อล็อกอินเป็น ADMIN:
```json
{
  "products": [
    {
      "id": "cm2...",
      "name": "หูฟังบลูทูธไร้สาย TWS",
      "sku": "ELEC-001",
      "category": "อิเล็กทรอนิกส์",
      "price": 890,
      "quantity": 15,
      "unit": "ชิ้น",
      "description": "หูฟัง TWS รองรับบลูทูธ 5.3",
      "lowStock": false,
      "createdAt": "2026-10-18T...",
      "updatedAt": "2026-10-18T..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### ตัวอย่างผลลัพธ์ (Response) เมื่อล็อกอินเป็น USER:
*(ไม่มีฟิลด์ `quantity` เพื่อความปลอดภัยของข้อมูลคลัง)*
```json
{
  "products": [
    {
      "id": "cm2...",
      "name": "หูฟังบลูทูธไร้สาย TWS",
      "sku": "ELEC-001",
      "category": "อิเล็กทรอนิกส์",
      "price": 890,
      "unit": "ชิ้น",
      "description": "หูฟัง TWS รองรับบลูทูธ 5.3",
      "inStock": true,
      "createdAt": "2026-10-18T...",
      "updatedAt": "2026-10-18T..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 3. เพิ่มสินค้าใหม่ (POST /api/products) - *เฉพาะ ADMIN*
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "คีย์บอร์ดแมคคานิคอล RGB",
    "sku": "ELEC-005",
    "category": "อิเล็กทรอนิกส์",
    "price": 1490,
    "quantity": 20,
    "unit": "ตัว",
    "description": "สวิตช์สีฟ้า สัมผัสสองจังหวะ ไฟ RGB ปรับได้ 18 โหมด"
  }'
```

---

### 4. ดึงข้อมูลสินค้ารายชิ้น (GET /api/products/:id)
```bash
curl -X GET http://localhost:3000/api/products/PRODUCT_ID_HERE \
  -b cookies.txt
```

---

### 5. แก้ไขข้อมูลสินค้า (PUT /api/products/:id) - *เฉพาะ ADMIN*
```bash
curl -X PUT http://localhost:3000/api/products/PRODUCT_ID_HERE \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "คีย์บอร์ดแมคคานิคอล RGB (ปรับปรุงใหม่)",
    "sku": "ELEC-005",
    "category": "อิเล็กทรอนิกส์",
    "price": 1390,
    "quantity": 15,
    "unit": "ตัว",
    "description": "อัปเกรดคีย์แคป PBT สัมผัสทนทานยิ่งขึ้น"
  }'
```

---

### 6. ลบสินค้า (DELETE /api/products/:id) - *เฉพาะ ADMIN*
```bash
curl -X DELETE http://localhost:3000/api/products/PRODUCT_ID_HERE \
  -b cookies.txt
```

---

### 7. ลงทะเบียนสมาชิกใหม่ (POST /api/register)
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "สมชาย ใจดี",
    "email": "somchai@example.com",
    "password": "mypassword123"
  }'
```

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { PAGE_SIZE, LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { Prisma } from "@prisma/client";

// GET /api/products - ดึงรายการสินค้าพร้อมการค้นหา กรองสถานะ และแบ่งหน้า
export async function GET(req: Request) {
  try {
    // 1. ตรวจสอบการเข้าสู่ระบบผ่าน Session
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { message: "กรุณาเข้าสู่ระบบก่อนเข้าถึงข้อมูล" },
        { status: 401 }
      );
    }

    const role = session.user.role;

    // 2. แยกพารามิเตอร์จาก URL Query String
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || String(PAGE_SIZE), 10));

    // 3. สร้างเงื่อนไข Where clause สำหรับ Prisma
    const where: Prisma.ProductWhereInput = {};

    // ค้นหาตามชื่อสินค้า หรือ SKU
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    // กรองตามหมวดหมู่สินค้า
    if (category) {
      where.category = category;
    }

    // กรองตามสถานะสต็อกสินค้า
    if (status === "in_stock") {
      where.quantity = { gt: 0 };
    } else if (status === "out_of_stock") {
      where.quantity = { equals: 0 };
    } else if (status === "low_stock") {
      // เฉพาะสิทธิ์ ADMIN เท่านั้นที่สามารถกรองดูสินค้าสต็อกใกล้หมดได้
      if (role === "ADMIN") {
        where.quantity = {
          gt: 0,
          lte: LOW_STOCK_THRESHOLD,
        };
      }
    }

    // 4. ดึงข้อมูลสินค้าและนับจำนวนทั้งหมด
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // 5. ปรับแต่งโครงสร้างข้อมูลตามสิทธิ์ของผู้ใช้งาน (Role-based filtering)
    // หากเป็น USER ทั่วไป: ซ่อนฟิลด์ quantity และเพิ่มฟิลด์ inStock (boolean)
    // หากเป็น ADMIN: แสดงฟิลด์ quantity และเพิ่ม lowStock (boolean)
    const formattedProducts = products.map((product) => {
      if (role === "ADMIN") {
        return {
          ...product,
          lowStock: product.quantity > 0 && product.quantity <= LOW_STOCK_THRESHOLD,
        };
      } else {
        const { quantity, ...productWithoutQty } = product;
        return {
          ...productWithoutQty,
          inStock: quantity > 0,
        };
      }
    });

    // 6. ส่งผลลัพธ์ข้อมูลสินค้าพร้อมข้อมูลการแบ่งหน้า
    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET /api/products Error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า" },
      { status: 500 }
    );
  }
}

// POST /api/products - เพิ่มสินค้าใหม่ลงในระบบ (เฉพาะ ADMIN เท่านั้น)
export async function POST(req: Request) {
  try {
    // 1. ตรวจสอบการเข้าสู่ระบบ
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { message: "กรุณาเข้าสู่ระบบก่อนทำรายการ" },
        { status: 401 }
      );
    }

    // 2. ตรวจสอบสิทธิ์ ต้องเป็น ADMIN เท่านั้น
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "ไม่มีสิทธิ์ดำเนินการ" },
        { status: 403 }
      );
    }

    // 3. ตรวจสอบความถูกต้องของข้อมูลผ่าน Zod productSchema
    const body = await req.json();
    const validationResult = productSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "ข้อมูลสินค้าไม่ถูกต้องตามรูปแบบ",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, sku, category, price, quantity, unit, description } = validationResult.data;

    // 4. ตรวจสอบความไม่ซ้ำกันของรหัส SKU
    const existingSku = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingSku) {
      return NextResponse.json(
        { message: "รหัส SKU นี้มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น" },
        { status: 400 }
      );
    }

    // 5. บันทึกสินค้าใหม่ลงในฐานข้อมูล
    const newProduct = await prisma.product.create({
      data: {
        name,
        sku,
        category,
        price,
        quantity,
        unit,
        description: description || "",
      },
    });

    // 6. ส่งคืนข้อมูลสินค้าที่สร้างใหม่ พร้อมสถานะ 201 Created
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST /api/products Error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการบันทึกข้อมูลสินค้า" },
      { status: 500 }
    );
  }
}

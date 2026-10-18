import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";

// GET /api/products/[id] - ดึงข้อมูลสินค้ารายชิ้นตาม ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. ตรวจสอบการเข้าสู่ระบบ
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { message: "กรุณาเข้าสู่ระบบก่อนเข้าถึงข้อมูล" },
        { status: 401 }
      );
    }

    const role = session.user.role;
    const { id } = params;

    // 2. ค้นหาข้อมูลสินค้าตาม ID
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลสินค้าที่ต้องการ" },
        { status: 404 }
      );
    }

    // 3. กรองและปรับแต่งข้อมูลตามสิทธิ์ (Role-based filtering)
    if (role === "ADMIN") {
      return NextResponse.json({
        ...product,
        lowStock: product.quantity > 0 && product.quantity <= LOW_STOCK_THRESHOLD,
      });
    } else {
      const { quantity, ...productWithoutQty } = product;
      return NextResponse.json({
        ...productWithoutQty,
        inStock: quantity > 0,
      });
    }
  } catch (error) {
    console.error("GET /api/products/[id] Error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - อัปเดตข้อมูลสินค้าตาม ID (เฉพาะ ADMIN เท่านั้น)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // 3. ตรวจสอบว่ามีสินค้านี้อยู่ในระบบหรือไม่
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลสินค้าที่ต้องการแก้ไข" },
        { status: 404 }
      );
    }

    // 4. ตรวจสอบความถูกต้องของข้อมูลผ่าน Zod productSchema
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

    // 5. ตรวจสอบว่ารหัส SKU ซ้ำกับสินค้าชิ้นอื่นหรือไม่ (ยกเว้นชิ้นปัจจุบัน)
    const duplicateSku = await prisma.product.findUnique({
      where: { sku },
    });

    if (duplicateSku && duplicateSku.id !== id) {
      return NextResponse.json(
        { message: "รหัส SKU นี้ถูกใช้งานโดยสินค้าอื่นแล้ว" },
        { status: 400 }
      );
    }

    // 6. ดำเนินการอัปเดตข้อมูลสินค้าในฐานข้อมูล
    const updatedProduct = await prisma.product.update({
      where: { id },
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

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("PUT /api/products/[id] Error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการแก้ไขข้อมูลสินค้า" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - ลบสินค้าตาม ID (เฉพาะ ADMIN เท่านั้น)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // 3. ตรวจสอบว่ามีสินค้านี้อยู่ในระบบหรือไม่
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลสินค้าที่ต้องการลบ" },
        { status: 404 }
      );
    }

    // 4. ลบสินค้าออกจากฐานข้อมูล
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "ลบสินค้าสำเร็จ" });
  } catch (error) {
    console.error("DELETE /api/products/[id] Error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการลบสินค้า" },
      { status: 500 }
    );
  }
}

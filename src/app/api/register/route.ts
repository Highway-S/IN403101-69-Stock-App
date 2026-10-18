import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

// POST /api/register - เส้นทาง API สำหรับการลงทะเบียนผู้ใช้งานใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. ตรวจสอบความถูกต้องของข้อมูลด้วย Zod registerSchema
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "ข้อมูลไม่ถูกต้องตามรูปแบบที่กำหนด",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // 2. ตรวจสอบว่ามีอีเมลนี้ลงทะเบียนไว้ในระบบแล้วหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "อีเมลนี้ถูกใช้งานแล้วในระบบ กรุณาใช้อีเมลอื่น" },
        { status: 400 }
      );
    }

    // 3. แฮชรหัสผ่านด้วย bcryptjs เพื่อความปลอดภัย
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. บันทึกข้อมูลผู้ใช้ใหม่ลงฐานข้อมูล (กำหนด role เริ่มต้นเป็น USER)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // 5. ส่งผลลัพธ์ตอบกลับสถานะ 201 พร้อมข้อมูลผู้ใช้ที่สร้างใหม่
    return NextResponse.json(
      {
        message: "ลงทะเบียนสมาชิกสำเร็จเรียบร้อยแล้ว",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}

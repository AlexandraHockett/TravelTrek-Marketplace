// ===================================================================
// 📁 app/api/auth/google-signup/route.ts
// Location: CRIAR este novo ficheiro
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import { userQueries } from "@/lib/db/queries";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, image, role } = body;

    // ✅ Validação
    if (!email || !name || !role) {
      return NextResponse.json(
        {
          success: false,
          error: "Email, name, and role are required",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    // ✅ Verificar se user já existe
    const existingUser = await userQueries.getByEmail(email);
    if (existingUser) {
      // Se já existe, apenas atualizar role se necessário
      if (existingUser.role !== role) {
        const updatedUser = await userQueries.update(existingUser.id, { role });
        return NextResponse.json({
          success: true,
          message: "User role updated",
          data: { ...updatedUser, password: undefined },
        });
      }

      return NextResponse.json({
        success: true,
        message: "User already exists",
        data: { ...existingUser, password: undefined },
      });
    }

    // ✅ Criar novo user para Google signup
    const newUser = await userQueries.create({
      name,
      email,
      avatar: image || null,
      role: role as "customer" | "host",
      emailVerified: true, // Google emails são sempre verificados
      password: null, // OAuth user
    });

    console.log(`🆕 Google signup - User created: ${email} as ${role}`);

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      data: { ...newUser, password: undefined },
    });
  } catch (error: any) {
    console.error("Google signup error:", error);

    // Handle duplicate email error
    if (error.code === "23505") {
      return NextResponse.json(
        {
          success: false,
          error: "User with this email already exists",
          code: "USER_EXISTS",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create user",
        code: "CREATE_USER_ERROR",
      },
      { status: 500 }
    );
  }
}

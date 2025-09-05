// ===================================================================
// 📁 app/api/auth/prepare-google-signup/route.ts
// Location: CRIAR este ficheiro em app/api/auth/prepare-google-signup/route.ts
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role } = body;

    // ✅ Validação do role
    if (!role) {
      return NextResponse.json(
        {
          success: false,
          error: "Role is required",
        },
        { status: 400 }
      );
    }

    // ✅ Validação se role é válido
    const validRoles = ["customer", "host", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid role. Must be customer, host, or admin",
        },
        { status: 400 }
      );
    }

    // ✅ Gerar token único para este signup
    const signupToken = randomBytes(32).toString("hex");

    // ✅ Criar resposta com cookies seguros
    const response = NextResponse.json({
      success: true,
      token: signupToken,
      message: "Google signup prepared successfully",
      role: role,
      timestamp: new Date().toISOString(),
    });

    // ✅ Definir cookies seguros com token e role
    response.cookies.set("google_signup_token", signupToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5, // 5 minutos
      path: "/",
    });

    response.cookies.set("google_signup_role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5, // 5 minutos
      path: "/",
    });

    console.log(
      `✅ Google signup prepared - Token: ${signupToken}, Role: ${role}`
    );

    return response;
  } catch (error: any) {
    console.error("❌ Error preparing Google signup:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// ✅ Não permitir outros métodos HTTP
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed. Use POST.",
    },
    { status: 405 }
  );
}

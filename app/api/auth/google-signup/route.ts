import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { success: false, error: "Role is required" },
        { status: 400 }
      );
    }

    // Gerar token único para este signup
    const signupToken = randomBytes(32).toString("hex");

    // Guardar token e role em cookies (mais seguro que sessionStorage)
    const response = NextResponse.json({
      success: true,
      token: signupToken,
      message: "Signup prepared",
    });

    // Definir cookies seguros
    response.cookies.set("google_signup_token", signupToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5, // 5 minutos
    });

    response.cookies.set("google_signup_role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5, // 5 minutos
    });

    console.log(
      `✅ Signup prepared with token: ${signupToken} and role: ${role}`
    );

    return response;
  } catch (error: any) {
    console.error("Error preparing signup:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

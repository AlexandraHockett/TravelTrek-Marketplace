// ===================================================================
// 📁 app/api/users/route.ts
// Location: ⚠️ CRÍTICO - CRIAR EXACTAMENTE EM: app/api/users/route.ts
// NÃO em app/[locale]/api/users/ - deve ser FORA da pasta [locale]!
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import { userQueries } from "@/lib/db/queries";
import bcrypt from "bcryptjs";

// GET - Fetch users with filters (opcional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const roleParam = searchParams.get("role");
    const role =
      roleParam && ["customer", "host", "admin"].includes(roleParam)
        ? (roleParam as "customer" | "host" | "admin")
        : undefined;

    const filters = {
      role,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
      offset: searchParams.get("offset")
        ? Number(searchParams.get("offset"))
        : 0,
      search: searchParams.get("search") || undefined,
    };

    // Remove undefined values
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof typeof filters] === undefined) {
        delete filters[key as keyof typeof filters];
      }
    });

    const result = await userQueries.getAll(filters);

    return NextResponse.json({
      success: true,
      data: result.users,
      pagination: {
        total: result.total,
        limit: filters.limit || 10,
        offset: filters.offset || 0,
        hasMore: (filters.offset || 0) + (filters.limit || 10) < result.total,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
        code: "FETCH_USERS_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// ✅ POST - Create a new user (SIGNUP)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ✅ Validação básica
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and password are required",
          code: "VALIDATION_ERROR",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // ✅ Validação email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
          code: "INVALID_EMAIL",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // ✅ Validação password
    if (body.password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters long",
          code: "WEAK_PASSWORD",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // ✅ Verificar se email já existe
    const existingUser = await userQueries.getByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User with this email already exists",
          code: "EMAIL_ALREADY_EXISTS",
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    // ✅ Hash da password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    // ✅ Criar utilizador
    const newUser = await userQueries.create({
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      role: body.role || "customer", // Default para customer
      avatar: body.avatar || null,
      emailVerified: false, // Por defeito não verificado
      password: hashedPassword,
    });

    // ✅ Remove password da resposta (segurança)
    const userResponse = {
      ...newUser,
      password: undefined,
    };

    return NextResponse.json(
      {
        success: true,
        data: userResponse,
        message: "User created successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);

    // ✅ Handle database specific errors
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        {
          success: false,
          error: "User with this email already exists",
          code: "EMAIL_ALREADY_EXISTS",
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create user",
        code: "CREATE_USER_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

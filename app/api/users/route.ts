// ===================================================================
// 📁 app/api/users/route.ts
// Location: CRIAR em app/api/users/route.ts (NÃO dentro de [locale])
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import { userQueries } from "@/lib/db/queries";
import bcrypt from "bcryptjs";

// ✅ POST - Create a new user (SIGNUP)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ✅ Validação básica
    if (!body.name || !body.email || (!body.password && !body.isOAuthUser)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name, email are required. Password required for non-OAuth users.",
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

    // ✅ Validação role
    const validRoles = ["customer", "host", "admin"];
    if (!validRoles.includes(body.role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid role. Must be customer, host, or admin",
          code: "INVALID_ROLE",
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
          code: "USER_ALREADY_EXISTS",
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    // ✅ Hash password se for fornecida
    let hashedPassword = null;
    if (body.password) {
      hashedPassword = await bcrypt.hash(body.password, 10);
    }

    // ✅ Criar utilizador
    const newUser = await userQueries.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: body.role,
      avatar: body.avatar || null,
      emailVerified: body.emailVerified || false,
    });

    // ✅ Remove password from response
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
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle specific database errors
    if (error.code === "23505") {
      // PostgreSQL unique constraint violation
      return NextResponse.json(
        {
          success: false,
          error: "User with this email already exists",
          code: "USER_ALREADY_EXISTS",
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

// GET - Fetch users with filters (para admin)
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

    const result = await userQueries.getAll(filters);

    return NextResponse.json({
      success: true,
      data: result.users,
      pagination: {
        total: result.total,
        limit: filters.limit,
        offset: filters.offset,
        hasMore: filters.offset + filters.limit < result.total,
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

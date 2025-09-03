// ===================================================================
// 📁 app/api/users/route.ts
// Location: CREATE file app/api/users/route.ts
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import { userQueries } from "@/lib/db/queries";

// GET - Fetch all users with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract and validate query parameters
    const roleParam = searchParams.get("role");
    const validRoles = ["customer", "host", "admin"];
    const role =
      roleParam && validRoles.includes(roleParam)
        ? (roleParam as "customer" | "host" | "admin")
        : undefined;

    const emailVerifiedParam = searchParams.get("emailVerified");
    const emailVerified =
      emailVerifiedParam === "true"
        ? true
        : emailVerifiedParam === "false"
          ? false
          : undefined;

    const filters = {
      role,
      emailVerified,
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

    // Usar getAll expandida
    const result = await userQueries.getAll(filters);

    return NextResponse.json({
      success: true,
      data: result.users,
      pagination: {
        total: result.total,
        limit: filters.limit || 10,
        offset: filters.offset || 0,
        hasMore: (filters.offset || 0) + (filters.limit || 10) < result.total,
        currentPage:
          Math.floor((filters.offset || 0) / (filters.limit || 10)) + 1,
        totalPages: Math.ceil(result.total / (filters.limit || 10)),
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

// POST - Create a new user (complementa o create existente)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validação básica
    if (!body.name || !body.email || !body.role) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and role are required",
          code: "VALIDATION_ERROR",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Check if email already exists usando função existente
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

    // Create user usando função existente
    const newUser = await userQueries.create({
      name: body.name,
      email: body.email,
      role: body.role,
      avatar: body.avatar || null,
      emailVerified: body.emailVerified || false,
    });

    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: "User created successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
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

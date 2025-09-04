// ===================================================================
// 📁 app/api/users/route.ts
// Location: UPDATE existing app/api/users/route.ts - ADD password hashing
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import { userQueries } from "@/lib/db/queries";
import bcrypt from "bcryptjs";

// GET - Fetch users with filters (existing functionality)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const roleParam = searchParams.get("role");
    const role =
      roleParam && ["customer", "host", "admin"].includes(roleParam)
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

// POST - Create a new user with password hashing support
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
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

    // Email format validation
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

    // Password validation (if provided)
    if (body.password && body.password.length < 8) {
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

    // Check if email already exists
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

    // Hash password if provided
    let hashedPassword = null;
    if (body.password) {
      const saltRounds = 12;
      hashedPassword = await bcrypt.hash(body.password, saltRounds);
    }

    // Create user
    const newUser = await userQueries.create({
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      role: body.role,
      avatar: body.avatar || null,
      emailVerified: body.emailVerified || false,
      password: hashedPassword,
    });

    // Remove password from response
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

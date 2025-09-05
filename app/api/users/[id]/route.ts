// ===================================================================
// 📁 app/api/users/[id]/route.ts
// Location: CRIAR este ficheiro em app/api/users/[id]/route.ts
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { userQueries } from "@/lib/db/queries";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get user by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // ✅ Authentication check
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
          code: "UNAUTHORIZED",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // ✅ Authorization check - users can only access their own data (or admin can access any)
    if (session.user.id !== id && session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient permissions",
          code: "FORBIDDEN",
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    const user = await userQueries.getById(id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
          code: "USER_NOT_FOUND",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // ✅ Remove password from response
    const userResponse = {
      ...user,
      password: undefined,
    };

    return NextResponse.json({
      success: true,
      data: userResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user",
        code: "FETCH_USER_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// PATCH - Update user (role, profile, etc.)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // ✅ Authentication check
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
          code: "UNAUTHORIZED",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // ✅ Authorization check - users can only update their own data (or admin can update any)
    if (session.user.id !== id && session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient permissions",
          code: "FORBIDDEN",
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    // ✅ Validate allowed fields
    const allowedFields = ["name", "role", "avatar"];
    const updateData: any = {};

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    // ✅ Special validation for role changes
    if (updateData.role) {
      const validRoles = ["customer", "host", "admin"];
      if (!validRoles.includes(updateData.role)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid role specified",
            code: "INVALID_ROLE",
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      // ✅ Only allow role changes for the user themselves (Google auth case) or admin
      if (session.user.role !== "admin" && session.user.id !== id) {
        return NextResponse.json(
          {
            success: false,
            error: "Cannot change role for other users",
            code: "ROLE_CHANGE_FORBIDDEN",
            timestamp: new Date().toISOString(),
          },
          { status: 403 }
        );
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid fields provided for update",
          code: "NO_UPDATE_DATA",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // ✅ Update user
    const updatedUser = await userQueries.update(id, updateData);

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
          code: "USER_NOT_FOUND",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // ✅ Remove password from response
    const userResponse = {
      ...updatedUser,
      password: undefined,
    };

    return NextResponse.json({
      success: true,
      data: userResponse,
      message: "User updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update user",
        code: "UPDATE_USER_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (admin only or self-deletion)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // ✅ Authentication check
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
          code: "UNAUTHORIZED",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // ✅ Authorization check - only admin or self can delete
    if (session.user.role !== "admin" && session.user.id !== id) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient permissions",
          code: "FORBIDDEN",
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    const deletedUser = await userQueries.delete(id);

    if (!deletedUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
          code: "USER_NOT_FOUND",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete user",
        code: "DELETE_USER_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

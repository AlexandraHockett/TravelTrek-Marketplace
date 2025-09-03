// ===================================================================
// 📁 app/api/users/[id]/route.ts
// Location: CREATE file app/api/users/[id]/route.ts
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import { userQueries } from "@/lib/db/queries";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single user by ID (usa getById existente)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    return NextResponse.json({
      success: true,
      data: user,
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

// PUT - Update a user (usa update existente)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if user exists usando função existente
    const existingUser = await userQueries.getById(id);
    if (!existingUser) {
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

    // Check if email is being changed and if it already exists
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await userQueries.getByEmail(body.email);
      if (emailExists && emailExists.id !== id) {
        return NextResponse.json(
          {
            success: false,
            error: "Email already in use by another user",
            code: "EMAIL_ALREADY_EXISTS",
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );
      }
    }

    // Update user usando função existente
    const updatedUser = await userQueries.update(id, body);

    if (!updatedUser) {
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

    return NextResponse.json({
      success: true,
      data: updatedUser,
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

// DELETE - Delete a user (vou adicionar função delete às queries existentes)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if user exists
    const existingUser = await userQueries.getById(id);
    if (!existingUser) {
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

    // Soft delete user (vou adicionar função delete)
    const deleted = await userQueries.delete(id);

    if (!deleted) {
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

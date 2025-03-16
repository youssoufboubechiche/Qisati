import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret";
const COOKIE_NAME = "auth_token";

export async function registerUser(
  email: string,
  password: string,
  name?: string
) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Verify password
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error("Invalid credentials");
  }

  // Create session
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  // Create JWT
  const jwtToken = jwt.sign(
    { userId: user.id, sessionToken: token },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Return the token to be set in a cookie
  return {
    token: jwtToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

export async function logoutUser(token: string) {
  if (!token) {
    return { success: true, message: "Already logged out" };
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      sessionToken: string;
    };

    // Delete session
    await prisma.session.deleteMany({
      where: {
        token: decoded.sessionToken,
        userId: decoded.userId,
      },
    });

    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Token verification failed during logout:", error);
    return { success: true, message: "Logged out successfully" };
  }
}

export async function getUserSession(token: string) {
  if (!token) {
    return null;
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      sessionToken: string;
    };

    // Find session
    const session = await prisma.session.findFirst({
      where: {
        token: decoded.sessionToken,
        userId: decoded.userId,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    return session.user;
  } catch (error) {
    return null;
  }
}

export async function initiatePasswordReset(email: string) {
  // Find the user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal if user exists or not
    return { success: true };
  }

  // Generate reset token
  const resetToken = uuidv4();
  const resetExpires = new Date();
  resetExpires.setHours(resetExpires.getHours() + 1); // Token valid for 1 hour

  // Save token to user
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    },
  });

  // In a real app, you would send an email with the reset link
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  return { success: true, resetUrl };
}

export async function completePasswordReset(
  token: string,
  newPassword: string
) {
  // Find user with this token
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user password and clear reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  // Clear all sessions for this user for security
  await prisma.session.deleteMany({
    where: { userId: user.id },
  });

  return { success: true };
}

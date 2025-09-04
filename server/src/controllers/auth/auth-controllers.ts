import { Request, Response } from "express";
import { loginUserService, logoutUserService, refreshTokenUserService, registerUserService } from "../../services/auth/auth.service";

/**
 * POST /api/auth/register
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newUser = await registerUserService(name, email, password);

    // Có thể auto login sau register → generate token
    const { accessToken, refreshToken } = await loginUserService(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * POST /api/auth/login
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    const { user, accessToken, refreshToken } = await loginUserService(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * POST /api/auth/refresh
 */
export const refreshUser = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const { accessToken, refreshToken: newRefreshToken } = await refreshTokenUserService(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken,
    });
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
}

/**
 * POST /api/auth/logout
 */
export const logoutUser = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user?._id;

    await logoutUserService(userId, refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // chỉ bật secure khi production
      sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
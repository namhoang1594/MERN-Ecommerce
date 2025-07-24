import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../../helpers/jwt";
import { findUserByEmail, createUser } from "../../services/user.service";
import { IUser } from "../../types/user.types";


export const registerUser = async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;

  try {
    const existing = await findUserByEmail(email);
    if (existing)
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại! Vui lòng sử dụng email khác.",
      });

    const hashed = await bcrypt.hash(password, 12);
    await createUser({ userName, email, password: hashed });

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công! Vui lòng đăng nhập.",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Máy chủ đang bận! Vui lòng thử lại sau.",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không tồn tại! Vui lòng đăng ký.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu không chính xác! Vui lòng thử lại.",
      });
    }

    const token = generateToken({
      id: user._id,
      userName: user.userName,
      role: user.role,
      email: user.email,
    });

    res.cookie("token", token, { httpOnly: true }).json({
      success: true,
      message: "Đăng nhập thành công!",
      user: {
        id: user._id,
        userName: user.userName,
        role: user.role,
        email: user.email,
      },
    });
  } catch {
    res.status(500).
      json({
        success: false,
        message: "Đăng nhập thất bại! Máy chủ đang bận.",
      });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token").status(200).json({
    success: true,
    message: "Đăng xuất thành công!",
  });
};

export const checkAuth = (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Bạn chưa đăng nhập!",
    });
  }

  res.status(200).json({
    success: true,
    message: "Người dùng đã được xác thực!",
    user,
  });
}


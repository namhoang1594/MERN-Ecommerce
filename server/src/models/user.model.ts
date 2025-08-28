import { Schema, model } from "mongoose";
import { IUser, UserRole } from "../types/user.types";

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // đảm bảo không trùng email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // rule cơ bản
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product", // ref sang Product model (tạm để vậy, sau có thể thay Cart model)
      },
    ],
    refreshTokens: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true, // auto thêm createdAt, updatedAt
  }
);

const UserModel = model<IUser>("User", UserSchema);
export default UserModel;

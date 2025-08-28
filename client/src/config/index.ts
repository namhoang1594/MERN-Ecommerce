import { FormControl } from "@/types/config/index.types";


export const loginFormControls: FormControl[] = [
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "Nhập email",
    rules: [
      { type: "required", message: "Vui lòng nhập email" },
      { type: "pattern", value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email không hợp lệ" },
    ],
  },
  {
    type: "password",
    name: "password",
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    rules: [
      { type: "required", message: "Vui lòng nhập mật khẩu" },
      { type: "min", value: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
    ],
  },
];

export const registerFormControls: FormControl[] = [
  {
    type: "text",
    name: "name",
    label: "Họ và tên",
    placeholder: "Nhập họ và tên",
    rules: [{ type: "required", message: "Vui lòng nhập họ và tên" }],
  },
  ...loginFormControls,
  {
    type: "password",
    name: "confirmPassword",
    label: "Xác nhận mật khẩu",
    placeholder: "Nhập lại mật khẩu",
    rules: [
      { type: "required", message: "Vui lòng xác nhận mật khẩu" },
      { type: "match", value: "password", message: "Mật khẩu không khớp" },
    ],
  },
];

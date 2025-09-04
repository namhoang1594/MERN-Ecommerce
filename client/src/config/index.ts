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

export const userProfileFormControls: FormControl[] = [
  {
    type: "text",
    name: "name",
    label: "Họ và tên",
    placeholder: "Nhập họ và tên",
    rules: [{ type: "required", message: "Vui lòng nhập họ và tên" }],
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "Nhập email",
    rules: [
      { type: "required", message: "Vui lòng nhập email" },
      {
        type: "pattern",
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Email không hợp lệ",
      },
    ],
  },
  {
    type: "text",
    name: "phone",
    label: "Số điện thoại",
    placeholder: "Nhập số điện thoại",
    rules: [
      { type: "required", message: "Vui lòng nhập số điện thoại" },
      {
        type: "pattern",
        value: /^(0|\+84)([0-9]{9,10})$/,
        message: "Số điện thoại không hợp lệ",
      },
    ],
  },
];

export const changePasswordFormControls: FormControl[] = [
  {
    type: "password",
    name: "oldPassword",
    label: "Mật khẩu hiện tại",
    placeholder: "Nhập mật khẩu hiện tại",
    rules: [{ type: "required", message: "Vui lòng nhập mật khẩu hiện tại" }],
  },
  {
    type: "password",
    name: "newPassword",
    label: "Mật khẩu mới",
    placeholder: "Nhập mật khẩu mới",
    rules: [
      { type: "required", message: "Vui lòng nhập mật khẩu mới" },
      { type: "min", value: 6, message: "Mật khẩu ít nhất 6 ký tự" }
    ],
  },
  {
    type: "password",
    name: "confirmPassword",
    label: "Xác nhận mật khẩu mới",
    placeholder: "Nhập lại mật khẩu mới",
    rules: [
      { type: "required", message: "Vui lòng xác nhận mật khẩu" },
      { type: "match", value: "newPassword", message: "Mật khẩu không khớp" }
    ],
  }
];

export const addressFormControls: FormControl[] = [
  {
    type: "text",
    name: "fullName",
    label: "Họ và tên",
    placeholder: "Họ và tên",
    rules: [{ type: "required", message: "Vui lòng nhập họ và tên" }],
  },
  {
    type: "text",
    name: "phone",
    label: "Số điện thoại",
    placeholder: "Nhập số điện thoại",
    rules: [
      { type: "required", message: "Vui lòng nhập số điện thoại" },
      {
        type: "pattern",
        value: /^(0|\+84)([0-9]{9,10})$/,
        message: "Số điện thoại không hợp lệ",
      },
    ],
  },
  {
    type: "text",
    name: "street",
    label: "Địa chỉ chi tiết",
    placeholder: "Số nhà, đường",
    rules: [{ type: "required", message: "Vui lòng nhập địa chỉ chi tiết" }],
  },
  {
    type: "text",
    name: "ward",
    label: "Phường/Xã",
    placeholder: "Nhập phường/xã",
    rules: [{ type: "required", message: "Vui lòng nhập phường/xã" }],
  },
  {
    type: "text",
    name: "province",
    label: "Tỉnh/Thành phố",
    placeholder: "Nhập tỉnh/thành phố",
    rules: [{ type: "required", message: "Vui lòng nhập tỉnh/thành phố" }],
  },
];
import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const phoneRegex = /^(0\d{9})$/
export const signUpSchema = z.object({
    email: z.string().min(1, "Email là bắt buộc").regex(emailRegex, "Email phải là Gmail hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    user_name: z.string().min(3, "Tên đăng nhập tối thiểu 3 ký tự"),
    full_name: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().regex(phoneRegex, "Số điện thoại phải là 10 số và bắt đầu bằng 0").optional(),
    role: z.string().optional(),
})
export const signInSchema = z.object({
    email: z.string({required_error: "Vui lòng nhập email"}).email("Email không hợp lệ"),
    password: z.string().min(6,"Độ dài 6 kí tự")
})
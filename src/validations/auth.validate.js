import { z } from "zod";


export const signUpSchema = z.object({
    email: z.string({required_error: "Vui lòng nhập email"}).email("Email không hợp lệ"),
    password: z.string().min(6,"Độ dài 6 kí tự")
})
export const signInSchema = z.object({
    email: z.string({required_error: "Vui lòng nhập email"}).email("Email không hợp lệ"),
    password: z.string().min(6,"Độ dài 6 kí tự")
})
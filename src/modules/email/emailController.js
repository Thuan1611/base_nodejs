import User from "../users/users.models.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/sendMail.js";
import createError from "../../utils/createError.js";

class emailController {
  async sendEmailController(req, res) {
    try {
      const { email } = req.body;
      console.log(req.body, "reqbody");
      if (!email) {
        return createError(401, "Email không được để trống");
      }

      const subject = "Xác nhận email";
      const text = `
            Chào bạn!
            Cảm ơn bạn đã đăng ký. Đây là email xác nhận của bạn
          `;
      await sendEmail(email, subject, text);
      return res
        .status(200)
        .json({ message: "Đăng ký thành công, đã gửi email xác nhận!" });
    } catch (error) {
      return createError(401, "Email sai ròi");
    }
  }
}
export default emailController;

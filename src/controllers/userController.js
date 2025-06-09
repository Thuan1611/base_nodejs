import User from "../models/users.models.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { FRONTEND_URL, JWT_SECRET, PORT } from "../configs/enviroments.js";
import { sendEmail } from "../utils/sendMail.js";
import jwt from "jsonwebtoken";

class userControlller {
  //Đăng kí
  async signUp(req, res) {
    const { email, password, user_name, full_name, address, phone } = req.body;

    //Kiểm tra email đã tồn tại trong database chưa
    const existedEmail = await User.findOne({ email });
    console.log(existedEmail);

    if (existedEmail) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }
    //Mã hóa Password
    const hashPass = await bcrypt.hash(password, 10);
    if (!hashPass) {
      return res.status(400).json({ message: "Mật khẩu không chính xác" });
    }
    //Thêm user và database
    const user = await User.create({
      email,
      password: hashPass,
      user_name,
      full_name,
      address,
      phone,
      isVerified: false,
    });
    const token = generateToken(user);
    const link = `http://localhost:8888/api/users/verify-email?token=${token}`;
    await sendEmail(
      user.email,
      "Xác nhận email",
      `Nhấn vào link để xác nhận email: ${link}`,
      `<p>Vui lòng nhấn vào đây để xác nhận email:</p><a href="${link}">${link}</a>`
    );
    return res.status(201).json({
      message: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận",
    });
  }
  //Đăng nhập
  async signIn(req, res) {
    const { email, password } = req.body;

    //Kiểm tra user trong database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không chính xác" });
    }
    //Kiểm tra mật khẩu lúc đăng kí và mật khẩu đã được mã hóa
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res.status(400).json({ message: "Mật khẩu không chính xác" });
    }
    //Kiểm tra user đã được xác thực?
    if (!user.isVerified) {
      return res.status(400).json({ message: "Email chưa được xác thực" });
    }
    //Token
    const accessToken = generateToken(user);
    console.log(accessToken);
    //Đăng nhập
    return res.success({ user, accessToken }, "Đăng nhập thành công hehe");
  }
  //Xác thực email
  async verifyEmail(req, res) {
    //Kiểm tra token trên query params
    const { token } = req.query;
    console.log(token, "token");
    if (!token) return res.status(400).json({ message: "Thiếu token" });
    //Giải mã decode, verify dùng để giải mã token gửi lên của user.id nào
    const decoded = jwt.verify(token, JWT_SECRET);
    //Tìm kiếm user dựa trên decode verify ở trên đã được giải mã
    const user = await User.findById(decoded.id);
    //Validate: Kiểm tra tài khoản và xác thực
    if (!user) {
      return res.status(400).json({ message: "Không tìm thấy tài khoản" });
    }
    if (user.isVerified) {
      return res
        .status(200)
        .json({ message: "Tài khoản đã được xác nhận trước đó" });
    }
    user.isVerified = true;
    await user.save();
    return res.status(200).json({ message: "Xác nhận email thành công" });
  }
  async forgotPassword(req, res) {
    // 1. kiểm tra email trên postman
    // 2. Kiểm tra email trên mongogo và log thông tin email ra
    // 3. Tạo một token để làm gửi lên email và xác thực email đó
    // 4. Gửi hàm email vào để xác thực
    // 5. Trả về thành công yêu cầu mật khẩu thành công
    const { email } = req.body;
    //Kiểm tra email tồn tại trong db
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Không tìm thấy tài khoản" });
    }
    const token = generateToken(user);
    const link = `${FRONTEND_URL}/forgot-password?token=${token}`;

    await sendEmail(
      user.email,
      "Yêu cầu đặt lại mật khẩu",
      `<p>Vui lòng nhấn vào đây để xác nhận email:</p><a href="${link}">${link}</a>`
    );
    return res.status(201).json({
      message: "Reset Password! Vui lòng kiểm tra email để xác nhận",
    });
  }
  async resetPassword(req, res) {
    // 1. Kiểm tra token và mật khẩu và xác nhận mật khẩu mới
    //2. Kiểm tra mật khẩu và mật khẩu xác nhận
    //3.Kiểm tra user tồn tại trong db bằng token,
    // 4. Lưu mật khẩu mới và mã hóa
    const { token, newPassword, confirmPassword } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!token) {
      return res.status(400).json({ message: "Không tìm thấy mã xác thực" });
    }
    if (newPassword != confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu xác nhận không đúng" });
    }
    //Kiểm tra user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }
    //Mã hóa mật khẩu và lưu mật khẩu mã hóa
    const hashPass = await bcrypt.hash(confirmPassword, 10);
    user.password = hashPass;
    await user.save();
    return res.status(201).json({
      message: "Đặt lại mật khẩu thành công",
    });
  }
}

export default userControlller;

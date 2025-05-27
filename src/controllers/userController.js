import User from "../models/users.models.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

class userControlller {
  //Đăng kí
  async signUp(req, res) {
    const { email, password, user_name, full_name, address, phone } = req.body;
    console.log(req.body, "reqbody");

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
    });
    return res.success(user, "Đăng kí thành công hehe");
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
    //Token
    const accessToken = generateToken(user);
    console.log(accessToken);

    //Đăng nhập
    return res.success({ user, accessToken }, "Đăng nhập thành công hehe");
  }
}
export default userControlller;

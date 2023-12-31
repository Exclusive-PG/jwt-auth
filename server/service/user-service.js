const UserModel = require("./../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDTO = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
  async registration(email, password) {
    const isUserExists = await UserModel.findOne({ email });
    if (isUserExists) {
      throw ApiError.BadRequestError("User with this email already exists");
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.SERVICE_URL}/api/activation/${activationLink}`
    );

    const userDTO = new UserDTO(user); // id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDTO });
    console.log(userDTO);
    await tokenService.saveToken(userDTO.id, tokens.refreshToken);

    return { ...tokens, user: userDTO };
  }

  async activate(activationLink) {
    console.log(activationLink);
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequestError(`Current user does not exist`);
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequestError(
        `User with email ${email} does not register`
      );
    }

    const isPasswordEquals = await bcrypt.compare(password, user.password);

    if (!isPasswordEquals) {
      throw ApiError.BadRequestError(`Wrong password`);
    }

    const userDTO = new UserDTO(user);
    const tokens = tokenService.generateTokens({ ...userDTO });
    await tokenService.saveToken(userDTO.id, tokens.refreshToken);

    return { ...tokens, user: userDTO };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateAccessToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
     // throw ApiError.BadRequestError(refreshToken)
    }
    const user = await UserModel.findById(userData.id)
    const userDTO = new UserDTO(user); // id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDTO });
    console.log(userDTO);
    await tokenService.saveToken(userDTO.id, tokens.refreshToken);

    return { ...tokens, user: userDTO };
  }

  async getAllUsers(){
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();

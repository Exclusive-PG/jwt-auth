const UserModel = require("./../models/user-model")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const mailService = require("./mail-service")
const tokenService = require("./token-service")
const UserDTO = require("../dtos/user-dto")

class UserService{

    async registration(email, password){
        const isUserExists = await UserModel.findOne({email})
        if(isUserExists){
            throw new Error("User with this email already exists")
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4()

        const user = await UserModel.create({email, password: hashPassword, activationLink}) 
        await mailService.sendActivationMail(email, `${process.env.SERVICE_URL}/api/activation/${activationLink}`)
        
        const userDTO = new UserDTO(user)// id, email, isActivated
        const tokens = tokenService.generateTokens({...userDTO})
        console.log(userDTO)
        await tokenService.saveToken(userDTO.id, tokens.refreshToken)
        
        return {...tokens, user: userDTO}
    }

    async activate(activationLink){
        console.log(activationLink)
        const user = await UserModel.findOne({activationLink})
        if(!user){
            throw new Error(`Current user does not exist`);
        }
        user.isActivated = true
        await user.save()
    }

}

module.exports = new UserService();
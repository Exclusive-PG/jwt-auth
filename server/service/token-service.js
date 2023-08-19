const jwt = require("jsonwebtoken")
const tokenModel = require("../models/token-model")
class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {expiresIn:"10m"})
        const refreshToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {expiresIn:"1d"})
        return{
            accessToken,
            refreshToken
        }
    }
    async saveToken(userId, refreshToken){
        const tokenData = await tokenModel.findOne({user:userId})
        if(tokenData){
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await tokenModel.create({user:userId,refreshToken})
        return token
    }
    async removeToken(refreshToken){
        const tokenData = await tokenModel.deleteOne({refreshToken});
        return tokenData;
    }
}

module.exports = new TokenService();
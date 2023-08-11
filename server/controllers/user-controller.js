const userService = require("../service/user-service");

class UserController {
    async registration(req, res, next){
        try {
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
            res.cookie("refreshToken", userData.refreshToken, {maxAge:10 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.json(userData);
        }
         catch (error) {
            console.log(error.message)
        }
    }
    async login(req, res, next){
        try {
            
        } catch (error) {
            
        }
    }
    async logout(req, res, next){
        try {
            
        } catch (error) {
            
        }
    }
    async activate(req, res, next){
        try {
            
        } catch (error) {
            
        }
    }
    async refresh(req, res, next){
        try {
            
        } catch (error) {
            
        }
    }
    async getUsers(req, res, next){
        try {
            res.json(["ex","hi"])
        } catch (error) {
            
        }
    }
}

module.exports = new UserController();
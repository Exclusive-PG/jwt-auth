module.exports = class UserDTO{
    id;
    email;
    isActivated;

    constructor(model){
        this.email = model.email;
        this.id = model.id;
        this.isActivated = model.isActivated;
    }
}
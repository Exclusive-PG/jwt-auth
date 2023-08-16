const mailer = require("nodemailer")

class MailService{

    constructor(){
        this.transporter = mailer.createTransport({
            service: "gmail",
            auth:{
                user:"exclusive.dev.service@gmail.com",
                pass: "gtflzlrvxyvsziqb"
            }
        })
    }

    async sendActivationMail(to, link){

        await this.transporter.sendMail({
            from: "exclusive.dev.service@gmail.com",
            to,
            subject: `Activation account on ${process.env.SERVICE_URL}`,
            text: "",
            html:
            `
                <div>
                    <div>Activation link - <a href=${link}>${link}</a></div>
                </div>
            `
        })
    }
}

module.exports = new MailService();
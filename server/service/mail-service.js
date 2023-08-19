const mailer = require("nodemailer")

class MailService{

    constructor(){
        this.transporter = mailer.createTransport({
            service: process.env.SMTP_SERVICE,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link){

        await this.transporter.sendMail({
            from: "ExclusiveDevService",
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

import nodemailer from 'nodemailer';
const MAIL_RU_EMAIL = 'st.high@mail.ru';
const MAIL_RU_PASSWORD = 'wgEBU8anRSgtr4KVbl9x';
const onlysmpt = 'VTfzJbL4oJDuxUO5fM1A';


const transport = nodemailer.createTransport({
    host: 'smtp.mail.ru', // e.g., Gmail, Outlook, etc.
    port: 465,           // 465 — для SSL (рекомендуется)
    secure: true,        // true, если порт 465
    auth: {
        user: MAIL_RU_EMAIL, // Your email
        pass: MAIL_RU_PASSWORD   // Your email password or app-specific password
    }
});

export const nodemailerHelper = {
    async sendConfirmationEmail(email: string, code: string) {
        // const testAccount = await nodemailer.createTestAccount();
        //
        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.ethereal.email',
        //     port: 587,
        //     secure: false,
        //     auth: {
        //         user: testAccount.user,
        //         pass: testAccount.pass
        //     }
        // });


        const result = await transport.sendMail({
            from: `"My App" <${MAIL_RU_EMAIL}>`,
            //from: `"My App" <noreply@app.com>`,
            to: email,
            subject: "Подтверждение email",
            html:  `<div>
           <h1>HI MAN, YO</h1>
           <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
      </div>
`,
        });
        return result
    }
}

class NodemailerHelper{
    private transport: nodemailer.Transport;
    constructor(transport: nodemailer.Transport) {
        this.transport = transport;
    }
    async sendConfirmationEmail(email: string, code: string) {
        // const testAccount = await nodemailer.createTestAccount();
        //
        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.ethereal.email',
        //     port: 587,
        //     secure: false,
        //     auth: {
        //         user: testAccount.user,
        //         pass: testAccount.pass
        //     }
        // });


        const result = await transport.sendMail({
            from: `"My App" <${MAIL_RU_EMAIL}>`,
            //from: `"My App" <noreply@app.com>`,
            to: email,
            subject: "Подтверждение email",
            html:  `<div>
           <h1>HI MAN, YO</h1>
           <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
      </div>
`,
        });
        return result
    }

}
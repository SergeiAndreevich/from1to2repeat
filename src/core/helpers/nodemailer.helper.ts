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
    async sendConfirmationEmail(email: string) {
        await transport.sendMail({
            from: `"My App" <${MAIL_RU_EMAIL}>`,
            to: email,
            subject: "Подтверждение email",
            html: `
                <h1>Thanks for your registration</h1>
                <p>To finish registration please follow the link below:
                    <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>complete registration</a>
                </p>`,
        });
    }
}
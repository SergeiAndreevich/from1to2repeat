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
        <h2>Добро пожаловать!</h2>
        <p>Подтвердите ваш email, чтобы завершить регистрацию:</p>
        <a href="https://nodejsdev.ru/guides/webdraftt/email/">
  Подтвердить email
</a>
      `,
        });
    }
}
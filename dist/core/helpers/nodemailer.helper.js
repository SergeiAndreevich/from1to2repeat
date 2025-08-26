"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodemailerHelper = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const MAIL_RU_EMAIL = 'st.high@mail.ru';
const MAIL_RU_PASSWORD = 'wgEBU8anRSgtr4KVbl9x';
const onlysmpt = 'VTfzJbL4oJDuxUO5fM1A';
const transport = nodemailer_1.default.createTransport({
    host: 'smtp.mail.ru', // e.g., Gmail, Outlook, etc.
    port: 465, // 465 — для SSL (рекомендуется)
    secure: true, // true, если порт 465
    auth: {
        user: MAIL_RU_EMAIL, // Your email
        pass: MAIL_RU_PASSWORD // Your email password or app-specific password
    }
});
exports.nodemailerHelper = {
    sendConfirmationEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield transport.sendMail({
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
        });
    }
};

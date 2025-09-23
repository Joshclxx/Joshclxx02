import { isValidEmail } from "./validators";

export function stripAndLimit(str: string, max: number) {
    return str.trim().slice(0, max)
}

export function stripCRLF(str: string) {
    return str.replace(/[\r\n]/g, "")
}

export function escapeHtml(str: string) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&qout;")
        .replace(/'/g, "&#039;")
}


export function sanitizeContactInput({name, email, subject, message}: {name: string, email: string, subject: string, message: string}) {
    const MAX_NAME = 100;
    const MAX_EMAIL = 125;
    const MAX_SUBJECT = 50;
    const MAX_MESSAGE = 5000;

    const safeName = stripCRLF(stripAndLimit(name, MAX_NAME));
    const safeEmail = stripCRLF(stripAndLimit(email, MAX_EMAIL));
    const safeSubject = stripCRLF(stripAndLimit(subject, MAX_SUBJECT));
    const safeMessage = stripAndLimit(message, MAX_MESSAGE);

    if (!safeName || !safeEmail || !safeSubject || !safeMessage) {
        throw new Error("Missing fields");
    }

    if (!isValidEmail) {
        throw new Error("Invalid email.")
    }

    return {
        name: safeName,
        email: safeEmail,
        subject: safeSubject,
        message: safeMessage
    }
}
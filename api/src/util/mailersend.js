import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

export async function sendVerificationEmail(user, token) {
    const verificationLink = `${process.env.CLIENT_URL}/auth/verify?token=${token}`;

    const sentFrom = new Sender(
        process.env.EMAIL_FROM,
        "ReportIt"
    );

    const recipients = [
        new Recipient(user.email, user.username),
    ];

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject("Verify your email")
        .setText(
            `Click the following link to verify your email: ${verificationLink}`
        )
        .setHtml(`
      <h2>Verify your email</h2>
      <p>Click the button below to verify your email:</p>
      <a href="${verificationLink}"
         style="display:inline-block;padding:10px 16px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">
        Verify Email
      </a>
    `);

    await mailerSend.email.send(emailParams);
}
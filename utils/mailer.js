const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendInvitationEmail(to, tribbuName, invitationId, frontendUrl) {
  const link = `${frontendUrl}/invitations/${invitationId}`;
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `¡Invitación a ${tribbuName}!`,
    text: `Te han invitado a unirte a ${tribbuName}. Acepta aquí: ${link}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">¡Te han invitado a ${tribbuName}!</h2>
        <p>Alguien te ha invitado a unirte a la tribbu "${tribbuName}".</p>
        <p>
          <a href="${link}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            Aceptar invitación
          </a>
        </p>
        <p style="color: #666; font-size: 12px;">O copia este link: ${link}</p>
      </div>
    `,
  });
}

module.exports = { sendInvitationEmail };
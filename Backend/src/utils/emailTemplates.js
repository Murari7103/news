const resetPasswordTemplate = (fullName, resetURL) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Password Reset</title>
      </head>

      <body style="font-family: Arial, Helvetica, sans-serif; background:#f5f5f5; padding:40px;">

        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:10px;">

          <h2 style="color:#1f2937;">
            NewsIQ Admin Panel
          </h2>

          <p>Hello <strong>${fullName}</strong>,</p>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Click the button below to reset your password.
          </p>

          <p style="margin:30px 0;">
            <a
              href="${resetURL}"
              style="
                background:#2563eb;
                color:white;
                padding:12px 22px;
                text-decoration:none;
                border-radius:6px;
                display:inline-block;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            This password reset link is valid for
            <strong>15 minutes</strong>.
          </p>

          <hr>

          <p style="font-size:13px;color:#666;">
            If you didn't request this password reset,
            you can safely ignore this email.
          </p>

        </div>

      </body>
    </html>
  `;
};

module.exports = {
  resetPasswordTemplate,
};

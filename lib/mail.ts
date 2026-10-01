export async function sendVerificationEmail(
  email: string,
  code: string,
  name?: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.EMAIL_API;
  if (!apiKey) {
    console.error("EMAIL_API key is not configured in .env");
    return { success: false, error: "Email service is not configured" };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>DriveNow Verification Code</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f4f4f0;
          color: #000000;
          margin: 0;
          padding: 30px 15px;
        }
        .container {
          max-width: 520px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 3px solid #000000;
          box-shadow: 6px 6px 0px #000000;
          padding: 32px;
        }
        .header {
          display: inline-block;
          background-color: #E8B42A;
          color: #000000;
          font-weight: 900;
          font-size: 20px;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 8px 16px;
          border: 2px solid #000000;
          box-shadow: 3px 3px 0px #000000;
          margin-bottom: 24px;
        }
        h1 {
          font-size: 28px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 12px 0;
          line-height: 1.1;
        }
        p {
          font-size: 15px;
          line-height: 1.5;
          margin: 0 0 20px 0;
          color: #222222;
        }
        .code-box {
          background-color: #000000;
          color: #E8B42A;
          border: 2px solid #000000;
          padding: 18px 24px;
          text-align: center;
          font-family: 'Courier New', Courier, monospace;
          font-size: 38px;
          font-weight: 900;
          letter-spacing: 10px;
          margin: 24px 0;
          box-shadow: 4px 4px 0px #E8B42A;
        }
        .footer-note {
          font-size: 12px;
          color: #666666;
          border-top: 2px solid #000000;
          padding-top: 16px;
          margin-top: 28px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">DRIVENOW</div>
        <h1>VERIFY YOUR ACCOUNT</h1>
        <p>Hey ${name ? name : "there"},</p>
        <p>Use the 6-digit verification code below to confirm your email and finish setting up your DriveNow account:</p>
        
        <div class="code-box">${code}</div>

        <p><strong>This code will expire in 15 minutes.</strong></p>
        <p>If you didn't attempt to sign up for DriveNow, you can safely ignore this email.</p>

        <div class="footer-note">
          DRIVENOW
        </div>
      </div>
    </body>
    </html>
  `;

  const templateId = process.env.BREVO_VERIFY_TEMPLATE_ID
    ? Number(process.env.BREVO_VERIFY_TEMPLATE_ID)
    : 3;

  try {
    const payload: Record<string, any> = {
      to: [
        {
          email,
          name: name || "DriveNow Member",
        },
      ],
      params: {
        CODE: code,
        NAME: name || "there",
      },
    };

    if (templateId) {
      payload.templateId = templateId;
    } else {
      payload.sender = {
        name: "DriveNow",
        email: "ozairk.work@gmail.com",
      };
      payload.subject = `[${code}] Your DriveNow Verification Code`;
      payload.htmlContent = htmlContent;
    }

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("Brevo API error:", errData);
      return {
        success: false,
        error: errData.message || "Failed to send verification email",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to send email via Brevo:", err);
    return { success: false, error: "Network error sending verification email" };
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  name?: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.EMAIL_API;
  if (!apiKey) {
    console.error("EMAIL_API key is not configured in .env");
    return { success: false, error: "Email service is not configured" };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your DriveNow Password</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f4f4f0;
          color: #000000;
          margin: 0;
          padding: 30px 15px;
        }
        .container {
          max-width: 520px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 3px solid #000000;
          box-shadow: 4px 4px 0px #000000;
          padding: 32px;
        }
        .header {
          display: inline-block;
          background-color: #E8B42A;
          color: #000000;
          font-weight: 900;
          font-size: 20px;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 8px 16px;
          border: 2px solid #000000;
          box-shadow: 4px 4px 0px #000000;
          margin-bottom: 24px;
        }
        h1 {
          font-size: 26px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 12px 0;
          line-height: 1.2;
        }
        p {
          font-size: 15px;
          line-height: 1.5;
          margin: 0 0 20px 0;
          color: #222222;
        }
        .btn-container {
          margin: 28px 0;
          text-align: center;
        }
        .reset-btn {
          display: inline-block;
          background-color: #E8B42A;
          color: #000000 !important;
          font-size: 16px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          padding: 16px 32px;
          text-decoration: none;
          border: 3px solid #000000;
          box-shadow: 4px 4px 0px #000000;
        }
        .expiry-box {
          background-color: #f8f8f8;
          border: 2px dashed #000000;
          padding: 14px 18px;
          margin: 24px 0;
          font-size: 13px;
          color: #333333;
        }
        .fallback-link {
          font-size: 12px;
          color: #666666;
          word-break: break-all;
          margin-top: 15px;
          line-height: 1.4;
        }
        .fallback-link a {
          color: #000000;
          font-weight: 700;
          text-decoration: underline;
        }
        .footer-note {
          font-size: 14px;
          color: #666666;
          border-top: 2px solid #000000;
          padding-top: 16px;
          margin-top: 28px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">DRIVENOW</div>
        <h1>RESET YOUR PASSWORD</h1>
        <p>Hey ${name ? name : "there"},</p>
        <p>We received a request to reset the password for your DriveNow account. Click the button below to choose a new password:</p>
        
        <div class="btn-container">
          <a href="${resetUrl}" class="reset-btn" target="_blank">RESET PASSWORD &rarr;</a>
        </div>

        <div class="expiry-box">
          <strong>SECURITY NOTICE:</strong> This reset link will expire in <strong>1 hour</strong>. If you did not request this, you can safely disregard this email—your account remains secure.
        </div>

        <div class="fallback-link">
          Button not working? Copy and paste this URL into your browser:<br/>
          <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        </div>

        <div class="footer-note">
          DRIVENOW
        </div>
      </div>
    </body>
    </html>
  `;

  const templateId = process.env.BREVO_RESET_PASSWORD_TEMPLATE_ID
    ? Number(process.env.BREVO_RESET_PASSWORD_TEMPLATE_ID)
    : 4;

  try {
    const payload: Record<string, any> = {
      to: [
        {
          email,
          name: name || "DriveNow Member",
        },
      ],
      params: {
        RESET_URL: resetUrl,
        NAME: name || "there",
      },
    };

    if (templateId) {
      payload.templateId = templateId;
    } else {
      payload.sender = {
        name: "DriveNow",
        email: "ozairk.work@gmail.com",
      };
      payload.subject = "Reset your DriveNow password";
      payload.htmlContent = htmlContent;
    }

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("Brevo API error:", errData);
      return {
        success: false,
        error: errData.message || "Failed to send password reset email",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to send password reset email via Brevo:", err);
    return { success: false, error: "Network error sending password reset email" };
  }
}


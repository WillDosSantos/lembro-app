export const invitationEmailTemplate = (
  inviterName: string,
  profileName: string,
  profileSlug: string,
  role: 'editor' | 'viewer'
) => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const acceptUrl = `${baseUrl}/profiles/${profileSlug}?invitation=true`;
  const signupUrl = `${baseUrl}/signup`;

  return {
    subject: `You've been invited to contribute to ${profileName}'s memorial`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Memorial Contribution Invitation</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: #007bff;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin: 10px 5px;
              font-weight: 600;
            }
            .button:hover {
              background: #0056b3;
            }
            .button.secondary {
              background: #6c757d;
            }
            .button.secondary:hover {
              background: #545b62;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
              color: #6c757d;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Memorial Contribution Invitation</h1>
            <p>You've been invited to help preserve a loved one's memory</p>
          </div>
          
          <div class="content">
            <h2>Hello,</h2>
            
            <p><strong>${inviterName}</strong> has invited you to contribute to <strong>${profileName}'s</strong> memorial as a <strong>${role}</strong>.</p>
            
            <p>As a ${role}, you'll be able to ${role === 'editor' ? 'edit and update the memorial content, add photos, and manage family information' : 'view the memorial and leave comments'}.</p>
            
            <p>To accept this invitation and start contributing, please:</p>
            
            <ol>
              <li>Create an account (if you don't have one already)</li>
              <li>Sign in and visit the memorial</li>
              <li>Accept the invitation when prompted</li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${signupUrl}" class="button">Create Account</a>
              <a href="${acceptUrl}" class="button secondary">View Memorial</a>
            </div>
            
            <p><strong>What is Lembra?</strong></p>
            <p>Lembra is a platform for creating and sharing digital memorials. It helps families and friends preserve memories, share stories, and keep the legacy of loved ones alive through beautiful, interactive memorial pages.</p>
            
            <p>If you have any questions or need help, please don't hesitate to reach out.</p>
            
            <p>With warm regards,<br>The Lembra Team</p>
          </div>
          
          <div class="footer">
            <p>This invitation was sent by ${inviterName} for ${profileName}'s memorial.</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </body>
      </html>
    `,
    text: `
Memorial Contribution Invitation

Hello,

${inviterName} has invited you to contribute to ${profileName}'s memorial as a ${role}.

As a ${role}, you'll be able to ${role === 'editor' ? 'edit and update the memorial content, add photos, and manage family information' : 'view the memorial and leave comments'}.

To accept this invitation:
1. Create an account at: ${signupUrl}
2. Visit the memorial: ${acceptUrl}
3. Accept the invitation when prompted

What is Lembra?
Lembra is a platform for creating and sharing digital memorials. It helps families and friends preserve memories, share stories, and keep the legacy of loved ones alive.

If you have any questions, please don't hesitate to reach out.

With warm regards,
The Lembra Team

---
This invitation was sent by ${inviterName} for ${profileName}'s memorial.
If you didn't expect this invitation, you can safely ignore this email.
    `
  };
};

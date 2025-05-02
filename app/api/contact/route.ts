// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  console.log('API: Contact endpoint hit');
  
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('API: Request body parsed:', body);
    } catch (parseError) {
      console.error('API: Error parsing request JSON:', parseError);
      return NextResponse.json({ 
        error: 'Ugyldig forespørselsformat',
        success: false 
      }, { status: 400 });
    }
    
    // Handle test requests
    if (body.test === true) {
      console.log('API: Test request detected');
      return NextResponse.json({ 
        success: true, 
        test: true, 
        message: 'API endpoint is working'
      });
    }
    
    // Get all form data
    const { 
      name, 
      email, 
      message, 
      firstName, 
      lastName, 
      company, 
      website, 
      phone 
    } = body;
    
    // Validate required fields - keep compatibility with the original required fields
    if (!name || !email || !message) {
      console.log('API: Missing required fields');
      return NextResponse.json({ 
        error: 'Alle feltene må fylles ut',
        success: false
      }, { status: 400 });
    }
    
    // Get email configuration from environment variables
    const emailUser = process.env.EMAIL_USER || 'hey@hepta.biz';
    const emailPassword = process.env.EMAIL_PASSWORD;
    const emailHost = process.env.EMAIL_HOST || 'smtp.webhuset.no';
    const emailPort = parseInt(process.env.EMAIL_PORT || '587', 10);
    const emailSecure = process.env.EMAIL_SECURE === 'true' || emailPort === 465;
    
    // Log configuration (without the password)
    console.log('API: Email configuration:', { 
      host: emailHost, 
      port: emailPort, 
      secure: emailSecure,
      user: emailUser
    });
    
    // Set up the SMTP transport
    console.log('API: Creating nodemailer transporter');
    
    // For Webhuset, we need proper authentication
    const transportOptions = {
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: {
        user: emailUser,
        pass: emailPassword
      }
    };
    
    // Create transporter
    const transporter = nodemailer.createTransport(transportOptions);
    
    // Use Ethereal in development mode if no password is provided
    if (process.env.NODE_ENV === 'development' && !emailPassword) {
      console.log('API: In development mode without password, using Ethereal test account');
      try {
        const testAccount = await nodemailer.createTestAccount();
        
        const testTransporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        
        // Format message with all available fields
        const formattedMessage = formatMessageWithAllFields({
          message,
          firstName,
          lastName,
          company,
          website,
          phone
        });
        
        // Send with test account
        const info = await testTransporter.sendMail({
          from: `Hepta <${emailUser}>`,
          to: emailUser,
          subject: `Kontaktskjema: ${name}`,
          text: `Navn: ${name}\nE-post: ${email}\nTelefon: ${phone || 'Ikke oppgitt'}\n${formattedMessage}`,
          html: `<div>
                  <h2>Ny henvendelse</h2>
                  <p><b>Navn:</b> ${name}</p>
                  <p><b>E-post:</b> ${email}</p>
                  ${phone ? `<p><b>Telefon:</b> ${phone}</p>` : ''}
                  ${company ? `<p><b>Selskap:</b> ${company}</p>` : ''}
                  ${website ? `<p><b>Nettside:</b> ${website}</p>` : ''}
                  <p><b>Melding:</b></p>
                  <div>${message.replace(/\n/g, '<br>')}</div>
                 </div>`,
        });
        
        console.log('API: Test email sent:', info.messageId);
        console.log('API: Preview URL:', nodemailer.getTestMessageUrl(info));
        
        return NextResponse.json({
          success: true,
          testMode: true,
          previewUrl: nodemailer.getTestMessageUrl(info),
          message: 'E-post sendt i testmodus. Sjekk serveren for forhåndsvisningslenke.'
        });
      } catch (testError) {
        console.error('API: Test account failed:', testError);
        return NextResponse.json({
          error: 'Kunne ikke opprette testkonto for e-post',
          details: String(testError),
          success: false
        }, { status: 500 });
      }
    }
    
    // Try to send the email via configured SMTP
    try {
      console.log('API: Verifying SMTP connection');
      await transporter.verify();
      console.log('API: SMTP connection verified');
      
      // Send the actual email
      return await sendEmail(
        transporter, 
        { 
          name, 
          email, 
          message, 
          firstName, 
          lastName, 
          company, 
          website, 
          phone 
        }, 
        emailUser
      );
    } catch (verifyError) {
      console.error('API: SMTP verification failed:', verifyError);
      
      // If we're in development and the real SMTP fails, try Ethereal as fallback
      if (process.env.NODE_ENV === 'development') {
        console.log('API: SMTP failed in development, falling back to Ethereal');
        try {
          const testAccount = await nodemailer.createTestAccount();
          
          const testTransporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
          
          // Format message with all available fields
          const formattedMessage = formatMessageWithAllFields({
            message,
            firstName,
            lastName,
            company,
            website,
            phone
          });
          
          // Send with test account
          const info = await testTransporter.sendMail({
            from: `Hepta <${emailUser}>`,
            to: emailUser,
            subject: `Kontaktskjema: ${name}`,
            text: `Navn: ${name}\nE-post: ${email}\nTelefon: ${phone || 'Ikke oppgitt'}\n${formattedMessage}`,
            html: `<div>
                    <h2>Ny henvendelse</h2>
                    <p><b>Navn:</b> ${name}</p>
                    <p><b>E-post:</b> ${email}</p>
                    ${phone ? `<p><b>Telefon:</b> ${phone}</p>` : ''}
                    ${company ? `<p><b>Selskap:</b> ${company}</p>` : ''}
                    ${website ? `<p><b>Nettside:</b> ${website}</p>` : ''}
                    <p><b>Melding:</b></p>
                    <div>${message.replace(/\n/g, '<br>')}</div>
                   </div>`,
          });
          
          console.log('API: Test email sent:', info.messageId);
          console.log('API: Preview URL:', nodemailer.getTestMessageUrl(info));
          
          return NextResponse.json({
            success: true,
            testMode: true,
            previewUrl: nodemailer.getTestMessageUrl(info),
            message: 'E-post sendt i testmodus. Sjekk serveren for forhåndsvisningslenke.'
          });
        } catch (testError) {
          console.error('API: Even fallback test account failed:', testError);
        }
      }
      
      return NextResponse.json({ 
        error: 'Kunne ikke koble til e-posttjenesten. Vennligst kontakt oss direkte.',
        details: String(verifyError),
        success: false
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('API: General error in contact route:', error);
    return NextResponse.json({ 
      error: 'Det oppstod en feil ved behandling av kontaktskjema',
      details: String(error),
      success: false
    }, { status: 500 });
  }
}

// Helper function to format the message text with all fields
function formatMessageWithAllFields({ message, firstName, lastName, company, website, phone }) {
  let formattedMessage = `Melding: ${message}`;
  
  // Add extra information if available
  if (firstName && lastName) {
    formattedMessage += `\n\nFornavn: ${firstName}\nEtternavn: ${lastName}`;
  }
  
  if (company) {
    formattedMessage += `\nSelskap: ${company}`;
  }
  
  if (website) {
    formattedMessage += `\nNettside: ${website}`;
  }
  
  if (phone) {
    formattedMessage += `\nTelefon: ${phone}`;
  }
  
  return formattedMessage;
}

// Helper function to send email
async function sendEmail(transporter, formData, fromEmail) {
  const { 
    name, 
    email, 
    message, 
    firstName, 
    lastName, 
    company, 
    website, 
    phone 
  } = formData;
  
  try {
    console.log('API: Preparing email');
    
    // Log the full mail configuration
    console.log('API: Mail options:', {
      from: `Hepta <${fromEmail}>`,
      to: fromEmail,
      replyTo: email,
      subject: `Kontaktskjema: ${name}`
    });
    
    // Format message with all details
    const detailedMessage = formatMessageWithAllFields({
      message,
      firstName,
      lastName,
      company,
      website,
      phone
    });
    
    // Use the from email from environment variables
    const mailOptions = {
      from: `Hepta <${fromEmail}>`,
      to: fromEmail, // Where you want to receive the contact forms
      replyTo: email, // The visitor's email for when you reply
      subject: `Kontaktskjema: ${name}`,
      text: `
        Navn: ${name}
        E-post: ${email}
        ${phone ? `Telefon: ${phone}` : ''}
        ${company ? `Selskap: ${company}` : ''}
        ${website ? `Nettside: ${website}` : ''}
        
        Melding: ${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Ny henvendelse fra kontaktskjema</h2>
          <p><strong>Navn:</strong> ${name}</p>
          <p><strong>E-post:</strong> ${email}</p>
          ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
          ${company ? `<p><strong>Selskap:</strong> ${company}</p>` : ''}
          ${website ? `<p><strong>Nettside:</strong> ${website}</p>` : ''}
          <p><strong>Melding:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      `
    };
    
    console.log('API: Sending email to', mailOptions.to);
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('API: Email sent successfully:', info.messageId);
    
    // Optional: Send auto-reply
    try {
      console.log('API: Sending auto-reply to', email);
      
      await transporter.sendMail({
        from: `Hepta <${fromEmail}>`,
        to: email, // Sending to the visitor's email
        subject: 'Takk for din henvendelse til Hepta',
        text: `
          Hei ${firstName || name}
          
          Takk for din henvendelse til Hepta. Vi har mottatt meldingen din og vil ta kontakt så snart som mulig.
          
          Med vennlig hilsen,
          Hepta AS
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <p>Hei ${firstName || name}!</p>
            <p>Takk for din henvendelse til Hepta. Vi har mottatt meldingen din og vil ta kontakt så snart som mulig.</p>
            <p>Med vennlig hilsen,<br>Hepta AS</p>
          </div>
        `,headers: {
          'X-Priority': '3',
          'Importance': 'Normal'
        }
      });
      
      console.log('API: Auto-reply sent');
    } catch (autoReplyError) {
      // Don't fail if auto-reply fails
      console.error('API: Auto-reply failed, but main email was sent:', autoReplyError);
    }
    
    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Kontaktskjema mottatt og e-post sendt'
    });
  } catch (emailError) {
    console.error('API: Error sending email:', emailError);
    return NextResponse.json({ 
      error: 'Kunne ikke sende e-post',
      details: String(emailError),
      success: false
    }, { status: 500 });
  }
}

// Also handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
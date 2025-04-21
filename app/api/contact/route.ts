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
    
    // Get form data
    const { name, email, message } = body;
    
    // Validate required fields
    if (!name || !email || !message) {
      console.log('API: Missing required fields');
      return NextResponse.json({ 
        error: 'Alle feltene må fylles ut',
        success: false
      }, { status: 400 });
    }
    
    console.log('API: Creating nodemailer transporter for Webhuset');
    
    // Create nodemailer transporter for Webhuset's SMTP server
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay2.webhuset.no',
      port: 25, // Try port 587 first
      secure: false, // TLS for port 587
      auth: {
        user: 'hey@hepta.biz',
        pass: '!NyttPassord123',
      },
    });
    
    console.log('API: Verifying SMTP connection');
    
    // Verify connection before sending
    try {
      await transporter.verify();
      console.log('API: SMTP connection verified');
    } catch (verifyError) {
      console.error('API: SMTP verification failed for port 587:', verifyError);
      
      // Try alternate port 465 with SSL if 587 fails
      console.log('API: Trying alternate port 465 with SSL');
      try {
        const altTransporter = nodemailer.createTransport({
          host: 'smtp.webhuset.no',
          port: 465, // Try port 465 as fallback
          secure: true, // SSL for port 465
          auth: {
            user: 'hey@hepta.biz',
            pass: '!NyttPassord123',
          },
        });
        
        await altTransporter.verify();
        console.log('API: Alternate SMTP settings verified');
        
        // Use alternate settings if they work
        return await sendEmail(altTransporter, { name, email, message });
      } catch (altError) {
        console.error('API: Alternate SMTP settings also failed:', altError);
        
        // If both fail in development, try Ethereal as last resort
        if (process.env.NODE_ENV === 'development') {
          console.log('API: In development mode, trying Ethereal test account');
          try {
            const testAccount = await nodemailer.createTestAccount();
            console.log('API: Created test account:', testAccount.user);
            
            const testTransporter = nodemailer.createTransport({
              host: 'smtp.ethereal.email',
              port: 587,
              secure: false,
              auth: {
                user: testAccount.user,
                pass: testAccount.pass,
              },
            });
            
            // Send with test account
            const info = await testTransporter.sendMail({
              from: '"Hepta Contact" <hey@hepta.biz>',
              to: 'hey@hepta.biz',
              subject: `Kontaktskjema: ${name}`,
              text: `Navn: ${name}\nE-post: ${email}\nMelding: ${message}`,
              html: `<div><h2>Ny henvendelse</h2><p><b>Navn:</b> ${name}</p><p><b>E-post:</b> ${email}</p><p><b>Melding:</b></p><div>${message.replace(/\n/g, '<br>')}</div></div>`,
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
            console.error('API: Test account also failed:', testError);
          }
        }
        
        return NextResponse.json({ 
          error: 'Kunne ikke koble til e-posttjenesten. Vennligst kontakt oss direkte.',
          details: process.env.NODE_ENV === 'development' ? String(verifyError) : undefined
        }, { status: 500 });
      }
    }
    
    // If original settings work, send with them
    return await sendEmail(transporter, { name, email, message });
    
  } catch (error) {
    console.error('API: General error in contact route:', error);
    return NextResponse.json({ 
      error: 'Det oppstod en feil ved behandling av kontaktskjema',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}

// Helper function to send email
async function sendEmail(transporter, { name, email, message }) {
  try {
    console.log('API: Preparing email');
    
    // Prepare email content
    const mailOptions = {
      from: 'Hepta <hey@hepta.biz>', // Make sure this email exists in your domain
      to: 'hey@hepta.biz', // Where you want to receive the emails
      replyTo: email,
      subject: `Kontaktskjema: ${name}`,
      text: `
        Navn: ${name}
        E-post: ${email}
        Melding: ${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Ny henvendelse fra kontaktskjema</h2>
          <p><strong>Navn:</strong> ${name}</p>
          <p><strong>E-post:</strong> ${email}</p>
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
        from: 'Hepta <hey@hepta.biz>',
        to: email,
        subject: 'Takk for din henvendelse til Hepta',
        text: `
          Hei ${name},
          
          Takk for din henvendelse til Hepta. Vi har mottatt meldingen din og vil ta kontakt så snart som mulig.
          
          Med vennlig hilsen,
          Hepta AS
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hei ${name}!</h2>
            <p>Takk for din henvendelse til Hepta. Vi har mottatt meldingen din og vil ta kontakt så snart som mulig.</p>
            <p>Med vennlig hilsen,<br>Hepta AS</p>
          </div>
        `
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
      details: process.env.NODE_ENV === 'development' ? String(emailError) : undefined
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
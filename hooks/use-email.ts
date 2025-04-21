// hooks/use-email.ts
import { useState } from 'react';
import { emailTemplates } from '@/lib/email';

interface UseEmailOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  skipAuth?: boolean;
}

export function useEmail(options: UseEmailOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  const sendEmail = async (params: SendEmailParams) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }
      
      setData(data);
      setSuccess(true);
      options.onSuccess?.(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Utility function to send emails using predefined templates
  const sendTemplateEmail = async (
    to: string | string[],
    templateName: keyof typeof emailTemplates,
    templateData: any,
    extraParams: Partial<SendEmailParams> = {}
  ) => {
    if (!emailTemplates[templateName]) {
      throw new Error(`Email template "${templateName}" not found`);
    }
    
    // Get the template with the provided data
    const template = emailTemplates[templateName](templateData);
    
    // Send the email with the template content
    return sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
      ...extraParams,
    });
  };

  return {
    sendEmail,
    sendTemplateEmail,
    isLoading,
    error,
    success,
    data,
  };
}
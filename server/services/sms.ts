export interface SmsAdapter {
  isConfigured(): boolean;
  sendOtp(phone: string, code: string, messageText?: string): Promise<{ sent: boolean; reason?: string }>;
}

function getProviderConfig() {
  const provider = (process.env.SMS_PROVIDER || '').trim().toLowerCase();
  const apiKey = (process.env.SMS_API_KEY || '').trim();
  const senderId = (process.env.SMS_SENDER_ID || 'NileLink').trim();
  const apiUrl = (process.env.SMS_API_URL || '').trim();
  return { provider, apiKey, senderId, apiUrl };
}

function isAllowedHttpsUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

class ProductionSmsAdapter implements SmsAdapter {
  isConfigured(): boolean {
    const { provider, apiKey, apiUrl } = getProviderConfig();
    if (!provider || !apiKey) return false;
    if (provider === 'twilio') {
      return apiKey.includes(':');
    }
    if (provider === 'webhook' || provider === 'http') {
      return isAllowedHttpsUrl(apiUrl);
    }
    return isAllowedHttpsUrl(apiUrl);
  }

  async sendOtp(phone: string, code: string, messageText?: string): Promise<{ sent: boolean; reason?: string }> {
    const { provider, apiKey, senderId, apiUrl } = getProviderConfig();
    if (!provider || !apiKey) {
      return {
        sent: false,
        reason: 'Configure SMS_PROVIDER and SMS_API_KEY in environment variables.',
      };
    }

    const bodyText = messageText || `Your NileLink verification code is: ${code}. Valid for 10 minutes.`;

    try {
      if (provider === 'twilio') {
        const sep = apiKey.indexOf(':');
        if (sep <= 0) {
          return { sent: false, reason: 'Twilio SMS_API_KEY must be formatted as ACCOUNT_SID:AUTH_TOKEN.' };
        }
        const accountSid = apiKey.slice(0, sep);
        const authToken = apiKey.slice(sep + 1);
        const form = new URLSearchParams({
          To: phone,
          From: senderId,
          Body: bodyText,
        });
        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: form.toString(),
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          return { sent: false, reason: `Twilio gateway error (${res.status}): ${errText.slice(0, 160)}` };
        }
        return { sent: true };
      }

      if (!isAllowedHttpsUrl(apiUrl)) {
        return {
          sent: false,
          reason: 'Configure an HTTPS SMS_API_URL endpoint for non-Twilio SMS providers.',
        };
      }

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phone,
          senderId,
          message: bodyText,
          code,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        return { sent: false, reason: `SMS gateway error (${res.status}): ${errText.slice(0, 160)}` };
      }
      return { sent: true };
    } catch (err) {
      return { sent: false, reason: (err as Error).message || 'SMS request failed.' };
    }
  }
}

export const smsAdapter: SmsAdapter = new ProductionSmsAdapter();

import { xFetch } from '../utils/constants';
import thumbmarkService from './ThumbmarkService';

async function getClientIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting client IP:', error);
    return null;
  }
}

export const sendSystemEvent = async (user, data) => {
  const [fingerprint, fingerprintData, clientIP] = await Promise.all([
    thumbmarkService.getFingerprint(),
    thumbmarkService.getFingerprintData(),
    getClientIP()
  ]);

  try {
    await xFetch('/systemEvents', {
      method: 'POST',
      body: {
        user: user.id,
        data: {
          ...data,
          user: {
            _id: user._id,
            role: user.role,
            name: user.name,
            email: user.email
          },
          fingerprint,
          fingerprintData,
          clientIP
        }
      }
    });
  } catch (error) {
    console.error('Failed to send system event:', error);
  }
}; 
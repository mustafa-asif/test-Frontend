import thumbmarkService from './ThumbmarkService';
import { xFetch } from '../utils/constants';

class OrderTraceService {
  constructor() {
    if (OrderTraceService.instance) {
      return OrderTraceService.instance;
    }
    OrderTraceService.instance = this;
  }

  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting client IP:', error);
      return null;
    }
  }

  async traceOrderChange(orderId, message, old, changes, user) {
    try {
      const [fingerprint, fingerprintData, clientIP] = await Promise.all([
        thumbmarkService.getFingerprint(),
        thumbmarkService.getFingerprintData(),
        this.getClientIP()
      ]);

      const payload = {
        timestamp: new Date().toISOString(),
        old,
        changes,
        userId: user.id,
        userEmail: user.email,
        message,
        fingerprint,
        fingerprintData: {
          ...fingerprintData,
          collected: {
            deviceMemory: navigator.deviceMemory,
            deviceCPUs: navigator.hardwareConcurrency,
          }
        },
        clientIP
      };

      await xFetch(`/orders/${orderId}/trace`, {
        method: 'POST',
        body: payload
      });
    } catch (error) {
      console.error('Error tracing order change:', error);
      throw error;
    }
  }
}

const orderTraceService = new OrderTraceService();
export default orderTraceService; 
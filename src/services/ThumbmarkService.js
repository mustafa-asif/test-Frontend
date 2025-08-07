import { getFingerprint, getFingerprintData } from '@thumbmarkjs/thumbmarkjs'

class ThumbmarkService {
  constructor() {
    if (ThumbmarkService.instance) {
      return ThumbmarkService.instance;
    }
    ThumbmarkService.instance = this;
  }

  async getFingerprint() {
    try {
      return await getFingerprint();
    } catch (error) {
      console.error('Error getting fingerprint:', error);
      throw error;
    }
  }

  async getFingerprintData() {
    try {
      return await getFingerprintData();
    } catch (error) {
      console.error('Error getting fingerprint components:', error);
      throw error;
    }
  }
}

const thumbmarkService = new ThumbmarkService();
export default thumbmarkService; 
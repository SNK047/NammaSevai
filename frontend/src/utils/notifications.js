const WHATSAPP_BUSINESS_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

export const WhatsAppService = {
  sendInquiry(phone, workerName, serviceType) {
    const message = encodeURIComponent(
      `Hi, I'm interested in ${serviceType} service from ${workerName}. Please provide more details.`
    );
    return `https://wa.me/${phone}?text=${message}`;
  },

  sendWorkerNotification(phone, customerName, serviceType) {
    const message = encodeURIComponent(
      `New service request from ${customerName} for ${serviceType}. Please check your dashboard.`
    );
    return `https://wa.me/${phone}?text=${message}`;
  },

  sendComplaintNotification(phone, title, category) {
    const message = encodeURIComponent(
      `New complaint filed: ${title} (${category}). Please take action.`
    );
    return `https://wa.me/${phone}?text=${message}`;
  },

  openChat(phone, initialMessage = '') {
    const message = encodeURIComponent(initialMessage);
    return `https://wa.me/${phone}?text=${message}`;
  },

  isWhatsAppAvailable() {
    return typeof window !== 'undefined' && /WhatsApp/.test(navigator.userAgent);
  },
};

export const SMSService = {
  formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('91')) return `+${cleaned}`;
    if (cleaned.startsWith('0')) return `+91${cleaned.slice(1)}`;
    return `+91${cleaned}`;
  },

  initiateCall(phone) {
    return `tel:${this.formatPhoneNumber(phone)}`;
  },

  initiateSMS(phone, body = '') {
    const encodedBody = encodeURIComponent(body);
    return `sms:${this.formatPhoneNumber(phone)}?body=${encodedBody}`;
  },
};

export const NotificationService = {
  async requestPermission() {
    if (!('Notification' in window)) {
      return { granted: false, reason: 'not-supported' };
    }
    
    if (Notification.permission === 'granted') {
      return { granted: true };
    }
    
    if (Notification.permission === 'denied') {
      return { granted: false, reason: 'denied' };
    }

    const permission = await Notification.requestPermission();
    return { granted: permission === 'granted', reason: permission };
  },

  async sendLocal(title, options = {}) {
    const { granted } = await this.requestPermission();
    if (!granted) return null;

    return new Notification(title, {
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      ...options,
    });
  },

  async notifyNewRequest(workerName, serviceType) {
    return this.sendLocal('New Service Request', {
      body: `${workerName} is requesting ${serviceType} service`,
      tag: 'new-request',
    });
  },

  async notifyRequestUpdate(status, serviceType) {
    return this.sendLocal('Request Update', {
      body: `Your ${serviceType} request is now ${status}`,
      tag: 'request-update',
    });
  },

  async notifyComplaintUpdate(status, title) {
    return this.sendLocal('Complaint Update', {
      body: `Your complaint "${title}" is now ${status}`,
      tag: 'complaint-update',
    });
  },
};

export default { WhatsAppService, SMSService, NotificationService };
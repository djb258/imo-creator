class MappingHelper {
  constructor() {
    this.roleMapping = {
      // CEO variations
      'chief executive officer': 'CEO',
      'ceo': 'CEO',
      'president': 'CEO',
      'founder': 'CEO',
      'co-founder': 'CEO',
      'managing director': 'CEO',
      'executive director': 'CEO',
      
      // CFO variations
      'chief financial officer': 'CFO',
      'cfo': 'CFO',
      'finance director': 'CFO',
      'financial director': 'CFO',
      'treasurer': 'CFO',
      'controller': 'CFO',
      
      // HR variations
      'human resources': 'HR',
      'hr': 'HR',
      'hr director': 'HR',
      'hr manager': 'HR',
      'people director': 'HR',
      'talent director': 'HR',
      'chief people officer': 'HR',
      'head of people': 'HR'
    };

    this.emailStatusMapping = {
      'valid': 'green',
      'deliverable': 'green',
      'accept_all': 'yellow',
      'risky': 'yellow',
      'unknown': 'gray',
      'invalid': 'red',
      'undeliverable': 'red',
      'toxic': 'red'
    };

    this.confidenceThresholds = {
      green: { min: 80, max: 100 },
      yellow: { min: 50, max: 79 },
      red: { min: 70, max: 100 },  // High confidence it's bad
      gray: { min: 0, max: 49 }
    };
  }

  mapJobTitleToRole(title) {
    if (!title) return null;
    
    const normalizedTitle = title.toLowerCase().trim();
    
    // Direct mapping
    if (this.roleMapping[normalizedTitle]) {
      return this.roleMapping[normalizedTitle];
    }
    
    // Partial matches
    if (normalizedTitle.includes('ceo') || normalizedTitle.includes('chief executive')) {
      return 'CEO';
    }
    
    if (normalizedTitle.includes('cfo') || normalizedTitle.includes('chief financial')) {
      return 'CFO';
    }
    
    if (normalizedTitle.includes('hr') || 
        normalizedTitle.includes('human resources') || 
        normalizedTitle.includes('people') ||
        normalizedTitle.includes('talent')) {
      return 'HR';
    }
    
    // Fallback for executive titles
    if (normalizedTitle.includes('president') || 
        normalizedTitle.includes('founder') ||
        normalizedTitle.includes('director') ||
        normalizedTitle.includes('head of')) {
      // Try to determine if it's finance-related
      if (normalizedTitle.includes('finance') || normalizedTitle.includes('financial')) {
        return 'CFO';
      }
      // Default executives to CEO
      return 'CEO';
    }
    
    return null;
  }

  mapEmailStatusToColor(status, confidence = 50) {
    if (!status) return 'gray';
    
    const normalizedStatus = status.toLowerCase();
    const colorStatus = this.emailStatusMapping[normalizedStatus];
    
    if (colorStatus) {
      // Validate confidence is within expected range for this color
      const thresholds = this.confidenceThresholds[colorStatus];
      if (confidence < thresholds.min || confidence > thresholds.max) {
        // Adjust color based on actual confidence
        if (confidence >= 80) return 'green';
        if (confidence >= 50) return 'yellow';
        if (confidence < 30) return 'gray';
        return 'red';
      }
      return colorStatus;
    }
    
    // Fallback based on confidence
    if (confidence >= 80) return 'green';
    if (confidence >= 50) return 'yellow';
    if (confidence < 30) return 'gray';
    return 'red';
  }

  normalizeContactData(rawContact) {
    const normalized = {
      full_name: this.cleanName(rawContact.name || rawContact.full_name || ''),
      title: this.cleanTitle(rawContact.title || rawContact.position || ''),
      email: this.cleanEmail(rawContact.email || ''),
      phone: this.cleanPhone(rawContact.phone || rawContact.telephone || null),
      role_code: null,
      confidence_score: rawContact.confidence || rawContact.confidence_score || 0.8,
      source_url: rawContact.source_url || rawContact.url || null
    };

    // Map title to role
    normalized.role_code = this.mapJobTitleToRole(normalized.title);

    return normalized;
  }

  normalizeVerificationResult(rawResult) {
    return {
      contact_id: rawResult.contact_id || rawResult.id,
      email: this.cleanEmail(rawResult.email || ''),
      status: this.mapEmailStatusToColor(rawResult.status, rawResult.confidence),
      confidence: rawResult.confidence || rawResult.score || 50,
      details: this.normalizeVerificationDetails(rawResult.details || {}),
      risk_score: rawResult.risk_score || this.calculateRiskScore(rawResult),
      verified_at: rawResult.verified_at || new Date().toISOString()
    };
  }

  normalizeVerificationDetails(details) {
    return {
      syntax_valid: details.syntax_valid ?? details.valid_syntax ?? true,
      domain_exists: details.domain_exists ?? details.domain_valid ?? true,
      mx_record_exists: details.mx_exists ?? details.mx_records ?? true,
      is_deliverable: details.deliverable ?? details.is_deliverable ?? null,
      is_disposable: details.disposable ?? details.is_disposable ?? false,
      is_role_account: details.role ?? details.is_role ?? false
    };
  }

  calculateRiskScore(result) {
    let risk = 0.3; // Base risk
    
    if (result.status === 'invalid' || result.status === 'red') risk += 0.4;
    if (result.status === 'risky' || result.status === 'yellow') risk += 0.2;
    if (result.confidence < 50) risk += 0.2;
    if (result.details?.is_disposable) risk += 0.1;
    
    return Math.min(1.0, risk);
  }

  cleanName(name) {
    return name.trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  cleanTitle(title) {
    return title.trim()
      .replace(/\s+/g, ' ')
      .replace(/[.,;]+$/, ''); // Remove trailing punctuation
  }

  cleanEmail(email) {
    return email.toLowerCase().trim();
  }

  cleanPhone(phone) {
    if (!phone) return null;
    
    // Basic phone cleaning - remove non-digits except + and - and spaces
    return phone.replace(/[^\d\s\-\+\(\)]/g, '').trim() || null;
  }

  validateContactData(contact) {
    const errors = [];
    
    if (!contact.full_name || contact.full_name.length < 2) {
      errors.push('Full name is required and must be at least 2 characters');
    }
    
    if (!contact.email || !this.isValidEmail(contact.email)) {
      errors.push('Valid email is required');
    }
    
    if (!contact.title || contact.title.length < 2) {
      errors.push('Title is required and must be at least 2 characters');
    }
    
    if (!contact.role_code || !['CEO', 'CFO', 'HR'].includes(contact.role_code)) {
      errors.push('Role code must be one of: CEO, CFO, HR');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  groupContactsByRole(contacts) {
    return contacts.reduce((groups, contact) => {
      const role = contact.role_code || 'Unknown';
      if (!groups[role]) groups[role] = [];
      groups[role].push(contact);
      return groups;
    }, {});
  }

  getHighConfidenceContacts(contacts, threshold = 0.8) {
    return contacts.filter(contact => 
      (contact.confidence_score || contact.confidence || 0) >= threshold
    );
  }

  getVerifiedContacts(contacts) {
    return contacts.filter(contact => 
      contact.email_status && ['green', 'yellow'].includes(contact.email_status)
    );
  }

  deduplicateContacts(contacts) {
    const seen = new Set();
    return contacts.filter(contact => {
      const key = `${contact.email}:${contact.role_code}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

module.exports = MappingHelper;
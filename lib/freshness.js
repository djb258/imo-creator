class FreshnessManager {
  constructor(config = {}) {
    this.defaultTtlHours = config.defaultTtlHours || 24;
    this.freshnessRules = config.freshnessRules || {
      contact_verification: 168, // 7 days
      company_scrape: 72,       // 3 days
      email_validation: 24      // 1 day
    };
  }

  isContactDataFresh(contact, dataType = 'contact') {
    if (!contact || !contact.updated_at) {
      return false;
    }

    const updatedAt = new Date(contact.updated_at);
    const now = new Date();
    const ttlHours = this.freshnessRules[dataType] || this.defaultTtlHours;
    const ttlMs = ttlHours * 60 * 60 * 1000;

    return (now.getTime() - updatedAt.getTime()) < ttlMs;
  }

  isVerificationDataFresh(verification) {
    if (!verification || !verification.email_checked_at) {
      return false;
    }

    const checkedAt = new Date(verification.email_checked_at);
    const now = new Date();
    const ttlHours = this.freshnessRules.email_validation;
    const ttlMs = ttlHours * 60 * 60 * 1000;

    return (now.getTime() - checkedAt.getTime()) < ttlMs;
  }

  shouldRefreshContact(contact) {
    return !this.isContactDataFresh(contact, 'contact');
  }

  shouldRefreshVerification(verification) {
    return !this.isVerificationDataFresh(verification);
  }

  getFreshnessScore(data, dataType) {
    if (!data || !data.updated_at) {
      return 0;
    }

    const updatedAt = new Date(data.updated_at);
    const now = new Date();
    const ttlHours = this.freshnessRules[dataType] || this.defaultTtlHours;
    const ttlMs = ttlHours * 60 * 60 * 1000;
    
    const ageMs = now.getTime() - updatedAt.getTime();
    const freshnessRatio = Math.max(0, 1 - (ageMs / ttlMs));
    
    return Math.round(freshnessRatio * 100);
  }

  getStaleContacts(contacts) {
    return contacts.filter(contact => this.shouldRefreshContact(contact));
  }

  getStaleVerifications(verifications) {
    return verifications.filter(verification => this.shouldRefreshVerification(verification));
  }

  prioritizeRefreshTasks(tasks) {
    return tasks.sort((a, b) => {
      const aFreshness = this.getFreshnessScore(a.data, a.type);
      const bFreshness = this.getFreshnessScore(b.data, b.type);
      
      // Lower freshness score = higher priority (more stale)
      return aFreshness - bFreshness;
    });
  }

  getFreshnessReport(contactsData) {
    const report = {
      total_contacts: contactsData.length,
      fresh_contacts: 0,
      stale_contacts: 0,
      fresh_verifications: 0,
      stale_verifications: 0,
      average_contact_freshness: 0,
      average_verification_freshness: 0,
      recommendations: []
    };

    let totalContactFreshness = 0;
    let totalVerificationFreshness = 0;
    let verificationCount = 0;

    for (const contact of contactsData) {
      const contactFreshness = this.getFreshnessScore(contact, 'contact');
      totalContactFreshness += contactFreshness;
      
      if (contactFreshness > 50) {
        report.fresh_contacts++;
      } else {
        report.stale_contacts++;
      }

      // Check verification data if present
      if (contact.email_checked_at) {
        verificationCount++;
        const verificationFreshness = this.getFreshnessScore(
          { updated_at: contact.email_checked_at }, 
          'email_validation'
        );
        totalVerificationFreshness += verificationFreshness;

        if (verificationFreshness > 50) {
          report.fresh_verifications++;
        } else {
          report.stale_verifications++;
        }
      }
    }

    report.average_contact_freshness = Math.round(totalContactFreshness / contactsData.length);
    report.average_verification_freshness = verificationCount > 0 
      ? Math.round(totalVerificationFreshness / verificationCount) 
      : 0;

    // Generate recommendations
    if (report.stale_contacts > report.fresh_contacts) {
      report.recommendations.push('Consider refreshing contact data - majority of contacts are stale');
    }

    if (report.stale_verifications > report.fresh_verifications && verificationCount > 0) {
      report.recommendations.push('Re-verify email addresses - majority of verifications are outdated');
    }

    if (report.average_contact_freshness < 30) {
      report.recommendations.push('Urgent: Contact data is very stale, recommend immediate refresh');
    }

    return report;
  }

  setFreshnessRule(dataType, ttlHours) {
    this.freshnessRules[dataType] = ttlHours;
  }

  getFreshnessRule(dataType) {
    return this.freshnessRules[dataType] || this.defaultTtlHours;
  }
}

module.exports = FreshnessManager;
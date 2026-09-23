import { MessageTemplate, RiskLevel, RuleMatch, ScanResult } from '../../types';

export interface DetectionRule {
  id: string;
  category: string;
  riskLevel: RiskLevel;
  pattern: RegExp;
  explanation: string;
  suggestion: string;
  contextValidator?: (match: RegExpExecArray, fullText: string) => boolean;
}

export const FIVERR_RULES: DetectionRule[] = [
  // 1. Off-Platform Payments
  {
    id: 'off-payment-direct',
    category: 'Off-Platform Payment',
    riskLevel: 'high',
    pattern: /\b(?:pay(?:ment)?|send|transfer)\s+(?:me\s+)?(?:via|through|on|outside|directly)?\s*(?:paypal|crypto|bitcoin|usdt|eth|wire|bank\s*transfer|cash\s*app|venmo|zelle|wise|payoneer)\b/i,
    explanation: 'Suggesting payment outside Fiverr is one of the most severe policy violations and triggers automated account suspension.',
    suggestion: 'Please keep all transactions within Fiverr using Fiverr\'s official order and milestone checkout.'
  },
  {
    id: 'off-payment-fee-avoidance',
    category: 'Off-Platform Payment',
    riskLevel: 'high',
    pattern: /\b(?:avoid|save|skip|without)\s+(?:the\s+)?(?:fiverr\s+)?(?:fee|commission|20%|charge)\b/i,
    explanation: 'Discussing circumventing Fiverr\'s service fees or commission is heavily flagged by Fiverr automated filters.',
    suggestion: 'Remove mention of fee avoidance. All order payments must remain on Fiverr.'
  },
  {
    id: 'off-payment-methods-standalone',
    category: 'Off-Platform Payment',
    riskLevel: 'high',
    pattern: /\b(?:paypal|venmo|cashapp|zelle|western\s*union|moneygram)\b/i,
    explanation: 'Mentioning external payment platforms directly triggers automated review bots.',
    suggestion: 'Replace with "Fiverr official custom offer / order system".'
  },

  // 2. Off-Platform Communications (Direct contact sharing)
  {
    id: 'off-comm-email',
    category: 'Off-Platform Communication',
    riskLevel: 'high',
    pattern: /\b[A-Za-z0-9._%+-]+(?:\s*\[at\]\s*|\s*@\s*)[A-Za-z0-9.-]+(?:\s*\[dot\]\s*|\s*\.\s*)[A-Za-z]{2,}\b/i,
    explanation: 'Sharing direct email addresses is strictly restricted unless required for gig delivery (e.g. configuring an email campaign) and approved within order requirements.',
    suggestion: 'Keep communications strictly in the Fiverr order inbox or Fiverr video calls.'
  },
  {
    id: 'off-comm-phone',
    category: 'Off-Platform Communication',
    riskLevel: 'high',
    pattern: /(?:(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10,12}\b)/,
    contextValidator: (match, fullText) => {
      // Avoid flagging order numbers, dimensions (1920x1080), or timestamps
      const matched = match[0];
      const surrounding = fullText.slice(Math.max(0, match.index - 10), match.index + matched.length + 10);
      if (/order\s*#?|invoice|resolution|dpi|\d+x\d+/i.test(surrounding)) return false;
      return true;
    },
    explanation: 'Sharing phone numbers or requesting WhatsApp/SMS calls is flagged as an attempt to take clients off the platform.',
    suggestion: 'Use Fiverr\'s built-in text chat and Fiverr Video Call feature for all project discussions.'
  },
  {
    id: 'off-comm-whatsapp',
    category: 'Off-Platform Communication',
    riskLevel: 'high',
    pattern: /\b(?:whatsapp|what's\s*app|wa\.me|telegram|tg|skype|viber|wechat|signal|discord)\b/i,
    explanation: 'Messaging apps like WhatsApp, Telegram, Skype, and Discord are heavily monitored and trigger immediate warnings.',
    suggestion: 'We can discuss all order details and share files right here on Fiverr chat.'
  },
  {
    id: 'off-comm-external-meeting',
    category: 'Off-Platform Communication',
    riskLevel: 'medium',
    pattern: /\b(?:zoom(?:\s*call|\s*meeting|\s*link)?|google\s*meet|teams\s*meeting|let's\s*(?:talk|hop\s*on|jump\s*on)\s*a\s*call)\b/i,
    contextValidator: (match, fullText) => {
      // Allow "zoom in" or "zoom out" when talking about photo editing / graphics
      const matched = match[0].toLowerCase();
      const pos = match.index;
      const after = fullText.slice(pos, pos + 25).toLowerCase();
      if (after.includes('zoom in') || after.includes('zoom out') || after.includes('zoomed')) {
        return false;
      }
      return true;
    },
    explanation: 'External video conferencing links (Zoom, Google Meet, Microsoft Teams) can get your gig flagged unless conducted through Fiverr\'s official Zoom integration button.',
    suggestion: 'We can schedule a consultation call directly using the official Fiverr Video Call button inside our order.'
  },

  // 3. Sensitive Credentials & Passwords
  {
    id: 'credentials-sensitive',
    category: 'Sensitive Credentials',
    riskLevel: 'high',
    pattern: /\b(?:send(?:ing)?\s+(?:me\s+)?(?:your|the)?\s*(?:password|passcode|pin|credit\s*card|cvv|security\s*code|bank\s*details|ssn|social\s*security))\b/i,
    explanation: 'Requesting passwords or payment card details directly over unencrypted Fiverr chat is dangerous and violates security policies.',
    suggestion: 'Use temporary delegation invites, guest collaborator permissions, or secure encrypted password vaults (e.g. LastPass/1Password sharing).'
  },

  // 4. Feedback Manipulation & Reviews
  {
    id: 'review-manipulation-stars',
    category: 'Feedback & Review Manipulation',
    riskLevel: 'high',
    pattern: /\b(?:give|leave|rate)\s+(?:me\s+)?(?:a\s+)?(?:5\s*stars?|five\s*stars?|positive\s*review|good\s*feedback)\b/i,
    explanation: 'Explicitly requesting "5 stars" or "positive reviews" violates Fiverr\'s Feedback Manipulation Policy and can result in gig demotion or bans.',
    suggestion: 'If you\'re satisfied with my work, I\'d greatly appreciate your honest feedback on our project.'
  },
  {
    id: 'review-exchange-bonus',
    category: 'Feedback & Review Manipulation',
    riskLevel: 'high',
    pattern: /\b(?:for\s+a\s+5\s*star|in\s+exchange\s+for\s+(?:a\s+)?(?:review|rating)|free\s+(?:bonus|work)\s+if\s+you\s+(?:review|rate))\b/i,
    explanation: 'Incentivizing reviews with discounts, free bonuses, or reciprocal reviews is strictly prohibited.',
    suggestion: 'Deliver work based purely on agreed project scope without contingent review conditions.'
  },

  // 5. Prohibited Academic Work
  {
    id: 'prohibited-academic',
    category: 'Prohibited Academic Work',
    riskLevel: 'high',
    pattern: /\b(?:write\s+(?:my|an?)\s*(?:essay|thesis|dissertation|homework|exam|assignment)|take\s+(?:my\s+)?exam|do\s+my\s+homework)\b/i,
    explanation: 'Writing academic assignments, essays for university submission, or taking tests on a student\'s behalf is strictly banned on Fiverr.',
    suggestion: 'Offer proofreading, structural editing, or educational tutoring instead of authoring academic submissions.'
  },

  // 6. Context-dependent Informational warnings
  {
    id: 'contact-keyword-outside',
    category: 'Potential Ambiguity',
    riskLevel: 'medium',
    pattern: /\b(?:outside\s+(?:of\s+)?fiverr|off\s*site|off\s*platform|reach\s+me\s+at)\b/i,
    explanation: 'Phrases referencing taking conversations or delivery "outside" are high-priority flags for Fiverr\'s automated spam bot.',
    suggestion: 'Clarify that everything will remain securely on the Fiverr platform.'
  },
  {
    id: 'informational-cancel-order',
    category: 'Order Dispute Risk',
    riskLevel: 'low',
    pattern: /\b(?:cancel\s+(?:the\s+)?order|ask\s+for\s+(?:a\s+)?refund|chargeback)\b/i,
    explanation: 'Mentioning cancellations or refunds can alert customer support moderation algorithms.',
    suggestion: 'Propose a free revision or mutual resolution before initiating formal cancellation requests.'
  }
];

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'template-client-followup',
    name: 'Client Follow-Up (Polite & Safe)',
    category: 'Follow-Up',
    description: 'Check in on a pending client without sounding pushy or triggering spam filters.',
    content: `Hi there! Just following up to see if you had a chance to review the latest preview I sent over.

Please take your time to examine the details. If you have any questions or would like any adjustments made, feel free to let me know right here on Fiverr. Looking forward to your thoughts!`
  },
  {
    id: 'template-meeting-request',
    name: 'Consultation & Video Call Request',
    category: 'Meetings',
    description: 'Offer a video call safely using Fiverr\'s official integrated Zoom/Video call system.',
    content: `Hi! To make sure we align perfectly on all requirements for this project, I\'d be more than happy to jump on a quick consultation call.

Whenever you\'re available, we can initiate an official Fiverr Video Call directly from this chat window. What date and time works best for your schedule?`
  },
  {
    id: 'template-first-draft',
    name: 'First Draft Submission',
    category: 'Work in Progress',
    description: 'Share a progress draft with clear instructions for feedback on platform.',
    content: `Hi! I've completed the initial draft for your project and attached the preview files below for your review.

Please take a look and let me know if the direction aligns with your vision. I'm ready to incorporate your feedback and make revisions before we finalize the delivery.`
  },
  {
    id: 'template-delivery-message',
    name: 'Final Order Delivery Note',
    category: 'Deliveries',
    description: 'Professional delivery message that invites genuine feedback without asking for 5 stars.',
    content: `Hi! It was an absolute pleasure working on this project with you.

I have packaged and uploaded all final deliverables meeting the specifications we discussed. Please review the attached files at your convenience.

If everything looks great, please accept the delivery. If any adjustments are needed, click the "Request Revision" button and I will gladly assist. Thank you again!`
  },
  {
    id: 'template-revision-response',
    name: 'Revision Request Acceptance',
    category: 'Revisions',
    description: 'Confirm client revisions promptly with a cooperative and positive tone.',
    content: `Thank you for the detailed feedback! I have noted all your revision points regarding the layout and color adjustments.

I am working on updating the files now and will share the revised version shortly right here. Thanks for your patience!`
  },
  {
    id: 'template-external-refusal',
    name: 'Polite Refusal of External Contact',
    category: 'Safety Protection',
    description: 'Politely inform a client who asks for your WhatsApp/email that you must stay on Fiverr.',
    content: `Thank you so much for reaching out! In accordance with Fiverr's Terms of Service and to protect both of our accounts and payment security, I conduct all project communication, file sharing, and video calls exclusively here through Fiverr.

Please feel free to send any files or project questions right here in our message thread, and I'll be glad to help!`
  }
];

export function scanFiverrMessage(text: string): ScanResult {
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = text.length;

  if (!trimmed) {
    return {
      hasIssues: false,
      status: 'No Issues Detected by Current Rules',
      statusColor: 'text-slate-500 dark:text-slate-400',
      matches: [],
      scannedAt: new Date(),
      wordCount: 0,
      charCount: 0
    };
  }

  const matches: RuleMatch[] = [];

  for (const rule of FIVERR_RULES) {
    // Create a global copy of pattern to find all occurrences
    const flags = rule.pattern.flags.includes('g') ? rule.pattern.flags : rule.pattern.flags + 'g';
    const regex = new RegExp(rule.pattern.source, flags);

    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      if (rule.contextValidator && !rule.contextValidator(match, text)) {
        continue;
      }

      matches.push({
        ruleId: rule.id,
        category: rule.category,
        matchedText: match[0],
        index: match.index,
        length: match[0].length,
        riskLevel: rule.riskLevel,
        explanation: rule.explanation,
        suggestion: rule.suggestion
      });
    }
  }

  // Sort matches by position in text
  matches.sort((a, b) => a.index - b.index);

  // Deduplicate overlapping matches
  const filteredMatches: RuleMatch[] = [];
  let lastEnd = -1;
  for (const m of matches) {
    if (m.index >= lastEnd) {
      filteredMatches.push(m);
      lastEnd = m.index + m.length;
    }
  }

  const highCount = filteredMatches.filter(m => m.riskLevel === 'high').length;
  const mediumCount = filteredMatches.filter(m => m.riskLevel === 'medium').length;
  const lowCount = filteredMatches.filter(m => m.riskLevel === 'low').length;

  let status: ScanResult['status'] = 'No Issues Detected by Current Rules';
  let statusColor = 'text-emerald-600 dark:text-emerald-400';

  if (highCount > 0) {
    status = 'Review Needed';
    statusColor = 'text-rose-600 dark:text-rose-400';
  } else if (mediumCount > 0) {
    status = 'Potential Risk';
    statusColor = 'text-amber-600 dark:text-amber-400';
  } else if (lowCount > 0) {
    status = 'Informational';
    statusColor = 'text-sky-600 dark:text-sky-400';
  }

  return {
    hasIssues: filteredMatches.length > 0,
    status,
    statusColor,
    matches: filteredMatches,
    scannedAt: new Date(),
    wordCount,
    charCount
  };
}

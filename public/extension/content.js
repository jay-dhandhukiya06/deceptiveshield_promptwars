/**
 * DeceptiveShield - Content Script (Client-Side Detection Engine)
 * Manifest V3 compatible
 * 
 * Automatically scans the live page DOM for:
 * 1. Pre-checked checkboxes (Sneak-into-Basket add-ons, warranties, recurring enrollments)
 *    while intelligently skipping mandatory Terms of Service & Privacy Policy checkboxes.
 * 2. Visual warning borders & badges: "⚠️ Warning: Pre-selected Add-on Detected".
 * 3. Deceptive recurring fee copy (e.g., "renews at", "per month after", "billed annually", "auto-debit").
 * 4. Artificial urgency triggers (countdown timers, scarcity copy "only X left").
 * 5. Floating Action Button (FAB) titled "🛡️ Report Dark Pattern".
 */

(function () {
  'use strict';

  // Prevent duplicate initialization on same frame
  if (window.__DECEPTIVE_SHIELD_INITIALIZED__) {
    return;
  }
  window.__DECEPTIVE_SHIELD_INITIALIZED__ = true;

  // In-memory registry of detected dark patterns
  const detectionState = {
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString(),
    items: [],
    stats: {
      precheckedAddons: 0,
      recurringFees: 0,
      urgencyTriggers: 0,
      total: 0
    }
  };

  /**
   * Safe text normalization helper
   */
  function normalizeText(str) {
    return (str || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  /**
   * Intelligent Terms of Service / Privacy Policy Skip Detector
   * Analyzes element attributes, parent text, and associated labels
   */
  function isMandatoryLegalCheckbox(checkbox) {
    const legalKeywords = [
      'terms of service',
      'terms and conditions',
      'terms & conditions',
      'terms of use',
      'privacy policy',
      'privacy notice',
      'i agree to',
      'i accept the',
      'agree to the terms',
      'accept terms',
      'gdpr consent',
      'user agreement',
      'mandatory agreement'
    ];

    // 1. Gather all text associated with this checkbox
    let contextText = '';

    // ID / Name / Aria attributes
    contextText += ' ' + (checkbox.id || '');
    contextText += ' ' + (checkbox.name || '');
    contextText += ' ' + (checkbox.getAttribute('aria-label') || '');
    contextText += ' ' + (checkbox.getAttribute('title') || '');

    // Connected <label for="...">
    if (checkbox.id) {
      const explicitLabel = document.querySelector(`label[for="${CSS.escape(checkbox.id)}"]`);
      if (explicitLabel) {
        contextText += ' ' + explicitLabel.innerText;
      }
    }

    // Direct parent label or wrapper
    const parentLabel = checkbox.closest('label');
    if (parentLabel) {
      contextText += ' ' + parentLabel.innerText;
    }

    // Immediate parent element text
    if (checkbox.parentElement) {
      contextText += ' ' + checkbox.parentElement.innerText;
    }

    const normalized = normalizeText(contextText);

    // If it contains any legal phrase, verify it is truly a legal agreement
    for (const kw of legalKeywords) {
      if (normalized.includes(kw)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a checkbox looks like an optional paid add-on, insurance, or subscription
   */
  function getAddonDescription(checkbox) {
    let text = '';
    if (checkbox.id) {
      const explicitLabel = document.querySelector(`label[for="${CSS.escape(checkbox.id)}"]`);
      if (explicitLabel) text += ' ' + explicitLabel.innerText;
    }
    const parentLabel = checkbox.closest('label');
    if (parentLabel) text += ' ' + parentLabel.innerText;
    if (checkbox.parentElement) text += ' ' + checkbox.parentElement.innerText;

    const trimmed = text.replace(/\s+/g, ' ').trim();
    return trimmed.length > 0 ? trimmed.substring(0, 120) : 'Pre-selected optional checkout item';
  }

  /**
   * 1. Detect Pre-checked Checkboxes (Sneak-into-Basket)
   */
  function scanPrecheckedCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
      // Must be checked
      if (!checkbox.checked) {
        // If it was unchecked by user, remove our flagged styles if previously added
        if (checkbox.classList.contains('deceptiveshield-flagged-checkbox')) {
          checkbox.classList.remove('deceptiveshield-flagged-checkbox');
          const existingBadge = checkbox.parentElement?.querySelector('.deceptiveshield-addon-badge');
          if (existingBadge) existingBadge.remove();
        }
        return;
      }

      // Check if it is a mandatory Terms of Service / Privacy Policy
      if (isMandatoryLegalCheckbox(checkbox)) {
        // Intentionally skip!
        return;
      }

      // Don't re-flag if already flagged
      if (checkbox.classList.contains('deceptiveshield-flagged-checkbox')) {
        return;
      }

      const description = getAddonDescription(checkbox);

      // Flag visually with red warning border
      checkbox.classList.add('deceptiveshield-flagged-checkbox');

      // Inject warning badge: "⚠️ Warning: Pre-selected Add-on Detected"
      const badge = document.createElement('span');
      badge.className = 'deceptiveshield-addon-badge';
      badge.innerHTML = '⚠️ Warning: Pre-selected Add-on Detected';
      badge.setAttribute('role', 'alert');
      badge.setAttribute('title', 'This checkbox was automatically pre-ticked without your active consent, potentially adding unexpected costs.');

      // Safely insert badge next to the checkbox or its label
      const targetContainer = checkbox.closest('label') || checkbox.parentElement;
      if (targetContainer && !targetContainer.querySelector('.deceptiveshield-addon-badge')) {
        if (targetContainer === checkbox.parentElement) {
          checkbox.insertAdjacentElement('afterend', badge);
        } else {
          targetContainer.appendChild(badge);
        }
      }

      // Record in detection state
      detectionState.items.push({
        id: 'addon-' + Math.random().toString(36).substring(2, 9),
        type: 'prechecked_addon',
        category: 'Sneak-into-Basket Trap',
        title: 'Pre-selected Add-on Detected',
        snippet: description,
        timestamp: new Date().toLocaleTimeString(),
        severity: 'high',
        element: checkbox
      });
      detectionState.stats.precheckedAddons++;
    });
  }

  /**
   * 2. Detect Deceptive Recurring Fee Keywords
   */
  function scanRecurringFees() {
    const recurringPatterns = [
      /\brenews?\s+(at|for|every|monthly|annually|after)\b/i,
      /\bper\s+month\s+after\b/i,
      /\bbilled\s+(annually|monthly|weekly|quarterly|recurring)\b/i,
      /\bauto-?debit\b/i,
      /\bauto-?renew(al|s|ing)?\b/i,
      /\brecurring\s+(membership|subscription|charge|fee|billing)\b/i,
      /\$\d+(\.\d{2})?\s*\/\s*(mo|month|yr|year)\s+(after|thereafter)\b/i
    ];

    // Scan readable elements within checkout/cart/order containers or whole body
    const candidates = document.querySelectorAll('p, span, small, label, div, em, strong');

    candidates.forEach((el) => {
      // Skip our own injected elements
      if (el.closest('#deceptiveshield-fab-root') || el.closest('.deceptiveshield-addon-badge')) {
        return;
      }

      // Avoid duplicate marking
      if (el.classList.contains('deceptiveshield-flagged-recurring')) {
        return;
      }

      // Only inspect direct text leaf nodes to avoid wrapping giant parent containers
      const text = el.innerText || '';
      if (text.length < 5 || text.length > 400) return;

      for (const pattern of recurringPatterns) {
        if (pattern.test(text)) {
          el.classList.add('deceptiveshield-flagged-recurring');

          // Prepend small warning indicator tag if not present
          if (!el.querySelector('.deceptiveshield-recurring-tag')) {
            const tag = document.createElement('span');
            tag.className = 'deceptiveshield-recurring-tag';
            tag.innerHTML = '⚠️ Hidden Recurring Fee';
            tag.title = 'Deceptive subscription or auto-renewal language detected in fine print.';
            el.insertAdjacentElement('afterbegin', tag);
          }

          detectionState.items.push({
            id: 'recurring-' + Math.random().toString(36).substring(2, 9),
            type: 'recurring_fee',
            category: 'Hidden Subscription',
            title: 'Deceptive Recurring Fee Detected',
            snippet: text.substring(0, 140),
            timestamp: new Date().toLocaleTimeString(),
            severity: 'high',
            element: el
          });
          detectionState.stats.recurringFees++;
          break;
        }
      }
    });
  }

  /**
   * 3. Detect Artificial Urgency Triggers (Countdown Timers & Scarcity Copy)
   */
  function scanUrgencyTriggers() {
    const scarcityPatterns = [
      /\bonly\s+\d+\s+(left|in\s+stock|remaining|available)\b/i,
      /\bhigh\s+demand\b/i,
      /\bselling\s+fast\b/i,
      /\b\d+\s+people\s+(are\s+viewing|have\s+this\s+in\s+cart|bought\s+this)\b/i,
      /\balmost\s+gone\b/i,
      /\bcart\s+reserved\s+for\b/i,
      /\bexpires?\s+in\s+\d/i
    ];

    const elements = document.querySelectorAll('p, span, div, h2, h3, h4, strong, b');

    elements.forEach((el) => {
      if (el.closest('#deceptiveshield-fab-root') || el.closest('.deceptiveshield-addon-badge')) {
        return;
      }

      if (el.classList.contains('deceptiveshield-flagged-urgency')) {
        return;
      }

      const text = (el.innerText || '').trim();
      if (!text || text.length > 250) return;

      let matched = false;
      let matchedReason = '';

      // Check scarcity patterns
      for (const pattern of scarcityPatterns) {
        if (pattern.test(text)) {
          matched = true;
          matchedReason = 'Artificial Scarcity Pressure';
          break;
        }
      }

      // Check for countdown timer patterns (e.g., 04:59, 14m 32s) combined with urgency words
      const hasTimerDigits = /\b\d{1,2}:\d{2}\b/.test(text) || /\b\d{1,2}m\s+\d{1,2}s\b/.test(text);
      const hasUrgencyContext = /hurry|reserved|expire|held|hold|limited|rush/i.test(text) ||
                                el.id.toLowerCase().includes('timer') ||
                                el.className.toString().toLowerCase().includes('timer');

      if (!matched && hasTimerDigits && hasUrgencyContext) {
        matched = true;
        matchedReason = 'Artificial Countdown Timer';
      }

      if (matched) {
        el.classList.add('deceptiveshield-flagged-urgency');

        if (!el.querySelector('.deceptiveshield-urgency-tag')) {
          const tag = document.createElement('span');
          tag.className = 'deceptiveshield-urgency-tag';
          tag.innerHTML = '⚠️ Pressure Pattern';
          tag.title = 'Artificial urgency or scarcity pattern designed to rush your buying decision.';
          el.insertAdjacentElement('afterbegin', tag);
        }

        detectionState.items.push({
          id: 'urgency-' + Math.random().toString(36).substring(2, 9),
          type: 'artificial_urgency',
          category: 'Urgency Trap',
          title: matchedReason,
          snippet: text.substring(0, 140),
          timestamp: new Date().toLocaleTimeString(),
          severity: 'medium',
          element: el
        });
        detectionState.stats.urgencyTriggers++;
      }
    });
  }

  /**
   * 4. Injects Fixed Floating Action Button (FAB) in Bottom-Right Corner
   */
  function injectReportFAB() {
    let fabRoot = document.getElementById('deceptiveshield-fab-root');
    if (!fabRoot) {
      fabRoot = document.createElement('div');
      fabRoot.id = 'deceptiveshield-fab-root';
      document.body.appendChild(fabRoot);
    }

    const totalCount = detectionState.items.length;

    fabRoot.innerHTML = `
      <div class="deceptiveshield-fab-tooltip">
        <strong>DeceptiveShield Scanner</strong><br/>
        ${totalCount === 0 
          ? 'No deceptive patterns detected yet. Click to inspect or submit a manual report.' 
          : `⚠️ Flagged ${totalCount} deceptive checkout trap${totalCount === 1 ? '' : 's'}. Click to view details and report.`}
      </div>
      <button type="button" class="deceptiveshield-fab-btn" id="deceptiveshield-fab-trigger">
        <span class="deceptiveshield-fab-icon">🛡️</span>
        <span>Report Dark Pattern</span>
        ${totalCount > 0 ? `<span class="deceptiveshield-fab-badge">${totalCount}</span>` : ''}
      </button>
    `;

    const btn = fabRoot.querySelector('#deceptiveshield-fab-trigger');
    if (btn) {
      btn.addEventListener('click', handleReportFABClick);
    }
  }

  /**
   * Handles click on the Floating Action Button
   * Captures current page URL, page title, and flagged issues in an alert box
   */
  function handleReportFABClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const currentUrl = window.location.href;
    const currentTitle = document.title || 'Untitled Page';
    const totalCount = detectionState.items.length;

    let issueDetails = '';
    if (totalCount === 0) {
      issueDetails = '• No obvious dark patterns automatically flagged at this time.\n  You can still submit suspicious deceptive behaviors.';
    } else {
      issueDetails = detectionState.items
        .map((item, index) => {
          return `${index + 1}. [${item.category}] ${item.title}\n   Snippet: "${item.snippet}"`;
        })
        .join('\n\n');
    }

    const reportMessage = 
      `🛡️ DECEPTIVESHIELD DARK PATTERN REPORT\n` +
      `--------------------------------------------------\n` +
      `Page Title : ${currentTitle}\n` +
      `Page URL   : ${currentUrl}\n` +
      `Timestamp  : ${new Date().toLocaleString()}\n` +
      `Issues Detected : ${totalCount}\n` +
      `--------------------------------------------------\n\n` +
      `FLAGGED ISSUES:\n${issueDetails}\n\n` +
      `[DeceptiveShield Protection Active]`;

    // Trigger native alert dialog as specified in user requirements
    alert(reportMessage);
  }

  /**
   * Main Scan Runner
   */
  function runDetection() {
    // Reset detection items list for clean re-scanning
    detectionState.items = [];
    detectionState.stats = {
      precheckedAddons: 0,
      recurringFees: 0,
      urgencyTriggers: 0,
      total: 0
    };
    detectionState.url = window.location.href;
    detectionState.title = document.title;
    detectionState.timestamp = new Date().toISOString();

    // Execute scans
    scanPrecheckedCheckboxes();
    scanRecurringFees();
    scanUrgencyTriggers();

    detectionState.stats.total = detectionState.items.length;

    // Inject / update FAB
    injectReportFAB();

    // Broadcast detection result to window for extension / simulator listeners
    window.dispatchEvent(
      new CustomEvent('deceptiveShieldScanComplete', {
        detail: { ...detectionState }
      })
    );

    return detectionState;
  }

  // Initial scan after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDetection);
  } else {
    runDetection();
  }

  // Observe dynamically added elements (for single-page checkout flows)
  let debounceTimeout = null;
  const observer = new MutationObserver((mutations) => {
    // Skip mutations caused by our own injected elements
    let isSelfMutation = true;
    for (const m of mutations) {
      if (
        m.target.id !== 'deceptiveshield-fab-root' &&
        !m.target.classList?.contains('deceptiveshield-addon-badge') &&
        !m.target.classList?.contains('deceptiveshield-recurring-tag') &&
        !m.target.classList?.contains('deceptiveshield-urgency-tag')
      ) {
        isSelfMutation = false;
        break;
      }
    }

    if (isSelfMutation) return;

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      runDetection();
    }, 400);
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });

  /**
   * Chrome Extension Message Listener
   * Allows popup.html to query live detection stats or trigger manual scans
   */
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'getDetectionStats') {
        sendResponse({
          success: true,
          data: {
            stats: detectionState.stats,
            items: detectionState.items.map(item => ({
              id: item.id,
              type: item.type,
              category: item.category,
              title: item.title,
              snippet: item.snippet,
              severity: item.severity,
              timestamp: item.timestamp
            })),
            url: window.location.href,
            title: document.title
          }
        });
      } else if (request.action === 'runManualScan') {
        const results = runDetection();
        sendResponse({
          success: true,
          data: {
            stats: results.stats,
            items: results.items.map(item => ({
              id: item.id,
              type: item.type,
              category: item.category,
              title: item.title,
              snippet: item.snippet,
              severity: item.severity,
              timestamp: item.timestamp
            })),
            url: window.location.href,
            title: document.title
          }
        });
      }
      return true; // Keep channel open for async response
    });
  }

  // Expose global helper for testing / workbench
  window.DeceptiveShield = {
    runDetection,
    getState: () => ({ ...detectionState }),
    report: handleReportFABClick
  };
})();

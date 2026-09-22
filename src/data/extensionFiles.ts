import { ExtensionFileItem } from '../types';

export const EXTENSION_FILES: ExtensionFileItem[] = [
  {
    name: 'manifest.json',
    path: 'manifest.json',
    language: 'json',
    description: 'Manifest V3 configuration declaring permissions, action popup, and content script triggers.',
    isMain: true,
    code: `{
  "manifest_version": 3,
  "name": "DeceptiveShield - Dark Pattern & Trap Detector",
  "version": "1.0.0",
  "description": "Real-time client-side detection of deceptive checkout traps, sneak-into-basket add-ons, hidden recurring fees, and artificial urgency.",
  "permissions": [
    "activeTab",
    "scripting"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "DeceptiveShield Status",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "css": ["content.css"],
      "run_at": "document_idle"
    }
  ]
}`
  },
  {
    name: 'content.js',
    path: 'content.js',
    language: 'javascript',
    description: 'Client-side detection engine: scans pre-checked boxes, recurring fine print, urgency cues & injects the Report FAB.',
    isMain: true,
    code: `/**
 * DeceptiveShield - Content Script (Client-Side Detection Engine)
 * Manifest V3 compatible
 */
(function () {
  'use strict';

  if (window.__DECEPTIVE_SHIELD_INITIALIZED__) return;
  window.__DECEPTIVE_SHIELD_INITIALIZED__ = true;

  const detectionState = {
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString(),
    items: [],
    stats: { precheckedAddons: 0, recurringFees: 0, urgencyTriggers: 0, total: 0 }
  };

  function normalizeText(str) {
    return (str || '').toLowerCase().replace(/\\s+/g, ' ').trim();
  }

  // Intelligently skip mandatory Legal/Privacy/Terms of Service checkboxes
  function isMandatoryLegalCheckbox(checkbox) {
    const legalKeywords = [
      'terms of service', 'terms and conditions', 'terms & conditions',
      'terms of use', 'privacy policy', 'privacy notice',
      'i agree to', 'i accept the', 'agree to the terms',
      'accept terms', 'gdpr consent', 'user agreement'
    ];

    let contextText = ' ' + (checkbox.id || '') + ' ' + (checkbox.name || '') +
      ' ' + (checkbox.getAttribute('aria-label') || '') + ' ' + (checkbox.getAttribute('title') || '');

    if (checkbox.id) {
      const explicitLabel = document.querySelector(\`label[for="\${CSS.escape(checkbox.id)}"]\`);
      if (explicitLabel) contextText += ' ' + explicitLabel.innerText;
    }
    const parentLabel = checkbox.closest('label');
    if (parentLabel) contextText += ' ' + parentLabel.innerText;
    if (checkbox.parentElement) contextText += ' ' + checkbox.parentElement.innerText;

    const normalized = normalizeText(contextText);
    return legalKeywords.some(kw => normalized.includes(kw));
  }

  function getAddonDescription(checkbox) {
    let text = '';
    if (checkbox.id) {
      const el = document.querySelector(\`label[for="\${CSS.escape(checkbox.id)}"]\`);
      if (el) text += ' ' + el.innerText;
    }
    const parent = checkbox.closest('label') || checkbox.parentElement;
    if (parent) text += ' ' + parent.innerText;
    return (text.replace(/\\s+/g, ' ').trim() || 'Pre-selected optional checkout item').substring(0, 120);
  }

  // 1. Detect Pre-checked Checkboxes (Sneak-into-Basket)
  function scanPrecheckedCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        if (checkbox.classList.contains('deceptiveshield-flagged-checkbox')) {
          checkbox.classList.remove('deceptiveshield-flagged-checkbox');
          const badge = checkbox.parentElement?.querySelector('.deceptiveshield-addon-badge');
          if (badge) badge.remove();
        }
        return;
      }

      if (isMandatoryLegalCheckbox(checkbox)) return;
      if (checkbox.classList.contains('deceptiveshield-flagged-checkbox')) return;

      const description = getAddonDescription(checkbox);
      checkbox.classList.add('deceptiveshield-flagged-checkbox');

      const badge = document.createElement('span');
      badge.className = 'deceptiveshield-addon-badge';
      badge.innerHTML = '⚠️ Warning: Pre-selected Add-on Detected';
      badge.setAttribute('role', 'alert');

      const target = checkbox.closest('label') || checkbox.parentElement;
      if (target && !target.querySelector('.deceptiveshield-addon-badge')) {
        if (target === checkbox.parentElement) {
          checkbox.insertAdjacentElement('afterend', badge);
        } else {
          target.appendChild(badge);
        }
      }

      detectionState.items.push({
        id: 'addon-' + Math.random().toString(36).substring(2, 9),
        type: 'prechecked_addon',
        category: 'Sneak-into-Basket Trap',
        title: 'Pre-selected Add-on Detected',
        snippet: description,
        timestamp: new Date().toLocaleTimeString(),
        severity: 'high'
      });
      detectionState.stats.precheckedAddons++;
    });
  }

  // 2. Detect Deceptive Recurring Fees
  function scanRecurringFees() {
    const patterns = [
      /\\brenews?\\s+(at|for|every|monthly|annually|after)\\b/i,
      /\\bper\\s+month\\s+after\\b/i,
      /\\bbilled\\s+(annually|monthly|weekly|quarterly|recurring)\\b/i,
      /\\bauto-?debit\\b/i,
      /\\bauto-?renew(al|s|ing)?\\b/i,
      /\\b(upi\\s*autopay|e-?mandate|auto-?mandate)\\b/i,
      /\\brecurring\\s+(membership|subscription|charge|fee|billing)\\b/i,
      /[₹$]\\s*\\d+(\\.\\d{2})?\\s*\\/\\s*(mo|month|yr|year)\\s+(after|thereafter)\\b/i
    ];

    const candidates = document.querySelectorAll('p, span, small, label, div, em, strong');
    candidates.forEach((el) => {
      if (el.closest('#deceptiveshield-fab-root') || el.closest('.deceptiveshield-addon-badge')) return;
      if (el.classList.contains('deceptiveshield-flagged-recurring')) return;

      const text = el.innerText || '';
      if (text.length < 5 || text.length > 400) return;

      for (const pattern of patterns) {
        if (pattern.test(text)) {
          el.classList.add('deceptiveshield-flagged-recurring');
          if (!el.querySelector('.deceptiveshield-recurring-tag')) {
            const tag = document.createElement('span');
            tag.className = 'deceptiveshield-recurring-tag';
            tag.innerHTML = '⚠️ Hidden Recurring Fee';
            el.insertAdjacentElement('afterbegin', tag);
          }

          detectionState.items.push({
            id: 'recurring-' + Math.random().toString(36).substring(2, 9),
            type: 'recurring_fee',
            category: 'Hidden Subscription',
            title: 'Deceptive Recurring Fee Detected',
            snippet: text.substring(0, 140),
            timestamp: new Date().toLocaleTimeString(),
            severity: 'high'
          });
          detectionState.stats.recurringFees++;
          break;
        }
      }
    });
  }

  // 3. Detect Artificial Urgency Triggers
  function scanUrgencyTriggers() {
    const scarcityPatterns = [
      /\\bonly\\s+\\d+\\s+(left|in\\s+stock|remaining|available)\\b/i,
      /\\bhigh\\s+demand\\b/i,
      /\\bselling\\s+fast\\b/i,
      /\\b\\d+\\s+people\\s+(are\\s+viewing|have\\s+this\\s+in\\s+cart)\\b/i,
      /\\bcart\\s+reserved\\s+for\\b/i,
      /\\bexpires?\\s+in\\s+\\d/i
    ];

    const elements = document.querySelectorAll('p, span, div, h2, h3, h4, strong, b');
    elements.forEach((el) => {
      if (el.closest('#deceptiveshield-fab-root') || el.closest('.deceptiveshield-addon-badge')) return;
      if (el.classList.contains('deceptiveshield-flagged-urgency')) return;

      const text = (el.innerText || '').trim();
      if (!text || text.length > 250) return;

      let matched = false;
      let matchedReason = '';

      for (const pattern of scarcityPatterns) {
        if (pattern.test(text)) {
          matched = true;
          matchedReason = 'Artificial Scarcity Pressure';
          break;
        }
      }

      const hasTimerDigits = /\\b\\d{1,2}:\\d{2}\\b/.test(text) || /\\b\\d{1,2}m\\s+\\d{1,2}s\\b/.test(text);
      const hasUrgencyContext = /hurry|reserved|expire|held|hold|limited/i.test(text) ||
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
          el.insertAdjacentElement('afterbegin', tag);
        }

        detectionState.items.push({
          id: 'urgency-' + Math.random().toString(36).substring(2, 9),
          type: 'artificial_urgency',
          category: 'Urgency Trap',
          title: matchedReason,
          snippet: text.substring(0, 140),
          timestamp: new Date().toLocaleTimeString(),
          severity: 'medium'
        });
        detectionState.stats.urgencyTriggers++;
      }
    });
  }

  // 4. Injects Floating Action Button (FAB)
  function injectReportFAB() {
    let fabRoot = document.getElementById('deceptiveshield-fab-root');
    if (!fabRoot) {
      fabRoot = document.createElement('div');
      fabRoot.id = 'deceptiveshield-fab-root';
      document.body.appendChild(fabRoot);
    }

    const totalCount = detectionState.items.length;
    fabRoot.innerHTML = \`
      <div class="deceptiveshield-fab-tooltip">
        <strong>DeceptiveShield Scanner</strong><br/>
        \${totalCount === 0 
          ? 'No deceptive patterns detected. Click to submit a manual report.' 
          : \`⚠️ Flagged \${totalCount} deceptive checkout trap\${totalCount === 1 ? '' : 's'}. Click to view details.\`}
      </div>
      <button type="button" class="deceptiveshield-fab-btn" id="deceptiveshield-fab-trigger">
        <span class="deceptiveshield-fab-icon">🛡️</span>
        <span>Report Dark Pattern</span>
        \${totalCount > 0 ? \`<span class="deceptiveshield-fab-badge">\${totalCount}</span>\` : ''}
      </button>
    \`;

    const btn = fabRoot.querySelector('#deceptiveshield-fab-trigger');
    if (btn) btn.addEventListener('click', handleReportFABClick);
  }

  function handleReportFABClick(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const currentUrl = window.location.href;
    const currentTitle = document.title || 'Untitled Page';
    const totalCount = detectionState.items.length;

    let issueDetails = totalCount === 0
      ? '• No dark patterns automatically flagged at this time.'
      : detectionState.items.map((it, idx) => \`\${idx + 1}. [\${it.category}] \${it.title}\\n   Snippet: "\${it.snippet}"\`).join('\\n\\n');

    const reportMessage =
      \`🛡️ DECEPTIVESHIELD DARK PATTERN REPORT\\n\` +
      \`--------------------------------------------------\\n\` +
      \`Page Title : \${currentTitle}\\n\` +
      \`Page URL   : \${currentUrl}\\n\` +
      \`Timestamp  : \${new Date().toLocaleString()}\\n\` +
      \`Issues Detected : \${totalCount}\\n\` +
      \`--------------------------------------------------\\n\\n\` +
      \`FLAGGED ISSUES:\\n\${issueDetails}\\n\\n\` +
      \`[DeceptiveShield Protection Active]\`;

    alert(reportMessage);
  }

  function runDetection() {
    detectionState.items = [];
    detectionState.stats = { precheckedAddons: 0, recurringFees: 0, urgencyTriggers: 0, total: 0 };
    detectionState.url = window.location.href;
    detectionState.title = document.title;

    scanPrecheckedCheckboxes();
    scanRecurringFees();
    scanUrgencyTriggers();

    detectionState.stats.total = detectionState.items.length;
    injectReportFAB();
    return detectionState;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDetection);
  } else {
    runDetection();
  }

  // Dynamic Mutation Observer for SPAs
  let debounceTimeout = null;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(runDetection, 400);
  });
  observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

  // Chrome Extension message listener for popup
  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'getDetectionStats' || request.action === 'runManualScan') {
        const res = request.action === 'runManualScan' ? runDetection() : detectionState;
        sendResponse({ success: true, data: { ...res } });
      }
      return true;
    });
  }

  window.DeceptiveShield = { runDetection, getState: () => ({ ...detectionState }), report: handleReportFABClick };
})();`
  },
  {
    name: 'content.css',
    path: 'content.css',
    language: 'css',
    description: 'Scoped UI styles for red warning borders, warning badges, highlighted recurring text, and the FAB button.',
    code: `/**
 * DeceptiveShield - Scoped Content Script Styles
 */
input[type="checkbox"].deceptiveshield-flagged-checkbox {
  outline: 2.5px solid #dc2626 !important;
  outline-offset: 2px !important;
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.25) !important;
  cursor: pointer !important;
}

.deceptiveshield-addon-badge {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  margin-left: 8px !important;
  margin-top: 4px !important;
  margin-bottom: 4px !important;
  padding: 3px 8px !important;
  background-color: #fef2f2 !important;
  border: 1px solid #f87171 !important;
  border-left: 3px solid #dc2626 !important;
  border-radius: 4px !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #991b1b !important;
  box-shadow: 0 1px 3px rgba(220, 38, 38, 0.1) !important;
  animation: deceptiveshieldFadeIn 0.25s ease-out !important;
}

.deceptiveshield-flagged-recurring {
  background-color: rgba(254, 242, 242, 0.85) !important;
  border: 1px dashed #ef4444 !important;
  border-radius: 4px !important;
  padding: 4px 8px !important;
}

.deceptiveshield-recurring-tag {
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  color: #b91c1c !important;
  background: #fee2e2 !important;
  padding: 2px 6px !important;
  border-radius: 3px !important;
  margin-right: 6px !important;
}

.deceptiveshield-flagged-urgency {
  border: 1.5px solid #f97316 !important;
  background-color: rgba(255, 247, 237, 0.85) !important;
  border-radius: 6px !important;
  padding: 4px 8px !important;
}

.deceptiveshield-urgency-tag {
  display: inline-flex !important;
  align-items: center !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  color: #c2410c !important;
  background: #ffedd5 !important;
  padding: 2px 6px !important;
  border-radius: 3px !important;
  margin-right: 6px !important;
}

#deceptiveshield-fab-root {
  position: fixed !important;
  bottom: 24px !important;
  right: 24px !important;
  z-index: 2147483647 !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}

.deceptiveshield-fab-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 10px 18px !important;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 9999px !important;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.4) !important;
  cursor: pointer !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  transition: all 0.2s ease !important;
}

.deceptiveshield-fab-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 14px 28px -4px rgba(15, 23, 42, 0.5) !important;
}

.deceptiveshield-fab-badge {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 20px !important;
  height: 20px !important;
  padding: 0 6px !important;
  background-color: #ef4444 !important;
  color: #ffffff !important;
  border-radius: 9999px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
}

.deceptiveshield-fab-tooltip {
  position: absolute !important;
  bottom: calc(100% + 10px) !important;
  right: 0 !important;
  width: 260px !important;
  background: #0f172a !important;
  color: #f8fafc !important;
  padding: 10px 12px !important;
  border-radius: 8px !important;
  font-size: 11.5px !important;
  line-height: 1.4 !important;
  opacity: 0 !important;
  transform: translateY(6px) !important;
  transition: all 0.2s ease !important;
  pointer-events: none !important;
}

#deceptiveshield-fab-root:hover .deceptiveshield-fab-tooltip {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

@keyframes deceptiveshieldFadeIn {
  from { opacity: 0; transform: translateY(-2px); }
  to { opacity: 1; transform: translateY(0); }
}`
  },
  {
    name: 'popup.html',
    path: 'popup.html',
    language: 'html',
    description: 'Modern extension popup interface with active status pill, live counters & manual scan.',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DeceptiveShield</title>
  <link rel="stylesheet" href="popup.css" />
</head>
<body>
  <div class="popup-container">
    <header class="header">
      <div class="brand">
        <div class="logo-icon">🛡️</div>
        <div class="brand-text">
          <h1 class="brand-title">DeceptiveShield</h1>
          <p class="brand-subtitle">Dark Pattern & Checkout Defense</p>
        </div>
      </div>
      <div class="status-pill" id="protection-status">
        <span class="status-dot"></span>
        <span class="status-label">ACTIVE</span>
      </div>
    </header>

    <section class="hero-card">
      <div class="hero-metric">
        <span class="metric-number" id="total-issues">0</span>
        <span class="metric-label">Traps Detected on Tab</span>
      </div>
      <button type="button" class="btn-scan" id="btn-scan">
        <span class="scan-icon" id="scan-icon">🔄</span>
        <span id="scan-btn-text">Run Manual Scan</span>
      </button>
    </section>

    <section class="categories-grid">
      <div class="category-card" id="card-addons">
        <div class="category-header">
          <span class="category-icon">☑️</span>
          <span class="category-count" id="count-addons">0</span>
        </div>
        <div class="category-name">Pre-checked Add-ons</div>
        <div class="category-sub">Sneak-into-basket</div>
      </div>

      <div class="category-card" id="card-recurring">
        <div class="category-header">
          <span class="category-icon">🔄</span>
          <span class="category-count" id="count-recurring">0</span>
        </div>
        <div class="category-name">Recurring Fees</div>
        <div class="category-sub">Hidden auto-debits</div>
      </div>

      <div class="category-card" id="card-urgency">
        <div class="category-header">
          <span class="category-icon">⏳</span>
          <span class="category-count" id="count-urgency">0</span>
        </div>
        <div class="category-name">Urgency Triggers</div>
        <div class="category-sub">Timers & scarcity copy</div>
      </div>
    </section>

    <section class="issues-section">
      <div class="section-title-row">
        <h2 class="section-title">Flagged Elements</h2>
        <span class="badge-tab-url" id="tab-domain">active-tab</span>
      </div>
      <div class="issues-list" id="issues-list">
        <div class="empty-state" id="empty-state">
          <span class="empty-icon">✅</span>
          <p class="empty-text">No deceptive traps flagged on this tab yet.</p>
        </div>
      </div>
    </section>

    <footer class="footer">
      <button type="button" class="btn-report-all" id="btn-report-all">
        📢 Submit Incident Report
      </button>
      <div class="version-tag">Manifest V3 • DeceptiveShield Engine v1.0</div>
    </footer>
  </div>
  <script src="popup.js"></script>
</body>
</html>`
  },
  {
    name: 'popup.js',
    path: 'popup.js',
    language: 'javascript',
    description: 'Popup logic: connects to active Chrome tab, queries content script, updates counters and executes manual scans.',
    code: `/**
 * DeceptiveShield - Extension Popup Script
 */
document.addEventListener('DOMContentLoaded', () => {
  const totalIssuesEl = document.getElementById('total-issues');
  const countAddonsEl = document.getElementById('count-addons');
  const countRecurringEl = document.getElementById('count-recurring');
  const countUrgencyEl = document.getElementById('count-urgency');
  const issuesListEl = document.getElementById('issues-list');
  const tabDomainEl = document.getElementById('tab-domain');
  const btnScan = document.getElementById('btn-scan');
  const scanIcon = document.getElementById('scan-icon');
  const scanBtnText = document.getElementById('scan-btn-text');
  const btnReportAll = document.getElementById('btn-report-all');

  let currentTabId = null;
  let cachedIssues = [];
  let cachedTabUrl = '';
  let cachedTabTitle = '';

  function getDomain(urlString) {
    try {
      return new URL(urlString).hostname;
    } catch {
      return 'active-tab';
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  function renderIssues(items) {
    cachedIssues = items || [];
    issuesListEl.innerHTML = '';

    if (!items || items.length === 0) {
      issuesListEl.innerHTML = \`
        <div class="empty-state">
          <span class="empty-icon">🛡️</span>
          <p class="empty-text">No deceptive dark patterns detected on this page.</p>
        </div>
      \`;
      return;
    }

    items.forEach((item) => {
      const el = document.createElement('div');
      let typeClass = '';
      if (item.type === 'recurring_fee') typeClass = 'recurring';
      if (item.type === 'artificial_urgency') typeClass = 'urgency';

      el.className = \`issue-item \${typeClass}\`;
      el.innerHTML = \`
        <div class="issue-header">
          <span class="issue-type">\${escapeHtml(item.title || item.category)}</span>
          <span class="issue-severity">\${escapeHtml(item.severity || 'flagged')}</span>
        </div>
        <div class="issue-snippet">"\${escapeHtml(item.snippet)}"</div>
      \`;
      issuesListEl.appendChild(el);
    });
  }

  function updateUI(data) {
    if (!data) return;
    const stats = data.stats || { total: 0, precheckedAddons: 0, recurringFees: 0, urgencyTriggers: 0 };
    totalIssuesEl.textContent = stats.total ?? 0;
    countAddonsEl.textContent = stats.precheckedAddons ?? 0;
    countRecurringEl.textContent = stats.recurringFees ?? 0;
    countUrgencyEl.textContent = stats.urgencyTriggers ?? 0;

    if (data.url) {
      cachedTabUrl = data.url;
      tabDomainEl.textContent = getDomain(data.url);
    }
    if (data.title) cachedTabTitle = data.title;
    renderIssues(data.items);
  }

  function fetchTabStats(isManualScan = false) {
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) return;
        const activeTab = tabs[0];
        currentTabId = activeTab.id;
        cachedTabUrl = activeTab.url || '';
        cachedTabTitle = activeTab.title || 'Untitled';
        tabDomainEl.textContent = getDomain(cachedTabUrl);

        const actionName = isManualScan ? 'runManualScan' : 'getDetectionStats';
        chrome.tabs.sendMessage(currentTabId, { action: actionName }, (response) => {
          if (response?.success && response.data) {
            updateUI(response.data);
          }
        });
      });
    }
  }

  btnScan.addEventListener('click', () => {
    scanIcon.classList.add('spinning');
    scanBtnText.textContent = 'Scanning...';
    btnScan.disabled = true;

    fetchTabStats(true);
    setTimeout(() => {
      scanIcon.classList.remove('spinning');
      scanBtnText.textContent = 'Run Manual Scan';
      btnScan.disabled = false;
    }, 600);
  });

  btnReportAll.addEventListener('click', () => {
    const reportText = \`🛡️ DECEPTIVESHIELD INCIDENT REPORT\\nTarget: \${cachedTabUrl}\\nIssues: \${cachedIssues.length}\`;
    alert(reportText);
  });

  fetchTabStats(false);
});`
  },
  {
    name: 'dummy_checkout.html',
    path: 'dummy_checkout.html',
    language: 'html',
    description: 'Realistic e-commerce checkout page with boAt headphones, sneaky ₹199 add-on, low-contrast 9px UPI e-Mandate fine print & timer.',
    isMain: true,
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NexusGear India • Secure Checkout</title>
  <style>
    /* Clean ecommerce checkout styles */
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f8fafc; padding: 24px; color: #0f172a; }
    .container { max-width: 860px; margin: 0 auto; }
    .banner { background: #fff7ed; border: 1px solid #fed7aa; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-weight: 500; color: #9a3412; }
    .timer { background: #c2410c; color: white; padding: 2px 6px; border-radius: 4px; font-weight: 700; }
    .grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
    .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    /* Trap Checkbox */
    .sneaky-box { background: #fafafa; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
    /* Deceptive 9px fine print */
    .deceptive-fine-print { font-size: 9px !important; color: #94a3b8 !important; margin-top: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Trap #1: Artificial Urgency & Countdown Timer (CCPA False Urgency) -->
    <div class="banner">
      🔥 High demand! Hurry, cart is reserved for <span class="timer" id="checkout-timer">04:59</span> minutes. Only 2 left in Bengaluru warehouse!
    </div>

    <div class="grid">
      <div>
        <div class="card">
          <h2>📦 Delivery & Payment</h2>
          <p style="color: #64748b; margin-top: 8px; font-weight: 600;">Aarav Sharma</p>
          <p style="color: #64748b; font-size: 13px;">Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103</p>
          <div style="margin-top: 12px; padding: 8px 12px; background: #f1f5f9; border-radius: 6px; font-size: 13px;">
            💳 Payment: <strong>UPI (Google Pay / PhonePe / Paytm)</strong> • aarav@okhdfcbank
          </div>
        </div>
      </div>

      <div>
        <div class="card">
          <h3>🛒 Order Summary</h3>
          <p><strong>boAt Rockerz Wireless Headphones</strong> - ₹2,499.00</p>
          <p style="color: #ea580c; font-size: 11px;">⚠️ Only 2 items remaining in stock!</p>
          <hr style="margin: 12px 0; border: none; border-top: 1px solid #e2e8f0;" />

          <!-- Trap #2 & #3: Basket Sneaking (₹199) & Low-Contrast Recurring Fine Print (₹499/mo UPI Autopay) -->
          <div class="sneaky-box">
            <label style="cursor: pointer; display: flex; align-items: flex-start; gap: 8px;">
              <input type="checkbox" id="express-addon" checked />
              <span><strong>Add Priority Courier & Transit Cover (+₹199.00)</strong></span>
            </label>
            <p class="deceptive-fine-print">
              Renews at ₹499/month VIP Club membership automatically debited via UPI Autopay / e-Mandate thereafter unless cancelled.
            </p>
          </div>

          <!-- Legitimate Terms Checkbox (Must NOT be flagged) -->
          <div style="margin-top: 14px;">
            <label style="font-size: 12px; color: #64748b; display: flex; gap: 8px;">
              <input type="checkbox" id="agree-terms" />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
          </div>

          <button style="width: 100%; margin-top: 16px; background: #059669; color: white; padding: 12px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
            Pay via UPI • ₹2,698.00
          </button>
        </div>
      </div>
    </div>
  </div>
  <script>
    let s = 299;
    setInterval(() => {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      document.getElementById('checkout-timer').textContent = 
        String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
      if (s > 0) s--; else s = 299;
    }, 1000);
  </script>
</body>
</html>`
  }
];

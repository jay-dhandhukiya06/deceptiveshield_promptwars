/**
 * DeceptiveShield - Extension Popup Script (Manifest V3)
 * Handles live data synchronization with the active tab's content script.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
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

  /**
   * Safe URL domain parser
   */
  function getDomain(urlString) {
    try {
      const url = new URL(urlString);
      return url.hostname;
    } catch {
      return 'active-tab';
    }
  }

  /**
   * Render detected issues into the list container
   */
  function renderIssues(items) {
    cachedIssues = items || [];
    issuesListEl.innerHTML = '';

    if (!items || items.length === 0) {
      issuesListEl.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🛡️</span>
          <p class="empty-text">No deceptive dark patterns detected on this page.</p>
        </div>
      `;
      return;
    }

    items.forEach((item) => {
      const el = document.createElement('div');
      let typeClass = '';
      if (item.type === 'recurring_fee') typeClass = 'recurring';
      if (item.type === 'artificial_urgency') typeClass = 'urgency';

      el.className = `issue-item ${typeClass}`;
      el.innerHTML = `
        <div class="issue-header">
          <span class="issue-type">${escapeHtml(item.title || item.category)}</span>
          <span class="issue-severity">${escapeHtml(item.severity || 'flagged')}</span>
        </div>
        <div class="issue-snippet" title="${escapeHtml(item.snippet)}">
          "${escapeHtml(item.snippet)}"
        </div>
      `;
      issuesListEl.appendChild(el);
    });
  }

  /**
   * Escape HTML helper
   */
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Update UI stats
   */
  function updateUI(data) {
    if (!data) return;

    const stats = data.stats || {
      total: 0,
      precheckedAddons: 0,
      recurringFees: 0,
      urgencyTriggers: 0
    };

    totalIssuesEl.textContent = stats.total ?? 0;
    countAddonsEl.textContent = stats.precheckedAddons ?? 0;
    countRecurringEl.textContent = stats.recurringFees ?? 0;
    countUrgencyEl.textContent = stats.urgencyTriggers ?? 0;

    if (data.url) {
      cachedTabUrl = data.url;
      tabDomainEl.textContent = getDomain(data.url);
      tabDomainEl.title = data.url;
    }

    if (data.title) {
      cachedTabTitle = data.title;
    }

    renderIssues(data.items);
  }

  /**
   * Connect to the active Chrome tab and fetch detection stats
   */
  function fetchTabStats(isManualScan = false) {
    // If running in real Chrome Extension environment
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) {
          showOfflineMessage('No active tab detected.');
          return;
        }

        const activeTab = tabs[0];
        currentTabId = activeTab.id;
        cachedTabUrl = activeTab.url || '';
        cachedTabTitle = activeTab.title || 'Untitled';
        tabDomainEl.textContent = getDomain(cachedTabUrl);

        // Check if on a browser internal page
        if (cachedTabUrl.startsWith('chrome://') || cachedTabUrl.startsWith('edge://') || cachedTabUrl.startsWith('about:')) {
          showOfflineMessage('Scanner inactive on internal browser pages.');
          return;
        }

        const actionName = isManualScan ? 'runManualScan' : 'getDetectionStats';

        chrome.tabs.sendMessage(currentTabId, { action: actionName }, (response) => {
          if (chrome.runtime.lastError) {
            // Script might not have executed yet; inject dynamically
            injectAndRetry(currentTabId, actionName);
            return;
          }

          if (response && response.success && response.data) {
            updateUI(response.data);
          }
        });
      });
    } else {
      // Fallback: Preview / Standalone mock test data
      tabDomainEl.textContent = 'dummy-checkout.local';
      updateUI({
        stats: { total: 3, precheckedAddons: 1, recurringFees: 1, urgencyTriggers: 1 },
        items: [
          {
            title: 'Pre-selected Add-on Detected',
            category: 'Sneak-into-Basket Trap',
            snippet: 'Priority Express Dispatch & Accidental Damage Protection (+$4.99)',
            severity: 'high',
            type: 'prechecked_addon'
          },
          {
            title: 'Deceptive Recurring Fee Detected',
            category: 'Hidden Subscription',
            snippet: 'Renews at $29/month auto-membership VIP Club thereafter. Auto-debit applies.',
            severity: 'high',
            type: 'recurring_fee'
          },
          {
            title: 'Artificial Countdown Timer',
            category: 'Urgency Trap',
            snippet: 'Hurry! Your cart is reserved for 04:47 minutes. Only 2 items left in stock!',
            severity: 'medium',
            type: 'artificial_urgency'
          }
        ],
        url: 'http://localhost:3000/dummy_checkout.html',
        title: 'NexusGear Audio - Checkout'
      });
    }
  }

  /**
   * Helper to inject content script on the fly if needed
   */
  function injectAndRetry(tabId, actionName) {
    if (!chrome.scripting) {
      showOfflineMessage('Please reload the webpage to activate DeceptiveShield.');
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ['content.js']
      },
      () => {
        if (chrome.runtime.lastError) {
          showOfflineMessage('Cannot inspect this page.');
          return;
        }

        chrome.scripting.insertCSS({
          target: { tabId },
          files: ['content.css']
        }, () => {
          setTimeout(() => {
            chrome.tabs.sendMessage(tabId, { action: actionName }, (res) => {
              if (res && res.data) {
                updateUI(res.data);
              }
            });
          }, 200);
        });
      }
    );
  }

  /**
   * Show error / offline note
   */
  function showOfflineMessage(msg) {
    totalIssuesEl.textContent = '-';
    issuesListEl.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">ℹ️</span>
        <p class="empty-text">${escapeHtml(msg)}</p>
      </div>
    `;
  }

  /**
   * Manual Scan Button Handler
   */
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

  /**
   * Incident Report Submission
   */
  btnReportAll.addEventListener('click', () => {
    const total = cachedIssues.length;
    const reportText = 
      `🛡️ DECEPTIVESHIELD INCIDENT REPORT\n` +
      `--------------------------------------------------\n` +
      `Target URL : ${cachedTabUrl || 'Active Tab'}\n` +
      `Page Title : ${cachedTabTitle || 'Unknown'}\n` +
      `Timestamp  : ${new Date().toISOString()}\n` +
      `Flagged Issues: ${total}\n` +
      `--------------------------------------------------\n\n` +
      cachedIssues.map((it, idx) => `${idx + 1}. [${it.category || it.type}] ${it.title}\n   Snippet: "${it.snippet}"`).join('\n\n');

    // Copy to clipboard or alert
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(reportText).then(() => {
        alert(`Incident report copied to clipboard!\n\n${total} issue(s) ready to submit.`);
      }).catch(() => {
        alert(reportText);
      });
    } else {
      alert(reportText);
    }
  });

  // Initial stats fetch
  fetchTabStats(false);
});

const mockDatabaseCache = {
  yellowKeywords: ['baker', 'thrift'],
  redKeywords: ['cheap', 'discount'],
  blackKeywords: ['win-free', 'upi-pay']
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url) {
    const url = tab.url.toLowerCase();

    if (mockDatabaseCache.blackKeywords.some(keyword => url.includes(keyword))) {
      triggerBlocker(tabId, 'BLACK', 'CRITICAL BLOCK: Verified Criminal UPI Trap/Phishing Clone Exposed.');
    } 
    else if (mockDatabaseCache.redKeywords.some(keyword => url.includes(keyword))) {
      triggerBlocker(tabId, 'RED', 'HIGH RISK: Aggressive high-pressure language or impossible pricing matrix detected.');
    } 
    else if (music = mockDatabaseCache.yellowKeywords.some(keyword => url.includes(keyword))) {
      triggerBlocker(tabId, 'YELLOW', 'SUSPICIOUS ALERT: Brand-new website (under 14 days old). We strongly advise using Cash on Delivery (COD).');
    }
  }
});

function triggerBlocker(tabId, tier, message) {
  try {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (tier, message) => {
        if (document.getElementById('scamshield-overlay')) return;

        const colors = {
          'YELLOW': '#f1c40f',
          'RED': '#e74c3c',
          'BLACK': '#1a1a2e'
        };

        const overlay = document.createElement('div');
        overlay.id = 'scamshield-overlay';
        overlay.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background-color: ' + colors[tier] + ' !important; color: white !important; z-index: 999999999 !important; display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; font-family: system-ui, sans-serif !important; padding: 20px !important; box-sizing: border-box !important; text-align: center !important;';

        let buttonHTML = '';
        if (tier !== 'BLACK') {
          buttonHTML = '<button id="scamshield-proceed" style="padding: 12px 24px; font-size: 1rem; cursor: pointer; border: none; background: white; color: black; border-radius: 8px; font-weight: 600;">I understand the risk, proceed</button>';
        } else {
          buttonHTML = '<b style="font-size: 1.2rem; letter-spacing: 0.5px;">This page has been completely frozen for your financial safety.</b>';
        }

        overlay.innerHTML = '<div style="background: rgba(0,0,0,0.2); padding: 40px; border-radius: 16px; max-width: 600px;"><h1 style="font-size: 2.5rem; margin: 0 0 20px 0; font-weight: 700;">🛡️ ScamShield AI Activated</h1><p style="font-size: 1.3rem; line-height: 1.5; margin: 0 0 30px 0;">' + message + '</p>' + buttonHTML + '</div>';

        document.documentElement.appendChild(overlay);

        const proceedBtn = document.getElementById('scamshield-proceed');
        if (proceedBtn) {
          proceedBtn.addEventListener('click', () => {
            overlay.remove();
          });
        }
      },
      args: [tier, message]
    }).catch(err => console.log("Handled layout frame catch: ", err.message));
  } catch (e) {
    console.log("System page block injection skipped.");
  }
}

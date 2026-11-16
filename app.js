/**
 * Mythic AI — @Krithik__naik & @SacredLoreOfficial Scripts Controller
 * Clean, lightweight, zero legacy identifiers.
 */

// YouTube Live Subscriber Count Configuration
// Replace apiKey with your free Google YouTube Data API v3 key for 24/7 live sync
const YOUTUBE_CONFIG = {
  apiKey: '', // Optional: Paste your YouTube Data API v3 key here
  channels: {
    krithik: {
      channelId: 'UC06JLRNZpgZygs-5vpynW2Q',
      handle: '@Krithik__naik',
      elementId: 'subsKrithik',
      fallback: 221
    },
    sacredLore: {
      channelId: 'UCGhTVUoHth5s1dhzBlgD8rw',
      handle: '@SacredLoreOfficial',
      elementId: 'subsSacredLore',
      fallback: 22
    }
  }
};

let currentPromptKey = 'doc2'; // doc2 = ChatGPT Story Script, doc1 = Gemini Video Script

document.addEventListener('DOMContentLoaded', () => {
  initPromptReader();
  fetchLiveSubscribers();
});

// Smooth Animated Number Counter
function animateCounter(element, targetValue, duration = 1200) {
  if (!element) return;
  const target = parseInt(targetValue, 10);
  if (isNaN(target)) {
    element.textContent = targetValue;
    return;
  }
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(easeOut * target);
    element.textContent = current.toLocaleString();
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  }
  requestAnimationFrame(update);
}

// Fetch live subscriber counts via YouTube Data API v3
async function fetchLiveSubscribers() {
  const { apiKey, channels } = YOUTUBE_CONFIG;

  // Animate initial verified live counts
  animateCounter(document.getElementById(channels.krithik.elementId), channels.krithik.fallback);
  animateCounter(document.getElementById(channels.sacredLore.elementId), channels.sacredLore.fallback);

  if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
    return;
  }

  try {
    const ids = [channels.krithik.channelId, channels.sacredLore.channelId].join(',');
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${ids}&key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`YouTube API returned ${response.status}`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      data.items.forEach(item => {
        const count = item.statistics?.subscriberCount;
        if (!count) return;

        if (item.id === channels.krithik.channelId) {
          animateCounter(document.getElementById(channels.krithik.elementId), count);
        } else if (item.id === channels.sacredLore.channelId) {
          animateCounter(document.getElementById(channels.sacredLore.elementId), count);
        }
      });
    }
  } catch (err) {
    console.warn('Real-time subscriber fetch error (using verified fallback):', err);
  }
}

// Toast notification system
function showToast(message, icon = '✓') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="font-size: 1.25rem; color: #F59E0B;">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
}

// Clipboard copy helper
async function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    showToast(successMessage, '📋');
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    showToast('Failed to copy. Please select and copy manually.', '⚠️');
    return false;
  }
}

// Download helper
function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}`, '⬇️');
}

// Switch between ChatGPT Story Script and Gemini Video Script
function switchScript(docKey) {
  currentPromptKey = docKey;
  const tabDoc1 = document.getElementById('tabDoc1');
  const tabDoc2 = document.getElementById('tabDoc2');

  const pill1 = tabDoc1?.querySelector('.tab-status-pill');
  const pill2 = tabDoc2?.querySelector('.tab-status-pill');

  if (docKey === 'doc1') {
    tabDoc1?.classList.add('active');
    tabDoc2?.classList.remove('active');
    if (pill1) pill1.textContent = 'Active Script';
    if (pill2) pill2.textContent = 'Click to View';
  } else {
    tabDoc2?.classList.add('active');
    tabDoc1?.classList.remove('active');
    if (pill2) pill2.textContent = 'Active Script';
    if (pill1) pill1.textContent = 'Click to View';
  }

  renderActivePrompt();
}

// Render active prompt in reader
function renderActivePrompt() {
  if (!window.PROMPTS_DATA) return;
  const data = window.PROMPTS_DATA[currentPromptKey];
  if (!data) return;

  const promptTitleEl = document.getElementById('readerPromptTitle');
  const metaChars = document.getElementById('metaChars');
  const metaWords = document.getElementById('metaWords');
  const promptView = document.getElementById('promptContentView');

  if (promptTitleEl) {
    promptTitleEl.textContent = currentPromptKey === 'doc1' 
      ? 'Gemini Video Script — Autonomous 2D Animation MP4 Engine' 
      : 'ChatGPT Story Script — Hindu Mythology Researcher & Storyteller';
  }

  if (metaChars) metaChars.textContent = `${data.length.toLocaleString()} characters`;
  if (metaWords) metaWords.textContent = `${data.wordCount.toLocaleString()} words`;

  if (promptView) {
    promptView.textContent = data.fullText;
  }
}

// Prompt Reader Initialization
function initPromptReader() {
  const copyBtn = document.getElementById('btnCopyActivePrompt');
  const downloadBtn = document.getElementById('btnDownloadActivePrompt');

  copyBtn?.addEventListener('click', () => {
    const data = window.PROMPTS_DATA[currentPromptKey];
    if (data) {
      const name = currentPromptKey === 'doc1' ? 'Gemini Video Script' : 'ChatGPT Story Script';
      copyToClipboard(data.fullText, `Copied ${name} to clipboard!`);
    }
  });

  downloadBtn?.addEventListener('click', () => {
    const data = window.PROMPTS_DATA[currentPromptKey];
    if (data) {
      const filename = currentPromptKey === 'doc1' ? 'gemini-2d-video-script.txt' : 'chatgpt-mythology-story-script.txt';
      downloadTextFile(filename, data.fullText);
    }
  });

  renderActivePrompt();
}

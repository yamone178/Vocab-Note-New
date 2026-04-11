// Extension requests need HTTPS for SameSite=None cookies.
const API_BASE_URL = 'http://localhost:3000/api';
const EXTENSION_LOGIN_URL = `${API_BASE_URL}/auth/extension`;

document.addEventListener('DOMContentLoaded', async () => {
  const mainContainer = document.getElementById('mainContainer');
  const authContainer = document.getElementById('authContainer');
  const loginBtn = document.getElementById('loginBtn');
  const authEmail = document.getElementById('authEmail');
  const authPassword = document.getElementById('authPassword');
  const authStatus = document.getElementById('authStatus');
  const wordInput = document.getElementById('word');
  const categorySelect = document.getElementById('category');
  const definitionText = document.getElementById('definition');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');
  const logoutBtn = document.getElementById('logoutBtn');

  let sourceUrl = '';
  let authToken = '';

  const showAuth = (message) => {
    mainContainer.style.display = 'none';
    authContainer.style.display = 'block';
    if (message) {
      authStatus.textContent = message;
      authStatus.className = 'status error';
    } else {
      authStatus.textContent = '';
      authStatus.className = 'status';
    }
  };

  const setAuthToken = (token) => {
    authToken = token || '';
    chrome.storage.local.set({ authToken: authToken || '' });
  };

  const clearAuthToken = () => {
    authToken = '';
    chrome.storage.local.remove(['authToken']);
  };

  const authHeaders = (extraHeaders) => {
    const headers = { ...(extraHeaders || {}) };
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    return headers;
  };

  // Load the captured word and URL
  chrome.storage.local.get(['lastSelection', 'sourceUrl'], (data) => {
    if (data.lastSelection) {
      wordInput.value = data.lastSelection;
    }
    sourceUrl = data.sourceUrl || '';
  });

  // Also try to get current selection if opened manually
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    sourceUrl = tab.url;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString().trim(),
    }, (results) => {
      if (results && results[0] && results[0].result) {
        wordInput.value = results[0].result;
      }
    });
  }

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: authHeaders(),
      });

      if (response.status === 401) {
        clearAuthToken();
        showAuth('Please sign in to continue.');
        return;
      }

      if (response.ok) {
        const result = await response.json();
        const categories = result.data || [];
        const options = categories.map(cat => 
          `<option value="${cat.id}">${cat.name}</option>`
        ).join('');
        categorySelect.innerHTML = `<option value="">Default (General)</option>${options}`;
      }
    } catch (error) {
      console.warn('Error loading categories, using default');
    }
  };

  chrome.storage.local.get(['authToken'], (data) => {
    authToken = data.authToken || '';
    if (!authToken) {
      showAuth();
      return;
    }
    loadCategories();
  });

  logoutBtn.addEventListener('click', () => {
    clearAuthToken();
    showAuth();
  });

  loginBtn.addEventListener('click', async () => {
    const email = authEmail.value.trim();
    const password = authPassword.value;

    if (!email || !password) {
      authStatus.textContent = 'Email and password are required.';
      authStatus.className = 'status error';
      return;
    }

    loginBtn.disabled = true;
    authStatus.textContent = 'Signing in...';
    authStatus.className = 'status';

    try {
      const response = await fetch(EXTENSION_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        authStatus.textContent = errorData.message || 'Invalid credentials.';
        authStatus.className = 'status error';
        loginBtn.disabled = false;
        return;
      }

      const result = await response.json();
      if (!result?.token) {
        authStatus.textContent = 'Invalid response from server.';
        authStatus.className = 'status error';
        loginBtn.disabled = false;
        return;
      }

      setAuthToken(result.token);
      authContainer.style.display = 'none';
      mainContainer.style.display = 'flex';
      authStatus.textContent = '';
      authStatus.className = 'status';
      loginBtn.disabled = false;
      loadCategories();
    } catch (error) {
      authStatus.textContent = 'Could not connect to the server.';
      authStatus.className = 'status error';
      loginBtn.disabled = false;
    }
  });

  saveBtn.addEventListener('click', async () => {
    const word = wordInput.value.trim();
    const categoryId = categorySelect.value;
    const definition = definitionText.value.trim();

    if (!word) {
      statusDiv.textContent = 'Please provide a word.';
      statusDiv.className = 'status error';
      return;
    }

    saveBtn.disabled = true;
    statusDiv.textContent = 'Saving...';
    statusDiv.className = 'status';

    try {
      const payload = {
        word,
        definition,
        sourceUrl,
      };
      
      if (categoryId) {
        payload.categoryId = categoryId;
      }

      const response = await fetch(`${API_BASE_URL}/vocabularies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        clearAuthToken();
        showAuth('Please sign in to continue.');
        return;
      }

      if (response.ok) {
        statusDiv.textContent = 'Word saved successfully!';
        statusDiv.className = 'status success';
        setTimeout(() => window.close(), 1500);
      } else {
        const errorData = await response.json();
        statusDiv.textContent = `Error: ${errorData.message || 'Failed to save'}`;
        statusDiv.className = 'status error';
        saveBtn.disabled = false;
      }
    } catch (error) {
      statusDiv.textContent = 'Error: Could not connect to the server.';
      statusDiv.className = 'status error';
      saveBtn.disabled = false;
    }
  });
});

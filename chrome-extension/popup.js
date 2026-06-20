// Extension requests need HTTPS for SameSite=None cookies.
const API_BASE_URL = 'https://vocab-note.netlify.app/api';
const EXTENSION_LOGIN_URL = `${API_BASE_URL}/auth/extension`;
const EXTENSION_SIGNUP_URL = `${API_BASE_URL}/users`;

document.addEventListener('DOMContentLoaded', async () => {
  const mainContainer = document.getElementById('mainContainer');
  const authContainer = document.getElementById('authContainer');
  const signupContainer = document.getElementById('signupContainer');
  
  // Auth view elements
  const loginBtn = document.getElementById('loginBtn');
  const authEmail = document.getElementById('authEmail');
  const authPassword = document.getElementById('authPassword');
  const authStatus = document.getElementById('authStatus');
  const showSignup = document.getElementById('showSignup');
  
  // Signup view elements
  const signupBtn = document.getElementById('signupBtn');
  const signupName = document.getElementById('signupName');
  const signupEmail = document.getElementById('signupEmail');
  const signupPassword = document.getElementById('signupPassword');
  const signupProficiency = document.getElementById('signupProficiency');
  const signupStatus = document.getElementById('signupStatus');
  const showLogin = document.getElementById('showLogin');

  // Main view elements
  const wordInput = document.getElementById('word');
  const categorySelect = document.getElementById('category');
  const definitionText = document.getElementById('definition');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');
  const logoutBtn = document.getElementById('logoutBtn');
  const definitionTextarea = document.getElementById('definition');

  let sourceUrl = '';
  let authToken = '';

  if (definitionTextarea) {
    definitionTextarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
      if (this.scrollHeight > 150) {
        this.style.overflowY = 'auto';
      } else {
        this.style.overflowY = 'hidden';
      }
    });
  }

  const showAuth = (message) => {
    mainContainer.style.display = 'none';
    signupContainer.style.display = 'none';
    authContainer.style.display = 'block';
    if (message) {
      authStatus.textContent = message;
      authStatus.className = 'status error';
    } else {
      authStatus.textContent = '';
      authStatus.className = 'status';
    }
  };

  const showSignupView = () => {
    authContainer.style.display = 'none';
    signupContainer.style.display = 'block';
    signupStatus.textContent = '';
    signupStatus.className = 'status';
  };

  const showLoginView = () => {
    signupContainer.style.display = 'none';
    authContainer.style.display = 'block';
    authStatus.textContent = '';
    authStatus.className = 'status';
  };

  showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    showSignupView();
  });

  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginView();
  });
  
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
    try {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString().trim(),
      }, (results) => {
        if (chrome.runtime.lastError) {
          console.warn("Could not execute script, probably a protected page.");
          return;
        }
        if (results && results[0] && results[0].result) {
          wordInput.value = results[0].result;
        }
      });
    } catch (e) {
      console.warn("Error getting selection:", e);
    }
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
    mainContainer.style.display = 'flex';
    authContainer.style.display = 'none';
    signupContainer.style.display = 'none';
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
      signupContainer.style.display = 'none';
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
  
  signupBtn.addEventListener('click', async () => {
    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;
    const proficiency = signupProficiency.value;

    if (!name || !email || !password) {
      signupStatus.textContent = 'All fields are required.';
      signupStatus.className = 'status error';
      return;
    }
    
    signupBtn.disabled = true;
    signupStatus.textContent = 'Creating account...';
    signupStatus.className = 'status';

    try {
      const response = await fetch(EXTENSION_SIGNUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, proficiency }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        signupStatus.textContent = errorData.message || 'Could not create account.';
        signupStatus.className = 'status error';
        signupBtn.disabled = false;
        return;
      }

      // After successful signup, try to log in automatically
      authEmail.value = email;
      authPassword.value = password;
      await loginBtn.click();

    } catch (error) {
      signupStatus.textContent = 'Could not connect to the server.';
      signupStatus.className = 'status error';
      signupBtn.disabled = false;
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


// Extension requests need HTTPS for SameSite=None cookies.
// const API_BASE_URL = 'https://vocab-note.netlify.app/api';
// const EXTENSION_LOGIN_URL = `${API_BASE_URL}/auth/extension`;
// const EXTENSION_SIGNUP_URL = `${API_BASE_URL}/users`;

// Use the full absolute URL for the local development server
// const API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL = 'https://vocab-note.netlify.app/api';
const EXTENSION_LOGIN_URL = `${API_BASE_URL}/auth/extension`;
const EXTENSION_SIGNUP_URL = `${API_BASE_URL}/auth/signup`; // Corrected signup URL

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
    authContainer.style.display = 'flex'; // Use flex to show it
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
    signupContainer.style.display = 'flex'; // Use flex to show it
    signupStatus.textContent = '';
    signupStatus.className = 'status';
  };

  const showLoginView = () => {
    signupContainer.style.display = 'none';
    authContainer.style.display = 'flex'; // Use flex to show it
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
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      sourceUrl = tab.url;
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
    }
  } catch (e) {
    console.warn("Error getting selection:", e);
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
        let errorMsg = 'Invalid credentials.';
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMsg = errorData.message;
          } else if (typeof errorData === 'string') {
            errorMsg = errorData;
          } else {
            console.error("Unexpected error response format for login:", errorData);
          }
        } catch (jsonError) {
          console.error("Failed to parse error response JSON for login:", jsonError);
          errorMsg = 'Login failed: Invalid server response.';
        }
        authStatus.textContent = errorMsg;
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
      console.error('Login Fetch Error:', error);
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
      console.log('Attempting signup with:', { name, email, password, proficiency }); // Log data being sent
      const response = await fetch(EXTENSION_SIGNUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Pass confirmPassword as well, using the same password value for simplicity
        body: JSON.stringify({ name, email, password, confirmPassword: password, proficiency }),
      });

      console.log('Signup response received:', response.status, response.statusText);

      if (!response.ok) {
        let errorMsg = 'Could not create account.'; // Default error message
        try {
          const errorData = await response.json();
          console.log('Signup error response data:', errorData);
          // Try to extract specific error message, fallback to generic
          if (errorData && errorData.message) {
              errorMsg = errorData.message;
          } else if (errorData && errorData.errors && errorData.errors.root && errorData.errors.root.message) {
              errorMsg = errorData.errors.root.message;
          } else if (typeof errorData === 'string') { // Sometimes error is just a string
              errorMsg = errorData;
          } else {
              // If response is not JSON or has an unexpected structure
              console.error("Unexpected error response format during signup:", errorData);
          }
        } catch (jsonError) {
          // If response.json() fails, use a generic message
          console.error("Failed to parse error response JSON during signup:", jsonError);
          errorMsg = 'Signup failed: Invalid server response.';
        }
        
        signupStatus.textContent = errorMsg;
        signupStatus.className = 'status error';
        signupBtn.disabled = false; // Re-enable button on error
        console.log('Signup button re-enabled after error.');
        return;
      }

      const result = await response.json();
      console.log('Signup successful response:', result);
      signupStatus.textContent = result?.message || 'Account created! Now logging in...';
      signupStatus.className = 'status success';

      // After successful signup, try to log in automatically
      authEmail.value = email;
      authPassword.value = password;
      
      // A small delay to show success message before logging in
      setTimeout(() => {
        loginBtn.click();
      }, 1000);

    } catch (error) {
      console.error('Signup Fetch Error:', error);
      signupStatus.textContent = 'Could not connect to the server.';
      signupStatus.className = 'status error';
      signupBtn.disabled = false; // Re-enable button on catch error
      console.log('Signup button re-enabled after fetch error.');
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
      console.error('Save Fetch Error:', error);
      statusDiv.textContent = 'Error: Could not connect to the server.';
      statusDiv.className = 'status error';
      saveBtn.disabled = false;
    }
  });
});

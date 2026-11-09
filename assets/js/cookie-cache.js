/**
 * Sign Depot Creative Operations — Cookie & Local Cache Consent Engine
 * File: assets/js/cookie-cache.js
 * Manages cookie persistence, local data caching, and user consent banner/modal
 */

(function () {
  'use strict';

  // --- Cookie Helpers ---
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/; SameSite=Lax";
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  }

  function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
  }

  // --- Cache Engine ---
  const PmsCache = {
    KEY_REQUESTS: 'pms_cached_requests_v2',
    KEY_TIMESTAMP: 'pms_cached_requests_ts_v2',
    KEY_PREFS: 'pms_cookie_preferences',
    KEY_CONSENT: 'pms_cookie_consent',
    TTL_MS: 3 * 60 * 1000, // 3 minutes TTL for background revalidation

    isCachePermitted() {
      const prefs = this.getPreferences();
      return prefs ? prefs.cache === true : false;
    },

    isPreferencesPermitted() {
      const prefs = this.getPreferences();
      return prefs ? prefs.preferences === true : false;
    },

    getPreferences() {
      try {
        const stored = localStorage.getItem(this.KEY_PREFS);
        if (stored) return JSON.parse(stored);
      } catch (e) {}

      // Fallback check to cookie
      const c = getCookie(this.KEY_CONSENT);
      if (c === 'all') return { essential: true, cache: true, preferences: true };
      if (c === 'essential') return { essential: true, cache: false, preferences: false };
      return null;
    },

    saveConsent(prefs) {
      try {
        localStorage.setItem(this.KEY_PREFS, JSON.stringify(prefs));
        localStorage.setItem(this.KEY_CONSENT, prefs.cache ? 'all' : 'essential');
        localStorage.setItem('pms_cache_enabled', prefs.cache ? '1' : '0');
      } catch (e) {}

      setCookie(this.KEY_CONSENT, prefs.cache ? 'all' : 'essential', 365);
      setCookie('pms_cache_enabled', prefs.cache ? '1' : '0', 365);
      setCookie('pms_prefs_enabled', prefs.preferences ? '1' : '0', 365);

      if (!prefs.cache) {
        this.clearDataCache();
      }

      this.notifyApiConsent(prefs);
    },

    notifyApiConsent(prefs) {
      try {
        const apiUrl = window.PMS_API_URL || 'api.php';
        fetch(apiUrl + '?action=log_action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action_type: 'CONFIG',
            module: 'System Settings',
            description: `User configured cookie & local cache permissions (${prefs.cache ? 'All Enabled: High-Speed Cache + Preferences' : 'Essential Only'})`
          })
        }).catch(() => {});
      } catch (e) {}
    },

    getCachedRequests() {
      if (!this.isCachePermitted()) return null;
      try {
        const raw = sessionStorage.getItem(this.KEY_REQUESTS) || localStorage.getItem(this.KEY_REQUESTS);
        const ts = parseInt(sessionStorage.getItem(this.KEY_TIMESTAMP) || localStorage.getItem(this.KEY_TIMESTAMP) || '0', 10);
        if (raw && (Date.now() - ts < this.TTL_MS)) {
          return JSON.parse(raw);
        }
      } catch (e) {}
      return null;
    },

    setCachedRequests(data) {
      if (!this.isCachePermitted() || !Array.isArray(data)) return;
      try {
        const json = JSON.stringify(data);
        sessionStorage.setItem(this.KEY_REQUESTS, json);
        sessionStorage.setItem(this.KEY_TIMESTAMP, String(Date.now()));
      } catch (e) {}
    },

    invalidate() {
      try {
        sessionStorage.removeItem(this.KEY_REQUESTS);
        sessionStorage.removeItem(this.KEY_TIMESTAMP);
        localStorage.removeItem(this.KEY_REQUESTS);
        localStorage.removeItem(this.KEY_TIMESTAMP);
        sessionStorage.removeItem('pms_cached_requests');
        sessionStorage.removeItem('pms_cached_requests_ts');
        localStorage.removeItem('pms_cached_requests');
        localStorage.removeItem('pms_cached_requests_ts');
      } catch (e) {}
    },

    clearDataCache() {
      this.invalidate();
    },

    getCacheSizeKb() {
      let total = 0;
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('pms_')) {
            total += (k.length + (localStorage.getItem(k) || '').length) * 2;
          }
        }
        for (let i = 0; i < sessionStorage.length; i++) {
          const k = sessionStorage.key(i);
          if (k && k.startsWith('pms_')) {
            total += (k.length + (sessionStorage.getItem(k) || '').length) * 2;
          }
        }
      } catch (e) {}
      return Math.max(Math.round(total / 1024), 1);
    }
  };

  // --- UI Banner & Modal Manager ---
  const ConsentUI = {
    init() {
      // Never render cookie consent banner on login or auth screens
      const loc = (window.location.pathname || '').toLowerCase();
      if (
        loc.endsWith('login.php') ||
        loc.endsWith('/login') ||
        document.body.classList.contains('login-body') ||
        document.querySelector('.login-container')
      ) {
        return;
      }

      // Don't duplicate if already injected
      if (document.getElementById('pmsCookieConsentContainer')) return;

      const bannerHtml = `
      <div id="pmsCookieConsentContainer" class="pms-cookie-wrap" style="display:none;">
        <div class="pms-cookie-card">
          <!-- Top Row: Icon + Header + Close -->
          <div class="pms-cookie-header">
            <div class="pms-cookie-badge-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E60000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                <path d="M8.5 8.5v.01"></path>
                <path d="M16 15.5v.01"></path>
                <path d="M12 12v.01"></path>
                <path d="M11 17v.01"></path>
                <path d="M7 13v.01"></path>
              </svg>
            </div>
            <div class="pms-cookie-title-wrap">
              <div class="pms-cookie-tag">PERFORMANCE & PRIVACY</div>
              <h3 class="pms-cookie-title">Cookies & Browser Cache Permission</h3>
            </div>
          </div>

          <!-- Body Description -->
          <div class="pms-cookie-body">
            <p>
              Sign Depot uses <strong>essential session cookies</strong> to maintain secure logins and 
              <strong>local browser caching</strong> (LocalStorage & SessionStorage) to store project records and UI preferences. 
              Enabling cache speeds up page loads, prevents flicker, and allows instant offline viewing.
            </p>
          </div>

          <!-- Granular Details Drawer (Collapsible) -->
          <div id="pmsCookieDrawer" class="pms-cookie-drawer" style="display:none;">
            <div class="pms-cookie-option">
              <div class="pms-cookie-opt-left">
                <strong>Strictly Necessary Cookies</strong>
                <span>Required for secure authentication, CSRF safety, and access permissions.</span>
              </div>
              <div class="pms-cookie-opt-right">
                <span class="pms-cookie-pill-locked">Always Active</span>
              </div>
            </div>

            <div class="pms-cookie-option">
              <div class="pms-cookie-opt-left">
                <strong>High-Speed Local Cache (Recommended)</strong>
                <span>Caches requests and order records in browser memory for instant table rendering.</span>
              </div>
              <div class="pms-cookie-opt-right">
                <label class="pms-switch">
                  <input type="checkbox" id="chkConsentCache" checked>
                  <span class="pms-slider"></span>
                </label>
              </div>
            </div>

            <div class="pms-cookie-option">
              <div class="pms-cookie-opt-left">
                <strong>Workspace Display Preferences</strong>
                <span>Remembers sidebar collapse state, table rows per page, and active filter tabs.</span>
              </div>
              <div class="pms-cookie-opt-right">
                <label class="pms-switch">
                  <input type="checkbox" id="chkConsentPrefs" checked>
                  <span class="pms-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- Actions Footer -->
          <div class="pms-cookie-actions">
            <div class="pms-cookie-actions-left">
              <button type="button" id="btnPmsCookieToggleDetails" class="pms-btn-ghost">
                <span id="pmsCookieDetailsLabel">Customize Settings</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>
            <div class="pms-cookie-actions-right">
              <button type="button" id="btnPmsCookieEssential" class="pms-btn-secondary">Essential Only</button>
              <button type="button" id="btnPmsCookieAcceptAll" class="pms-btn-primary">Accept All & Enable Cache</button>
              <button type="button" id="btnPmsCookieSaveCustom" class="pms-btn-primary" style="display:none;">Save My Choices</button>
            </div>
          </div>
        </div>
      </div>
      `;

      document.body.insertAdjacentHTML('beforeend', bannerHtml);
      this.bindEvents();

      // Check if consent has already been made
      const existing = PmsCache.getPreferences();
      if (!existing) {
        setTimeout(() => {
          this.showBanner();
        }, 500);
      }
    },

    bindEvents() {
      const btnAcceptAll = document.getElementById('btnPmsCookieAcceptAll');
      const btnEssential = document.getElementById('btnPmsCookieEssential');
      const btnToggleDetails = document.getElementById('btnPmsCookieToggleDetails');
      const btnSaveCustom = document.getElementById('btnPmsCookieSaveCustom');
      const drawer = document.getElementById('pmsCookieDrawer');

      if (btnAcceptAll) {
        btnAcceptAll.addEventListener('click', () => {
          PmsCache.saveConsent({ essential: true, cache: true, preferences: true });
          this.hideBanner();
          this.showToast('✓ Cookies and high-speed cache enabled.');
        });
      }

      if (btnEssential) {
        btnEssential.addEventListener('click', () => {
          PmsCache.saveConsent({ essential: true, cache: false, preferences: false });
          this.hideBanner();
          this.showToast('✓ Essential cookies saved. Non-essential cache disabled.');
        });
      }

      if (btnToggleDetails) {
        btnToggleDetails.addEventListener('click', () => {
          const isHidden = drawer.style.display === 'none';
          drawer.style.display = isHidden ? 'block' : 'none';
          btnAcceptAll.style.display = isHidden ? 'none' : 'inline-flex';
          btnSaveCustom.style.display = isHidden ? 'inline-flex' : 'none';
          const label = document.getElementById('pmsCookieDetailsLabel');
          if (label) label.textContent = isHidden ? 'Hide Details' : 'Customize Settings';
        });
      }

      if (btnSaveCustom) {
        btnSaveCustom.addEventListener('click', () => {
          const chkCache = document.getElementById('chkConsentCache');
          const chkPrefs = document.getElementById('chkConsentPrefs');
          const prefs = {
            essential: true,
            cache: chkCache ? chkCache.checked : true,
            preferences: chkPrefs ? chkPrefs.checked : true
          };
          PmsCache.saveConsent(prefs);
          this.hideBanner();
          this.showToast('✓ Privacy and cache preferences saved.');
        });
      }
    },

    showBanner(openDetails = false) {
      const wrap = document.getElementById('pmsCookieConsentContainer');
      if (!wrap) return;
      wrap.style.display = 'block';
      wrap.classList.add('pms-cookie-visible');

      if (openDetails) {
        const drawer = document.getElementById('pmsCookieDrawer');
        const btnAcceptAll = document.getElementById('btnPmsCookieAcceptAll');
        const btnSaveCustom = document.getElementById('btnPmsCookieSaveCustom');
        const label = document.getElementById('pmsCookieDetailsLabel');
        if (drawer) drawer.style.display = 'block';
        if (btnAcceptAll) btnAcceptAll.style.display = 'none';
        if (btnSaveCustom) btnSaveCustom.style.display = 'inline-flex';
        if (label) label.textContent = 'Hide Details';

        const prefs = PmsCache.getPreferences();
        if (prefs) {
          const chkCache = document.getElementById('chkConsentCache');
          const chkPrefs = document.getElementById('chkConsentPrefs');
          if (chkCache) chkCache.checked = prefs.cache;
          if (chkPrefs) chkPrefs.checked = prefs.preferences;
        }
      }
    },

    hideBanner() {
      const wrap = document.getElementById('pmsCookieConsentContainer');
      if (!wrap) return;
      wrap.classList.remove('pms-cookie-visible');
      setTimeout(() => {
        wrap.style.display = 'none';
      }, 300);
    },

    showToast(msg) {
      if (typeof window.showToast === 'function') {
        window.showToast(msg);
      } else {
        const toast = document.createElement('div');
        toast.className = 'pms-cookie-toast';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 20);
        setTimeout(() => {
          toast.classList.remove('show');
          setTimeout(() => toast.remove(), 300);
        }, 3200);
      }
    }
  };

  // Expose globally
  window.PmsCache = PmsCache;
  window.SignDepotConsent = ConsentUI;
  window.setPmsCookie = setCookie;
  window.getPmsCookie = getCookie;
  window.deletePmsCookie = deleteCookie;

  // Auto-initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ConsentUI.init());
  } else {
    ConsentUI.init();
  }
})();


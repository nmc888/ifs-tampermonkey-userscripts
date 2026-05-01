// ==UserScript==
// @name         Nemuca Ltd - IFS Set Focus/Prepopulate field
// @namespace    http://nemuca.com
// @version      2026-03-31
// @description  Set Autofocus on IFS fields where not possible with Page Designer or 'initialfocus' customization.
// @author       Neil Carter (Nemuca Ltd)
// @match        https://*.ifs.cloud/*
// @icon         data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAQlBMVEVHcEzPDg7PDg7TDAzPDg7PDg7PDg7PDg7PDg7PDg7PDQ3PDg7PDg7PDQ3PDg7PDQ3PDg7PDg7PDg7PDg7PDg7PDg7kl/WXAAAAFXRSTlMA8EID+ZepWebSIjW/E4cLY1J5caKDX4LdAAAAxElEQVQ4y+1TyRaDIBAD2YalCKj//6u1w2IRvPfQ3CCZJMCDkAZmlpC836J9kQmY9Q74B1TLYCY0HBe4C70LU/roQeW3ybrBMcAt13yizZvzptC2+Zd5qsUWQpLVzpUUW/JdMAwDa2EuVlyLsrpasZhnAGsskPnuXMVVnptMdHkVCnvT08Kglqrbza0S5zwjEaVuuP62n/Dgfnib7KwNwQpcDYKcAZbstcz9+SohnwTiL/g5wf75jjATFMKqE3Hynx+JG96+xhv6LvXE5gAAAABJRU5ErkJggg==
// @grant        none
// ==/UserScript==


(function() {
  'use strict';

  // DEFINE YOUR CONFIG PARAMETERS HERE:
  // pagePattern URL regex match
  // selector = target field name from fnd-input-field-container element
  // value = string to prepopulate target field
  const FIELD_CONFIGS = [
    {
      pagePattern: /^https?:\/\/.*ifs\.cloud.*CreateServiceContract/,
      selector: '[data-fieldname="ContractName"] input',
      value: ''
    },
    {
       pagePattern: /^https?:\/\/.*ifs\.cloud.*NewContact/,
       selector: '[data-fieldname="PersonId"] input',
       value: 'Joe Bloggs'
    },

  ];

  let currentConfig = null;
  let observer = null;
  let lastHandledUrl = '';
  let lastHandledSelector = '';

  // Find matching config for current page
  const getMatchingConfig = () => {
    return FIELD_CONFIGS.find(config => config.pagePattern.test(location.href));
  };

  // Main function - tries to find the field and set its value
  const trySet = () => {
    // Look for the input field
    const input = document.querySelector(currentConfig.selector);

    // If field doesn't exist yet, return false and try again later
    if (!input) return false;

    // Prevent repeated focus/value reset on same page/field
    if (lastHandledUrl === location.href && lastHandledSelector === currentConfig.selector) {
      return true;
    }

    // Step 1: Cursor into field
    input.focus();

    // Only prepopulate if a value is configured and the field is currently empty
    if (currentConfig.value !== '' && !input.value) {
      // Step 2: Get the REAL "value" setter that Angular/React listens to
      // (normal input.value = 'text' often doesn't trigger framework updates)
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
      ).set;

      // Step 3: Use the real setter to change the value
      setter.call(input, currentConfig.value);

      // Step 4: Tell the page "user typed something" (input event)
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Step 5: Tell the page "user finished typing" (change event)
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    lastHandledUrl = location.href;
    lastHandledSelector = currentConfig.selector;

    // Stop watching once we've successfully handled this page/field
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    return true;
  };

  const startForCurrentPage = () => {
    // Find matching config for current page
    currentConfig = getMatchingConfig();

    // Only run if current URL matches any config pattern
    if (!currentConfig) {
      return;
    }

    // Step 1: Try once immediately (for page refresh)
    if (trySet()) {
      return;
    }

    // Step 2: Watch for new content (Angular rendering after page loads)
    observer = new MutationObserver(() => {
      // When something changes, try again
      trySet();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  startForCurrentPage();

  // Step 3: SPA navigation support (navigation without full page reload)
  // Tampermonkey provides window.onurlchange for Single Page Apps
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      lastHandledUrl = '';
      lastHandledSelector = '';

      if (observer) {
        observer.disconnect();
        observer = null;
      }

      startForCurrentPage();
    }
  }, 500);

})();
// i18n.js - Internationalization system
let currentLang = 'fr';
let translations = {};

async function loadLang(lang = 'fr') {
  try {
    const res = await fetch(`lang/${lang}.json`);
    translations = await res.json();
    currentLang = lang;
    localStorage.setItem('ecom_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    applyTranslations();
  } catch (err) {
    console.warn('Lang load failed', err);
  }
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key]) {
      el.placeholder = translations[key];
    }
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (translations[key]) {
      el.title = translations[key];
    }
  });
}

function t(key) {
  return translations[key] || key;
}

// utils.js - Utility functions
function formatCurrency(n) {
  const lang = localStorage.getItem('ecom_lang') || 'fr';
  const locale = lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-MA' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(n);
}

function formatDate(date) {
  const lang = localStorage.getItem('ecom_lang') || 'fr';
  const locale = lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-MA' : 'en-US';
  return new Intl.DateTimeFormat(locale).format(new Date(date));
}

function debounce(fn, ms = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function paginate(array, page = 1, perPage = 10) {
  const total = array.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return { data: array.slice(start, start + perPage), total, pages, page };
}

function exportCSV(filename, rows) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(',')].concat(
    rows.map(r => keys.map(k => `"${String(r[k] || '').replace(/"/g, '""')}"`).join(','))
  ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function sortArray(array, key, direction = 'asc') {
  const sorted = [...array];
  sorted.sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (direction === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
  return sorted;
}

// THEME HANDLER
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);

  const btn = document.getElementById("themeToggle");
  if (btn) {
    const lang = localStorage.getItem('ecom_lang') || 'fr';
    btn.textContent = saved === "dark" 
      ? (lang === 'fr' ? 'Mode clair' : lang === 'ar' ? 'الوضع الفاتح' : 'Light Mode')
      : (lang === 'fr' ? 'Mode sombre' : lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode');

    btn.addEventListener("click", () => {
      const current = localStorage.getItem("theme") || "light";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      const lang = localStorage.getItem('ecom_lang') || 'fr';
      btn.textContent = next === "dark"
        ? (lang === 'fr' ? 'Mode clair' : lang === 'ar' ? 'الوضع الفاتح' : 'Light Mode')
        : (lang === 'fr' ? 'Mode sombre' : lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode');
    });
  }
}

// Validation helpers
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRequired(value) {
  return value && value.trim().length > 0;
}

function showError(element, message) {
  const errorEl = element.nextElementSibling;
  if (errorEl && errorEl.classList.contains('error')) {
    errorEl.textContent = message;
    element.classList.add('error-input');
  }
}

function clearError(element) {
  const errorEl = element.nextElementSibling;
  if (errorEl && errorEl.classList.contains('error')) {
    errorEl.textContent = '';
    element.classList.remove('error-input');
  }
}

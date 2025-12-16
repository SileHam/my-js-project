// categories.js - CRUD UI for categories
let currentSort = { column: null, direction: 'asc' };

function initCategoriesPage() {
  renderCategories();

  document.getElementById('btnAdd').addEventListener('click', openAddModal);
  document.getElementById('cancelModal').addEventListener('click', closeModal);
  document.getElementById('categoryForm').addEventListener('submit', onSaveCategory);
  document.getElementById('exportCsv').addEventListener('click', () => {
    exportCSV('categories.csv', getAll('categories'));
  });

  const search = document.getElementById('search');
  search.addEventListener('input', debounce(renderCategories, 300));

  document.getElementById('perPage').addEventListener('change', () => {
    const url = new URL(location);
    url.searchParams.set('page', '1');
    location.href = url.toString();
  });

  // Sort handlers
  document.querySelectorAll('[data-sort]').forEach(th => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const column = th.getAttribute('data-sort');
      if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
      }
      renderCategories();
    });
  });

  setupValidation();
}

function setupValidation() {
  const nameInput = document.getElementById('c_name');
  nameInput.addEventListener('blur', () => validateField(nameInput, validateRequired));
  nameInput.addEventListener('input', () => clearError(nameInput));
}

function validateField(element, validator) {
  const value = element.value.trim();
  if (!validator(value)) {
    showError(element, t('msg_required'));
    return false;
  }
  clearError(element);
  return true;
}

function renderCategories() {
  const per = Number(document.getElementById('perPage').value || 10);
  const q = document.getElementById('search').value.trim().toLowerCase();
  let arr = getAll('categories');

  if (q) {
    arr = arr.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q)
    );
  }

  if (currentSort.column) {
    arr = sortArray(arr, currentSort.column, currentSort.direction);
  }

  const page = Number(new URLSearchParams(location.search).get('page') || 1);
  const pg = paginate(arr, page, per);

  const tbody = document.querySelector('#categoriesTable tbody');
  tbody.innerHTML = '';

  if (pg.data.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="4" style="text-align:center;padding:20px;">${t('msg_category_not_found')}</td>`;
    tbody.appendChild(tr);
  } else {
    pg.data.forEach(c => {
      const productCount = getAll('products').filter(p => p.categoryId === c.id).length;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.name}</td>
        <td>${c.description || '—'}</td>
        <td>${productCount}</td>
        <td>
          <a class="btn" href="categoryDetail.html?id=${c.id}">${t('btn_view')}</a>
          <button class="btn" data-id="${c.id}" data-act="edit">${t('btn_edit')}</button>
          <button class="btn danger" data-id="${c.id}" data-act="del">${t('btn_delete')}</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  renderPagination(pg.pages, pg.page);
  updateSortIndicators();
}

function updateSortIndicators() {
  document.querySelectorAll('[data-sort]').forEach(th => {
    th.textContent = th.textContent.replace(' ▲', '').replace(' ▼', '');
    if (th.getAttribute('data-sort') === currentSort.column) {
      th.textContent += currentSort.direction === 'asc' ? ' ▲' : ' ▼';
    }
  });
}

function renderPagination(totalPages, current) {
  const el = document.getElementById('pagination');
  el.innerHTML = '';
  if (totalPages === 0) return;

  if (current > 1) {
    const prev = document.createElement('button');
    prev.className = 'btn';
    prev.textContent = '‹';
    prev.addEventListener('click', () => {
      const u = new URL(location);
      u.searchParams.set('page', current - 1);
      location.href = u.toString();
    });
    el.appendChild(prev);
  }

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= current - 2 && i <= current + 2)) {
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = i;
      if (i === current) {
        b.style.fontWeight = '700';
        b.style.backgroundColor = 'var(--accent)';
        b.style.color = 'white';
      }
      b.addEventListener('click', () => {
        const u = new URL(location);
        u.searchParams.set('page', i);
        location.href = u.toString();
      });
      el.appendChild(b);
    } else if (i === current - 3 || i === current + 3) {
      const span = document.createElement('span');
      span.textContent = '...';
      span.style.padding = '8px';
      el.appendChild(span);
    }
  }

  if (current < totalPages) {
    const next = document.createElement('button');
    next.className = 'btn';
    next.textContent = '›';
    next.addEventListener('click', () => {
      const u = new URL(location);
      u.searchParams.set('page', current + 1);
      location.href = u.toString();
    });
    el.appendChild(next);
  }
}

function openAddModal() {
  document.getElementById('modalTitle').textContent = t('add_category');
  document.getElementById('categoryId').value = '';
  document.getElementById('c_name').value = '';
  document.getElementById('c_desc').value = '';
  document.getElementById('modal').classList.remove('hidden');
  clearAllErrors();
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  clearAllErrors();
}

function clearAllErrors() {
  document.querySelectorAll('.error-input').forEach(el => el.classList.remove('error-input'));
  document.querySelectorAll('.error').forEach(el => el.textContent = '');
}

function onSaveCategory(e) {
  e.preventDefault();
  clearAllErrors();

  const id = Number(document.getElementById('categoryId').value || 0);
  const name = document.getElementById('c_name').value.trim();
  const desc = document.getElementById('c_desc').value.trim();

  if (!validateField(document.getElementById('c_name'), validateRequired)) return;

  if (id) {
    update('categories', id, { name, description: desc });
    Swal.fire({
      icon: 'success',
      title: t('msg_update_success'),
      timer: 1500,
      showConfirmButton: false
    });
  } else {
    create('categories', { name, description: desc });
    Swal.fire({
      icon: 'success',
      title: t('msg_save_success'),
      timer: 1500,
      showConfirmButton: false
    });
  }
  closeModal();
  renderCategories();
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  const id = Number(b.dataset.id);
  const act = b.dataset.act;
  if (!id || !act) return;

  if (act === 'del') {
    const productCount = getAll('products').filter(p => p.categoryId === id).length;
    if (productCount > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: `Cette catégorie contient ${productCount} produit(s). Supprimez d'abord les produits.`
      });
      return;
    }
    Swal.fire({
      title: t('msg_confirm_delete'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('btn_confirm'),
      cancelButtonText: t('btn_cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        remove('categories', id);
        Swal.fire({
          icon: 'success',
          title: t('msg_delete_success'),
          timer: 1500,
          showConfirmButton: false
        });
        renderCategories();
      }
    });
  } else if (act === 'edit') {
    const c = getAll('categories').find(x => x.id === id);
    if (!c) return;
    document.getElementById('modalTitle').textContent = t('edit_category');
    document.getElementById('categoryId').value = c.id;
    document.getElementById('c_name').value = c.name;
    document.getElementById('c_desc').value = c.description || '';
    document.getElementById('modal').classList.remove('hidden');
    clearAllErrors();
  }
});


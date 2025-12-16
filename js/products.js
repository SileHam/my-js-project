// products.js - CRUD UI for products
let currentSort = { column: null, direction: 'asc' };

function initProductsPage() {
  populateCategoryFilters();
  renderProducts();

  document.getElementById('btnAdd').addEventListener('click', openAddModal);
  document.getElementById('cancelModal').addEventListener('click', closeModal);
  document.getElementById('productForm').addEventListener('submit', onSaveProduct);
  document.getElementById('exportCsv').addEventListener('click', () => {
    exportCSV('products.csv', getAll('products'));
  });

  const search = document.getElementById('search');
  search.addEventListener('input', debounce(renderProducts, 300));

  document.getElementById('filterCategory').addEventListener('change', renderProducts);
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
      renderProducts();
    });
  });

  // Real-time validation
  setupValidation();
}

function setupValidation() {
  const titleInput = document.getElementById('p_title');
  const skuInput = document.getElementById('p_sku');
  const priceInput = document.getElementById('p_price');
  const qtyInput = document.getElementById('p_qty');

  titleInput.addEventListener('blur', () => validateField(titleInput, validateRequired));
  skuInput.addEventListener('blur', () => validateField(skuInput, validateRequired));
  priceInput.addEventListener('blur', () => validateField(priceInput, (v) => !isNaN(v) && v >= 0));
  qtyInput.addEventListener('blur', () => validateField(qtyInput, (v) => !isNaN(v) && v >= 0 && Number.isInteger(Number(v))));

  titleInput.addEventListener('input', () => clearError(titleInput));
  skuInput.addEventListener('input', () => clearError(skuInput));
  priceInput.addEventListener('input', () => clearError(priceInput));
  qtyInput.addEventListener('input', () => clearError(qtyInput));
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

function populateCategoryFilters() {
  const sel = document.getElementById('filterCategory');
  const catSel = document.getElementById('p_cat');
  sel.innerHTML = `<option value="">${t('label_all_categories')}</option>`;
  catSel.innerHTML = '';
  getAll('categories').forEach(c => {
    const opt1 = document.createElement('option');
    opt1.value = c.id;
    opt1.textContent = c.name;
    sel.appendChild(opt1);
    const opt2 = document.createElement('option');
    opt2.value = c.id;
    opt2.textContent = c.name;
    catSel.appendChild(opt2);
  });
}

function renderProducts() {
  const per = Number(document.getElementById('perPage').value || 10);
  const q = document.getElementById('search').value.trim().toLowerCase();
  const catId = document.getElementById('filterCategory').value;
  let arr = getAll('products');

  // Search filter
  if (q) {
    arr = arr.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }

  // Category filter
  if (catId) {
    arr = arr.filter(p => String(p.categoryId) === String(catId));
  }

  // Sort
  if (currentSort.column) {
    arr = sortArray(arr, currentSort.column, currentSort.direction);
  }

  // Pagination
  const page = Number(new URLSearchParams(location.search).get('page') || 1);
  const pg = paginate(arr, page, per);

  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = '';

  if (pg.data.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="5" style="text-align:center;padding:20px;">${t('msg_product_not_found')}</td>`;
    tbody.appendChild(tr);
  } else {
    pg.data.forEach(p => {
      const cat = getAll('categories').find(c => c.id === p.categoryId);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.title}</td>
        <td>${formatCurrency(p.price)}</td>
        <td>${p.qty}</td>
        <td>${cat ? cat.name : '—'}</td>
        <td>
          <a class="btn" href="productDetail.html?id=${p.id}">${t('btn_view')}</a>
          <button class="btn" data-id="${p.id}" data-act="edit">${t('btn_edit')}</button>
          <button class="btn danger" data-id="${p.id}" data-act="del">${t('btn_delete')}</button>
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

  // Previous button
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

  // Page numbers
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

  // Next button
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
  document.getElementById('modalTitle').textContent = t('add_product');
  document.getElementById('productId').value = '';
  document.getElementById('p_title').value = '';
  document.getElementById('p_sku').value = '';
  document.getElementById('p_price').value = '';
  document.getElementById('p_qty').value = '';
  document.getElementById('p_desc').value = '';
  document.getElementById('p_cat').value = getAll('categories')[0]?.id || '';
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

function onSaveProduct(e) {
  e.preventDefault();
  clearAllErrors();

  const id = Number(document.getElementById('productId').value || 0);
  const title = document.getElementById('p_title').value.trim();
  const sku = document.getElementById('p_sku').value.trim();
  const price = Number(document.getElementById('p_price').value);
  const qty = Number(document.getElementById('p_qty').value);
  const desc = document.getElementById('p_desc').value.trim();
  const categoryId = Number(document.getElementById('p_cat').value || 0);

  // Validation
  let isValid = true;
  if (!validateField(document.getElementById('p_title'), validateRequired)) isValid = false;
  if (!validateField(document.getElementById('p_sku'), validateRequired)) isValid = false;
  if (!validateField(document.getElementById('p_price'), (v) => !isNaN(v) && v >= 0)) isValid = false;
  if (!validateField(document.getElementById('p_qty'), (v) => !isNaN(v) && v >= 0 && Number.isInteger(Number(v)))) isValid = false;

  if (!isValid) return;

  if (id) {
    update('products', id, { title, sku, price, qty, description: desc, categoryId });
    Swal.fire({
      icon: 'success',
      title: t('msg_update_success'),
      timer: 1500,
      showConfirmButton: false
    });
  } else {
    create('products', { title, sku, price, qty, description: desc, categoryId, rating: 0 });
    Swal.fire({
      icon: 'success',
      title: t('msg_save_success'),
      timer: 1500,
      showConfirmButton: false
    });
  }
  closeModal();
  renderProducts();
}

// Handle edit/delete buttons (event delegation)
document.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  const id = Number(b.dataset.id);
  const act = b.dataset.act;
  if (!id || !act) return;

  if (act === 'del') {
    Swal.fire({
      title: t('msg_confirm_delete'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('btn_confirm'),
      cancelButtonText: t('btn_cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        remove('products', id);
        Swal.fire({
          icon: 'success',
          title: t('msg_delete_success'),
          timer: 1500,
          showConfirmButton: false
        });
        renderProducts();
      }
    });
  } else if (act === 'edit') {
    const p = getAll('products').find(x => x.id === id);
    if (!p) return;
    document.getElementById('modalTitle').textContent = t('edit_product');
    document.getElementById('productId').value = p.id;
    document.getElementById('p_title').value = p.title;
    document.getElementById('p_sku').value = p.sku;
    document.getElementById('p_price').value = p.price;
    document.getElementById('p_qty').value = p.qty;
    document.getElementById('p_desc').value = p.description || '';
    document.getElementById('p_cat').value = p.categoryId;
    document.getElementById('modal').classList.remove('hidden');
    clearAllErrors();
  }
});

// reviews.js - CRUD UI for reviews
let currentSort = { column: null, direction: 'asc' };

function initReviewsPage() {
  renderReviews();

  document.getElementById('btnAdd').addEventListener('click', openAddModal);
  document.getElementById('cancelModal').addEventListener('click', closeModal);
  document.getElementById('reviewForm').addEventListener('submit', onSaveReview);
  document.getElementById('exportCsv').addEventListener('click', () => {
    exportCSV('reviews.csv', getAll('reviews'));
  });

  const search = document.getElementById('search');
  search.addEventListener('input', debounce(renderReviews, 300));

  document.getElementById('filterRating').addEventListener('change', renderReviews);
  document.getElementById('perPage').addEventListener('change', () => {
    const url = new URL(location);
    url.searchParams.set('page', '1');
    location.href = url.toString();
  });

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
      renderReviews();
    });
  });

  setupValidation();
}

function setupValidation() {
  const ratingInput = document.getElementById('r_rating');
  const commentInput = document.getElementById('r_comment');

  ratingInput.addEventListener('blur', () => validateField(ratingInput, (v) => !isNaN(v) && v >= 1 && v <= 5));
  commentInput.addEventListener('blur', () => validateField(commentInput, validateRequired));

  ratingInput.addEventListener('input', () => clearError(ratingInput));
  commentInput.addEventListener('input', () => clearError(commentInput));
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

function renderReviews() {
  const per = Number(document.getElementById('perPage').value || 10);
  const q = document.getElementById('search').value.trim().toLowerCase();
  const ratingFilter = document.getElementById('filterRating').value;
  let arr = getAll('reviews');

  if (q) {
    arr = arr.filter(r => {
      const product = getAll('products').find(p => p.id === r.productId);
      const user = getAll('users').find(u => u.id === r.userId);
      return (product && product.title.toLowerCase().includes(q)) ||
        (user && user.name.toLowerCase().includes(q)) ||
        (r.comment || '').toLowerCase().includes(q);
    });
  }

  if (ratingFilter) {
    arr = arr.filter(r => Number(r.rating) === Number(ratingFilter));
  }

  if (currentSort.column) {
    arr = sortArray(arr, currentSort.column, currentSort.direction);
  }

  const page = Number(new URLSearchParams(location.search).get('page') || 1);
  const pg = paginate(arr, page, per);

  const tbody = document.querySelector('#reviewsTable tbody');
  tbody.innerHTML = '';

  if (pg.data.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="5" style="text-align:center;padding:20px;">${t('msg_review_not_found')}</td>`;
    tbody.appendChild(tr);
  } else {
    pg.data.forEach(r => {
      const product = getAll('products').find(p => p.id === r.productId);
      const user = getAll('users').find(u => u.id === r.userId);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${product ? product.title : '—'}</td>
        <td>${user ? user.name : '—'}</td>
        <td>${'★'.repeat(Math.floor(r.rating))}${'☆'.repeat(5 - Math.floor(r.rating))} (${r.rating})</td>
        <td>${(r.comment || '').substring(0, 50)}${(r.comment || '').length > 50 ? '...' : ''}</td>
        <td>${formatDate(r.date)}</td>
        <td>
          <a class="btn" href="reviewDetail.html?id=${r.id}">${t('btn_view')}</a>
          <button class="btn" data-id="${r.id}" data-act="edit">${t('btn_edit')}</button>
          <button class="btn danger" data-id="${r.id}" data-act="del">${t('btn_delete')}</button>
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
  document.getElementById('modalTitle').textContent = t('add_review');
  document.getElementById('reviewId').value = '';
  document.getElementById('r_product').value = '';
  document.getElementById('r_user').value = '';
  document.getElementById('r_rating').value = '5';
  document.getElementById('r_comment').value = '';
  document.getElementById('modal').classList.remove('hidden');
  clearAllErrors();

  // Populate selects
  const productSelect = document.getElementById('r_product');
  productSelect.innerHTML = '';
  getAll('products').forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.title;
    productSelect.appendChild(opt);
  });

  const userSelect = document.getElementById('r_user');
  userSelect.innerHTML = '';
  getAll('users').forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.id;
    opt.textContent = u.name;
    userSelect.appendChild(opt);
  });
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  clearAllErrors();
}

function clearAllErrors() {
  document.querySelectorAll('.error-input').forEach(el => el.classList.remove('error-input'));
  document.querySelectorAll('.error').forEach(el => el.textContent = '');
}

function onSaveReview(e) {
  e.preventDefault();
  clearAllErrors();

  const id = Number(document.getElementById('reviewId').value || 0);
  const productId = Number(document.getElementById('r_product').value);
  const userId = Number(document.getElementById('r_user').value);
  const rating = Number(document.getElementById('r_rating').value);
  const comment = document.getElementById('r_comment').value.trim();

  let isValid = true;
  if (!validateField(document.getElementById('r_rating'), (v) => !isNaN(v) && v >= 1 && v <= 5)) isValid = false;
  if (!validateField(document.getElementById('r_comment'), validateRequired)) isValid = false;

  if (!isValid) return;

  if (id) {
    update('reviews', id, { productId, userId, rating, comment });
    Swal.fire({
      icon: 'success',
      title: t('msg_update_success'),
      timer: 1500,
      showConfirmButton: false
    });
  } else {
    create('reviews', {
      productId,
      userId,
      rating,
      comment,
      date: new Date().toISOString()
    });
    Swal.fire({
      icon: 'success',
      title: t('msg_save_success'),
      timer: 1500,
      showConfirmButton: false
    });
  }
  closeModal();
  renderReviews();
}

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
        remove('reviews', id);
        Swal.fire({
          icon: 'success',
          title: t('msg_delete_success'),
          timer: 1500,
          showConfirmButton: false
        });
        renderReviews();
      }
    });
  } else if (act === 'edit') {
    const r = getAll('reviews').find(x => x.id === id);
    if (!r) return;
    document.getElementById('modalTitle').textContent = t('edit_review');
    document.getElementById('reviewId').value = r.id;
    document.getElementById('r_product').value = r.productId;
    document.getElementById('r_user').value = r.userId;
    document.getElementById('r_rating').value = r.rating;
    document.getElementById('r_comment').value = r.comment || '';
    document.getElementById('modal').classList.remove('hidden');
    clearAllErrors();

    // Populate selects
    const productSelect = document.getElementById('r_product');
    productSelect.innerHTML = '';
    getAll('products').forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.title;
      if (p.id === r.productId) opt.selected = true;
      productSelect.appendChild(opt);
    });

    const userSelect = document.getElementById('r_user');
    userSelect.innerHTML = '';
    getAll('users').forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.id;
      opt.textContent = u.name;
      if (u.id === r.userId) opt.selected = true;
      userSelect.appendChild(opt);
    });
  }
});


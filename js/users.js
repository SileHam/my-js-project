// users.js - CRUD UI for users
let currentSort = { column: null, direction: 'asc' };

function initUsersPage() {
  renderUsers();

  document.getElementById('btnAdd').addEventListener('click', openAddModal);
  document.getElementById('cancelModal').addEventListener('click', closeModal);
  document.getElementById('userForm').addEventListener('submit', onSaveUser);
  document.getElementById('exportCsv').addEventListener('click', () => {
    exportCSV('users.csv', getAll('users'));
  });

  const search = document.getElementById('search');
  search.addEventListener('input', debounce(renderUsers, 300));

  document.getElementById('filterRole').addEventListener('change', renderUsers);
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
      renderUsers();
    });
  });

  setupValidation();
}

function setupValidation() {
  const nameInput = document.getElementById('u_name');
  const emailInput = document.getElementById('u_email');
  const passwordInput = document.getElementById('u_password');

  nameInput.addEventListener('blur', () => validateField(nameInput, validateRequired));
  emailInput.addEventListener('blur', () => validateField(emailInput, validateEmail));
  passwordInput.addEventListener('blur', () => {
    const id = Number(document.getElementById('userId').value || 0);
    if (!id) {
      validateField(passwordInput, (v) => v.length >= 3);
    }
  });

  nameInput.addEventListener('input', () => clearError(nameInput));
  emailInput.addEventListener('input', () => clearError(emailInput));
  passwordInput.addEventListener('input', () => clearError(passwordInput));
}

function validateField(element, validator) {
  const value = element.value.trim();
  if (!validator(value)) {
    showError(element, element.id === 'u_email' ? t('msg_invalid_email') : t('msg_required'));
    return false;
  }
  clearError(element);
  return true;
}

function renderUsers() {
  const per = Number(document.getElementById('perPage').value || 10);
  const q = document.getElementById('search').value.trim().toLowerCase();
  const roleFilter = document.getElementById('filterRole').value;
  let arr = getAll('users');

  if (q) {
    arr = arr.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }

  if (roleFilter) {
    arr = arr.filter(u => u.role === roleFilter);
  }

  if (currentSort.column) {
    arr = sortArray(arr, currentSort.column, currentSort.direction);
  }

  const page = Number(new URLSearchParams(location.search).get('page') || 1);
  const pg = paginate(arr, page, per);

  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = '';

  if (pg.data.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="4" style="text-align:center;padding:20px;">${t('msg_user_not_found')}</td>`;
    tbody.appendChild(tr);
  } else {
    pg.data.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td><span class="role-badge role-${u.role}">${t(`role_${u.role}`)}</span></td>
        <td>
          <a class="btn" href="userDetail.html?id=${u.id}">${t('btn_view')}</a>
          <button class="btn" data-id="${u.id}" data-act="edit">${t('btn_edit')}</button>
          <button class="btn danger" data-id="${u.id}" data-act="del">${t('btn_delete')}</button>
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
  document.getElementById('modalTitle').textContent = t('add_user');
  document.getElementById('userId').value = '';
  document.getElementById('u_name').value = '';
  document.getElementById('u_email').value = '';
  document.getElementById('u_password').value = '';
  document.getElementById('u_role').value = 'user';
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

function onSaveUser(e) {
  e.preventDefault();
  clearAllErrors();

  const id = Number(document.getElementById('userId').value || 0);
  const name = document.getElementById('u_name').value.trim();
  const email = document.getElementById('u_email').value.trim();
  const password = document.getElementById('u_password').value.trim();
  const role = document.getElementById('u_role').value;

  let isValid = true;
  if (!validateField(document.getElementById('u_name'), validateRequired)) isValid = false;
  if (!validateField(document.getElementById('u_email'), validateEmail)) isValid = false;
  if (!id && !validateField(document.getElementById('u_password'), (v) => v.length >= 3)) isValid = false;

  if (!isValid) return;

  if (id) {
    const updates = { name, email, role };
    if (password) updates.password = password;
    update('users', id, updates);
    Swal.fire({
      icon: 'success',
      title: t('msg_update_success'),
      timer: 1500,
      showConfirmButton: false
    });
  } else {
    create('users', { name, email, password, role });
    Swal.fire({
      icon: 'success',
      title: t('msg_save_success'),
      timer: 1500,
      showConfirmButton: false
    });
  }
  closeModal();
  renderUsers();
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  const id = Number(b.dataset.id);
  const act = b.dataset.act;
  if (!id || !act) return;

  if (act === 'del') {
    const session = getSession();
    if (id === session.id) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Vous ne pouvez pas supprimer votre propre compte'
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
        remove('users', id);
        Swal.fire({
          icon: 'success',
          title: t('msg_delete_success'),
          timer: 1500,
          showConfirmButton: false
        });
        renderUsers();
      }
    });
  } else if (act === 'edit') {
    const u = getAll('users').find(x => x.id === id);
    if (!u) return;
    document.getElementById('modalTitle').textContent = t('edit_user');
    document.getElementById('userId').value = u.id;
    document.getElementById('u_name').value = u.name;
    document.getElementById('u_email').value = u.email;
    document.getElementById('u_password').value = '';
    document.getElementById('u_role').value = u.role;
    document.getElementById('modal').classList.remove('hidden');
    clearAllErrors();
  }
});


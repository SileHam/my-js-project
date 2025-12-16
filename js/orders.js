// orders.js - CRUD UI for orders
let currentSort = { column: null, direction: 'asc' };

function initOrdersPage() {
  renderOrders();

  document.getElementById('btnAdd').addEventListener('click', openAddModal);
  document.getElementById('cancelModal').addEventListener('click', closeModal);
  document.getElementById('orderForm').addEventListener('submit', onSaveOrder);
  document.getElementById('exportCsv').addEventListener('click', () => {
    exportCSV('orders.csv', getAll('orders'));
  });

  const search = document.getElementById('search');
  search.addEventListener('input', debounce(renderOrders, 300));

  document.getElementById('filterStatus').addEventListener('change', renderOrders);
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
      renderOrders();
    });
  });
}

function renderOrders() {
  const per = Number(document.getElementById('perPage').value || 10);
  const q = document.getElementById('search').value.trim().toLowerCase();
  const statusFilter = document.getElementById('filterStatus').value;
  let arr = getAll('orders');

  if (q) {
    arr = arr.filter(o => {
      const user = getAll('users').find(u => u.id === o.userId);
      return String(o.id).includes(q) ||
        (user && user.name.toLowerCase().includes(q)) ||
        String(o.total).includes(q);
    });
  }

  if (statusFilter) {
    arr = arr.filter(o => o.status === statusFilter);
  }

  if (currentSort.column) {
    arr = sortArray(arr, currentSort.column, currentSort.direction);
  }

  const page = Number(new URLSearchParams(location.search).get('page') || 1);
  const pg = paginate(arr, page, per);

  const tbody = document.querySelector('#ordersTable tbody');
  tbody.innerHTML = '';

  if (pg.data.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="6" style="text-align:center;padding:20px;">${t('msg_order_not_found')}</td>`;
    tbody.appendChild(tr);
  } else {
    pg.data.forEach(o => {
      const user = getAll('users').find(u => u.id === o.userId);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#${o.id}</td>
        <td>${user ? user.name : '—'}</td>
        <td>${formatCurrency(o.total)}</td>
        <td><span class="status-badge status-${o.status}">${t(`status_${o.status}`)}</span></td>
        <td>${formatDate(o.date)}</td>
        <td>
          <a class="btn" href="orderDetail.html?id=${o.id}">${t('btn_view')}</a>
          <button class="btn" data-id="${o.id}" data-act="edit">${t('btn_edit')}</button>
          <button class="btn danger" data-id="${o.id}" data-act="del">${t('btn_delete')}</button>
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
  document.getElementById('modalTitle').textContent = t('add_order');
  document.getElementById('orderId').value = '';
  document.getElementById('o_user').value = '';
  document.getElementById('o_status').value = 'pending';
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function onSaveOrder(e) {
  e.preventDefault();
  const id = Number(document.getElementById('orderId').value || 0);
  const userId = Number(document.getElementById('o_user').value);
  const status = document.getElementById('o_status').value;
  const products = getAll('products');
  if (!products.length) {
    Swal.fire({ icon: 'error', title: 'Erreur', text: 'Aucun produit disponible' });
    return;
  }

  if (id) {
    update('orders', id, { userId, status });
    Swal.fire({
      icon: 'success',
      title: t('msg_update_success'),
      timer: 1500,
      showConfirmButton: false
    });
  } else {
    const item = { productId: products[0].id, qty: 1, price: products[0].price };
    create('orders', {
      userId,
      items: [item],
      total: item.price * item.qty,
      status,
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
  renderOrders();
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
        remove('orders', id);
        Swal.fire({
          icon: 'success',
          title: t('msg_delete_success'),
          timer: 1500,
          showConfirmButton: false
        });
        renderOrders();
      }
    });
  } else if (act === 'edit') {
    const o = getAll('orders').find(x => x.id === id);
    if (!o) return;
    document.getElementById('modalTitle').textContent = t('edit_order');
    document.getElementById('orderId').value = o.id;
    document.getElementById('o_user').value = o.userId;
    document.getElementById('o_status').value = o.status;
    document.getElementById('modal').classList.remove('hidden');
  }
});


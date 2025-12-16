// dashboard.js
let chartInstances = [];

function renderDashboard() {
  const products = getAll('products');
  const categories = getAll('categories');
  const users = getAll('users');
  const orders = getAll('orders');
  const reviews = getAll('reviews');

  // Destroy existing charts
  chartInstances.forEach(chart => chart.destroy());
  chartInstances = [];

  // KPI cards
  const kpis = document.getElementById('kpis');
  kpis.innerHTML = '';
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);
  const cards = [
    { title: t('kpi_products'), value: products.length },
    { title: t('kpi_categories'), value: categories.length },
    { title: t('kpi_users'), value: users.length },
    { title: t('kpi_orders'), value: orders.length },
    { title: t('kpi_revenue'), value: formatCurrency(totalRevenue) },
    { title: t('kpi_reviews'), value: reviews.length }
  ];
  cards.forEach(c => {
    const div = document.createElement('div');
    div.className = 'kpi card';
    div.innerHTML = `<h4>${c.title}</h4><p style="font-size:20px;font-weight:700">${c.value}</p>`;
    kpis.appendChild(div);
  });

  // Get filter values
  const periodFilter = document.getElementById('periodFilter')?.value || 'all';
  const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';

  // Filter orders by period
  let filteredOrders = [...orders];
  if (periodFilter !== 'all') {
    const now = new Date();
    filteredOrders = orders.filter(o => {
      const orderDate = new Date(o.date);
      switch (periodFilter) {
        case 'day':
          return orderDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        case 'month':
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        case 'year':
          return orderDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }

  // CHART 1: products by category (pie)
  const ctx1 = document.getElementById('chart1').getContext('2d');
  let prodByCat = categories.map(cat => ({
    name: cat.name,
    count: products.filter(p => p.categoryId === cat.id).length
  }));
  if (categoryFilter !== 'all') {
    prodByCat = prodByCat.filter(c => c.name === categories.find(cat => cat.id === Number(categoryFilter))?.name);
  }
  chartInstances.push(new Chart(ctx1, {
    type: 'pie',
    data: {
      labels: prodByCat.map(p => p.name),
      datasets: [{
        data: prodByCat.map(p => p.count),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true
    }
  }));

  // CHART 2: orders by status (donut)
  const ctx2 = document.getElementById('chart2').getContext('2d');
  const statusGroups = filteredOrders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  chartInstances.push(new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: Object.keys(statusGroups).map(s => t(`status_${s}`)),
      datasets: [{
        data: Object.values(statusGroups),
        backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0', '#FFCE56']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true
    }
  }));

  // CHART 3: sales by month (bar)
  const ctx3 = document.getElementById('chart3').getContext('2d');
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const salesByMonth = months.map(m => {
    return filteredOrders
      .filter(o => new Date(o.date).getMonth() + 1 === m)
      .reduce((s, o) => s + Number(o.total || 0), 0);
  });
  chartInstances.push(new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: months.map(m => `M${m}`),
      datasets: [{
        label: t('chart_sales_by_month'),
        data: salesByMonth,
        backgroundColor: '#36A2EB'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  }));

  // CHART 4: revenue line (last 12 months)
  const ctx4 = document.getElementById('chart4').getContext('2d');
  chartInstances.push(new Chart(ctx4, {
    type: 'line',
    data: {
      labels: months.map(m => `M${m}`),
      datasets: [{
        label: t('kpi_revenue'),
        data: salesByMonth,
        fill: true,
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  }));

  // CHART 5: ratings scatter
  const ctx5 = document.getElementById('chart5').getContext('2d');
  let filteredProducts = products;
  if (categoryFilter !== 'all') {
    filteredProducts = products.filter(p => p.categoryId === Number(categoryFilter));
  }
  const points = filteredProducts.map(p => ({
    x: p.rating || 0,
    y: reviews.filter(r => r.productId === p.id).length
  }));
  chartInstances.push(new Chart(ctx5, {
    type: 'scatter',
    data: {
      datasets: [{
        label: t('chart_ratings'),
        data: points,
        backgroundColor: '#FF6384'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          title: {
            display: true,
            text: t('label_rating')
          },
          min: 0,
          max: 5
        },
        y: {
          title: {
            display: true,
            text: '# ' + t('kpi_reviews')
          },
          beginAtZero: true
        }
      }
    }
  }));
}

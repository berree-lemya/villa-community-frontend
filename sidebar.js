// sidebar.js — Renders the sidebar on every page

function renderSidebar() {
  const user = getCurrentUser();
  const isAdmin = user.role === 'admin';
  const isSecurity = user.role === 'security';
  const currentPage = window.location.pathname.split('/').pop();

  const navItems = [
    { label: 'Dashboard', icon: '🏠', href: 'dashboard.html', roles: ['owner','tenant','admin','security'] },
    { section: 'Amenities' },
    { label: 'Book Amenity', icon: '🎾', href: 'bookings.html', roles: ['owner','tenant','admin'] },
    { section: 'Services' },
    { label: 'Maintenance', icon: '🔧', href: 'maintenance.html', roles: ['owner','tenant','admin'] },
    { section: 'Gate' },
    { label: 'Gate Passes', icon: '🚪', href: 'gate.html', roles: ['owner','tenant','admin','security'] },
    { section: 'Community' },
    { label: 'Announcements', icon: '📢', href: 'announcements.html', roles: ['owner','tenant','admin','security'] },
    { label: 'Events Calendar', icon: '🗓️', href: 'calendar.html', roles: ['owner','tenant','admin','security'] },
    { label: 'Bills & Payments', icon: '💰', href: 'bills.html', roles: ['owner','tenant','admin'] },
    { label: 'Parking', icon: '🚗', href: 'parking.html', roles: ['owner','tenant','admin','security'] },
    { section: 'Account' },
    { label: 'Notifications', icon: '🔔', href: 'notifications.html', roles: ['owner','tenant','admin','security'] },
    { label: 'My Profile', icon: '👤', href: 'profile.html', roles: ['owner','tenant','admin','security'] },
    { section: 'Admin', adminOnly: true },
    { label: 'All Users', icon: '👥', href: 'admin-users.html', roles: ['admin'] },
    { label: 'All Bookings', icon: '📅', href: 'admin-bookings.html', roles: ['admin'] },
    { label: 'All Maintenance', icon: '🛠️', href: 'admin-maintenance.html', roles: ['admin'] },
  ];

  const navHTML = navItems.map(item => {
    if (item.section) {
      if (item.adminOnly && !isAdmin) return '';
      return `<div class="nav-section">${item.section}</div>`;
    }
    if (!item.roles.includes(user.role)) return '';
    const isActive = currentPage === item.href ? 'active' : '';
    return `<a class="nav-item ${isActive}" href="${item.href}">
      <span class="icon">${item.icon}</span>
      <span>${item.label}</span>
    </a>`;
  }).join('');

  const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);

  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `
    <div class="sidebar-logo">
      <div class="brand">Vineyards</div>
      <div class="tagline">Community Living</div>
    </div>
    <nav class="sidebar-nav">${navHTML}</nav>
    <div class="sidebar-user">
      <div class="user-avatar">${initials}</div>
      <div class="user-info">
        <div class="name">${user.name || 'User'}</div>
        <div class="role">${user.role || ''} ${user.villa_number ? '· ' + user.villa_number : ''}</div>
      </div>
      <button class="logout-btn" onclick="logout()" title="Logout">⏏</button>
    </div>
  `;
}

// Run when DOM ready
document.addEventListener('DOMContentLoaded', renderSidebar);

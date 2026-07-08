const newProjectBtn = document.getElementById("new-project-btn");
newProjectBtn.addEventListener("click", () => {
    showNewProjectModal();
});

function showNewProjectModal() {
    // Create the modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <h2>✨ New Project</h2>
            <input type="text" id="project-name-input" placeholder="Enter project name..." />
            <div class="modal-buttons">
                <button id="modal-cancel">Cancel</button>
                <button id="modal-create">Create →</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Focus the input
    document.getElementById('project-name-input').focus();

    // Cancel button
    document.getElementById('modal-cancel').addEventListener('click', () => {
        overlay.remove();
    });

    // Create button
  // NEW
document.getElementById('modal-create').addEventListener('click', () => {
    const name = document.getElementById('project-name-input').value.trim();
    if (!name) return;

    // Save project to the projects list
    const projects = JSON.parse(localStorage.getItem('ca_projects') || '[]');
    projects.unshift({
        name: name,
        language: 'Python',
        description: 'New Project',
        lastEdited: Date.now()
    });
    localStorage.setItem('ca_projects', JSON.stringify(projects));

    localStorage.setItem('current_project_name', name);
    overlay.remove();
    window.location.href = 'editor_main.html';
});
    // Close on outside click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}
// Load and display saved projects
function loadProjects() {
    const grid = document.getElementById('projects-grid');
    const addNewCard = document.getElementById('add-new-card');

    // Get all projects from localStorage
    const projects = JSON.parse(localStorage.getItem('ca_projects') || '[]');

    // Remove old project cards (keep add-new card)
    grid.querySelectorAll('.project-card:not(.add-new)').forEach(c => c.remove());

    // Render each project before the add-new card
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-icon">📄</div>
                <div class="card-menu">⋮</div>
            </div>
            <div class="card-body">
                <h3>${project.name}</h3>
                <p class="card-desc">${project.language} • ${project.description}</p>
                <p class="card-time">Last edited ${timeAgo(project.lastEdited)}</p>
            </div>
            <div class="card-footer">
                <span class="tag">${project.language}</span>
            </div>
        `;
        card.addEventListener('click', () => {
    localStorage.setItem('current_project_name', project.name);
    window.location.href = '../pages/editor_main.html';
});

// Three dots menu
const menu = card.querySelector('.card-menu');
menu.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent opening the editor

    // Remove any existing dropdown
    document.querySelectorAll('.card-dropdown').forEach(d => d.remove());

    const dropdown = document.createElement('div');
    dropdown.className = 'card-dropdown';
    dropdown.innerHTML = `<div class="dropdown-item delete-item">🗑️ Delete</div>`;
    card.appendChild(dropdown);

    dropdown.querySelector('.delete-item').addEventListener('click', (e) => {
        e.stopPropagation();
        const projects = JSON.parse(localStorage.getItem('ca_projects') || '[]');
        const updated = projects.filter(p => p.name !== project.name);
        localStorage.setItem('ca_projects', JSON.stringify(updated));
        loadProjects();
    });

    // Close dropdown if clicked elsewhere
    document.addEventListener('click', () => dropdown.remove(), { once: true });
});
        grid.insertBefore(card, addNewCard);
    });
}

function timeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
}

// Call on page load
loadProjects();

// Also click the add-new card
document.getElementById('add-new-card').addEventListener('click', showNewProjectModal);
let currentPin = '';
let currentFolder = 'all';
let images = [];
let folders = ['Uncategorized', 'Portfolio', 'UI-UX', 'Web-Design', 'Photography'];
let projects = [];
let contacts = [];
let cropper = null;
let currentCropId = null;
let selectedImages = [];
let currentEditProject = null;

document.addEventListener('DOMContentLoaded', () => {
    setupUploadZone();
    loadConfigUI();
});

function addDigit(digit) {
    if (currentPin.length < 4) {
        currentPin += digit;
        updatePinDisplay();
        if (currentPin.length === 4) {
            checkPin();
        }
    }
}

function clearPin() {
    currentPin = '';
    updatePinDisplay();
    document.getElementById('errorMsg').textContent = '';
}

function updatePinDisplay() {
    const display = document.getElementById('pinDisplay');
    display.textContent = '•'.repeat(currentPin.length) + '·'.repeat(4 - currentPin.length);
}

function checkPin() {
    if (currentPin === Config.pin) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadAllData();
    } else {
        document.getElementById('errorMsg').textContent = '❌ Incorrect PIN';
        setTimeout(clearPin, 1000);
    }
}

function logout() {
    currentPin = '';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
    clearPin();
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Section').classList.add('active');
    
    if (tab === 'images') loadImages();
    if (tab === 'projects') loadProjects();
    if (tab === 'contacts') loadContacts();
    if (tab === 'config') loadConfigUI();
}

async function loadAllData() {
    updateSyncStatus('syncing', 'Loading data...');
    
    try {
        await Promise.all([
            loadImagesData(),
            loadProjectsData(),
            loadContactsData()
        ]);
        
        updateFolderList();
        loadImages();
        updateSyncStatus('synced', 'Data loaded ✓');
    } catch (error) {
        console.error('Load error:', error);
        updateSyncStatus('error', 'Load failed');
        
        images = [];
        folders = ['Uncategorized', 'Portfolio', 'UI-UX', 'Web-Design', 'Photography'];
        projects = [];
        contacts = [];
        
        updateFolderList();
        loadImages();
    }
}

async function loadImagesData() {
    try {
        const response = await fetch('/data/images.json?t=' + Date.now());
        if (response.ok) {
            const data = await response.json();
            images = data.images || [];
            folders = data.folders || ['Uncategorized', 'Portfolio', 'UI-UX', 'Web-Design', 'Photography'];
        }
    } catch (e) {
        console.warn('Failed to load images.json');
    }
}

async function loadProjectsData() {
    try {
        const response = await fetch('/data/projects.json?t=' + Date.now());
        if (response.ok) {
            const data = await response.json();
            projects = data.projects || [];
        }
    } catch (e) {
        console.warn('Failed to load projects.json');
    }
}

async function loadContactsData() {
    try {
        const response = await fetch('/data/contacts.json?t=' + Date.now());
        if (response.ok) {
            const data = await response.json();
            contacts = data.contacts || [];
        }
    } catch (e) {
        console.warn('Failed to load contacts.json');
    }
}

function updateFolderList() {
    const list = document.getElementById('folderList');
    
    const allCount = images.length;
    const folderCounts = {};
    
    folders.forEach(f => {
        folderCounts[f] = images.filter(img => img.folder === f).length;
    });
    
    list.innerHTML = `
        <div class="folder-item ${currentFolder === 'all' ? 'active' : ''}" onclick="selectFolder('all')">
            <div class="folder-icon">📂</div>
            <div class="folder-name">All Images</div>
            <div class="folder-count">${allCount}</div>
        </div>
        ${folders.map(folder => `
            <div class="folder-item ${currentFolder === folder ? 'active' : ''}" onclick="selectFolder('${folder}')">
                <div class="folder-icon">📁</div>
                <div class="folder-name">${folder}</div>
                <div class="folder-count">${folderCounts[folder] || 0}</div>
                ${folder !== 'Uncategorized' ? `<button class="folder-delete" onclick="deleteFolder('${folder}', event)">×</button>` : ''}
            </div>
        `).join('')}
    `;
}

function selectFolder(folder) {
    currentFolder = folder;
    updateFolderList();
    loadImages();
}

function openFolderModal() {
    document.getElementById('folderModal').classList.add('active');
    document.getElementById('folderNameInput').value = '';
    document.getElementById('folderNameInput').focus();
}

function closeFolderModal() {
    document.getElementById('folderModal').classList.remove('active');
}

function createFolder() {
    const name = document.getElementById('folderNameInput').value.trim();
    
    if (!name) {
        alert('❌ Please enter a folder name');
        return;
    }
    
    if (folders.includes(name)) {
        alert('❌ Folder already exists');
        return;
    }
    
    folders.push(name);
    updateFolderList();
    syncToGitHub();
    closeFolderModal();
}

function deleteFolder(folder, e) {
    e.stopPropagation();
    
    const count = images.filter(img => img.folder === folder).length;
    
    if (count > 0) {
        if (!confirm(`This folder contains ${count} image(s). Delete anyway? Images will be moved to Uncategorized.`)) {
            return;
        }
        
        images.forEach(img => {
            if (img.folder === folder) {
                img.folder = 'Uncategorized';
            }
        });
    }
    
    folders = folders.filter(f => f !== folder);
    
    if (currentFolder === folder) {
        currentFolder = 'all';
    }
    
    updateFolderList();
    loadImages();
    syncToGitHub();
}

function setupUploadZone() {
    const zone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    
    zone.addEventListener('click', (e) => {
        fileInput.click();
    });
    
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    });
    
    zone.addEventListener('dragleave', () => {
        zone.classList.remove('dragover');
    });
    
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) {
            handleFiles(files);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
            e.target.value = '';
        }
    });
}

function handleFiles(files) {
    const folder = currentFolder === 'all' ? 'Uncategorized' : currentFolder;
    
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const image = {
                id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                name: file.name,
                url: e.target.result,
                folder: folder,
                created: new Date().toISOString()
            };
            
            images.push(image);
            loadImages();
            updateFolderList();
            syncToGitHub();
        };
        
        reader.readAsDataURL(file);
    });
}

function loadImages() {
    const grid = document.getElementById('imagesGrid');
    
    const filtered = currentFolder === 'all' 
        ? images 
        : images.filter(img => img.folder === currentFolder);
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-icon">📷</div>
                <div class="empty-title">No images in this folder</div>
                <div class="empty-text">Upload some images to get started</div>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filtered.map(img => `
        <div class="image-thumb" data-id="${img.id}">
            <div class="image-checkbox"></div>
            <img src="${img.url}" alt="${img.name}">
            <div class="image-overlay">
                <div class="image-name">${img.name}</div>
            </div>
            <div class="image-actions">
                <button class="action-btn crop-btn" onclick="openCropModal('${img.id}')" title="Crop">✂️</button>
                <button class="action-btn delete-btn" onclick="deleteImage('${img.id}')" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
}

function deleteImage(id) {
    event.stopPropagation();
    
    if (confirm('🗑️ Delete this image?')) {
        images = images.filter(img => img.id !== id);
        loadImages();
        updateFolderList();
        syncToGitHub();
    }
}

function openCropModal(id) {
    event.stopPropagation();
    
    const image = images.find(img => img.id === id);
    if (!image) return;
    
    currentCropId = id;
    
    const cropImage = document.getElementById('cropImage');
    cropImage.src = image.url;
    
    document.getElementById('cropModal').classList.add('active');
    
    setTimeout(() => {
        if (cropper) {
            cropper.destroy();
        }
        
        cropper = new Cropper(cropImage, {
            aspectRatio: NaN,
            viewMode: 1,
            autoCropArea: 1,
            responsive: true,
            background: false,
            zoomable: true,
            scalable: true,
            rotatable: true
        });
    }, 100);
}

function closeCropModal() {
    document.getElementById('cropModal').classList.remove('active');
    
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    
    currentCropId = null;
}

function saveCrop() {
    if (!cropper || !currentCropId) return;
    
    const canvas = cropper.getCroppedCanvas();
    const croppedData = canvas.toDataURL();
    
    const image = images.find(img => img.id === currentCropId);
    if (image) {
        image.url = croppedData;
        loadImages();
        syncToGitHub();
    }
    
    closeCropModal();
}

function openProjectModal(id = null) {
    selectedImages = [];
    currentEditProject = id;
    
    if (id) {
        const project = projects.find(p => p.id === id);
        if (project) {
            document.getElementById('projectModalTitle').textContent = 'Edit Project';
            document.getElementById('projectTitle').value = project.title;
            document.getElementById('projectDesc').value = project.description;
            document.getElementById('projectTech').value = project.technologies.join(', ');
            document.getElementById('projectUrl').value = project.url || '';
            selectedImages = [...project.images];
        }
    } else {
        document.getElementById('projectModalTitle').textContent = 'New Project';
        document.getElementById('projectTitle').value = '';
        document.getElementById('projectDesc').value = '';
        document.getElementById('projectTech').value = '';
        document.getElementById('projectUrl').value = '';
    }
    
    updateProjectImageSelect();
    updateSelectedPreview();
    document.getElementById('projectModal').classList.add('active');
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
    selectedImages = [];
    currentEditProject = null;
}

function updateProjectImageSelect() {
    const grid = document.getElementById('projectImageSelect');
    
    if (images.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-icon">📷</div>
                <div class="empty-title">No images available</div>
                <div class="empty-text">Upload images first</div>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = images.map(img => `
        <div class="image-thumb ${selectedImages.includes(img.id) ? 'selected' : ''}" 
             onclick="toggleImageSelect('${img.id}')">
            <div class="image-checkbox"></div>
            <img src="${img.url}" alt="${img.name}">
        </div>
    `).join('');
}

function toggleImageSelect(id) {
    const index = selectedImages.indexOf(id);
    
    if (index > -1) {
        selectedImages.splice(index, 1);
    } else {
        selectedImages.push(id);
    }
    
    updateProjectImageSelect();
    updateSelectedPreview();
}

function updateSelectedPreview() {
    const preview = document.getElementById('selectedPreview');
    
    if (selectedImages.length === 0) {
        preview.innerHTML = '';
        return;
    }
    
    preview.innerHTML = selectedImages.map(id => {
        const img = images.find(i => i.id === id);
        if (!img) return '';
        
        return `
            <div class="selected-item">
                <img src="${img.url}" alt="${img.name}">
                <button class="remove-btn" onclick="removeSelectedImage('${id}')">×</button>
            </div>
        `;
    }).join('');
}

function removeSelectedImage(id) {
    event.stopPropagation();
    selectedImages = selectedImages.filter(i => i !== id);
    updateProjectImageSelect();
    updateSelectedPreview();
}

function saveProject() {
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDesc').value.trim();
    const technologies = document.getElementById('projectTech').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t);
    const url = document.getElementById('projectUrl').value.trim();
    
    if (!title || !description || selectedImages.length === 0) {
        alert('❌ Please fill all fields and select at least one image');
        return;
    }
    
    if (currentEditProject) {
        const project = projects.find(p => p.id === currentEditProject);
        if (project) {
            project.title = title;
            project.description = description;
            project.technologies = technologies;
            project.url = url;
            project.images = selectedImages;
        }
    } else {
        const project = {
            id: 'proj_' + Date.now(),
            title,
            description,
            technologies,
            url,
            images: selectedImages,
            created: new Date().toISOString()
        };
        
        projects.push(project);
    }
    
    loadProjects();
    syncToGitHub();
    closeProjectModal();
}

function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    
    if (projects.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-icon">💼</div>
                <div class="empty-title">No projects yet</div>
                <div class="empty-text">Create your first project</div>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = projects.map(project => {
        const projectImages = project.images
            .map(id => images.find(img => img.id === id))
            .filter(img => img);
        
        return `
            <div class="project-card">
                <div class="project-slider" id="slider-${project.id}">
                    ${projectImages.map((img, i) => `
                        <div class="project-slide ${i === 0 ? 'active' : ''}">
                            <img src="${img.url}" alt="${img.name}">
                        </div>
                    `).join('')}
                </div>
                <div class="project-body">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.description}</p>
                    <div class="project-actions">
                        <button class="btn btn-primary" onclick="openProjectModal('${project.id}')">✏️ Edit</button>
                        <button class="btn btn-danger" onclick="deleteProject('${project.id}')">🗑️ Delete</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    projects.forEach(project => {
        if (project.images.length > 1) {
            startSlider(project.id, project.images.length);
        }
    });
}

function startSlider(id, count) {
    if (count <= 1) return;
    
    let current = 0;
    const slider = document.getElementById(`slider-${id}`);
    if (!slider) return;
    
    setInterval(() => {
        const slides = slider.querySelectorAll('.project-slide');
        if (slides.length === 0) return;
        
        slides[current].classList.remove('active');
        current = (current + 1) % count;
        slides[current].classList.add('active');
    }, 3000);
}

function deleteProject(id) {
    if (confirm('🗑️ Delete this project?')) {
        projects = projects.filter(p => p.id !== id);
        loadProjects();
        syncToGitHub();
    }
}

function openContactModal() {
    document.getElementById('contactModal').classList.add('active');
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactMessage').value = '';
}

function closeContactModal() {
    document.getElementById('contactModal').classList.remove('active');
}

function saveContact() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    if (!name || !email || !message) {
        alert('❌ Please fill all fields');
        return;
    }
    
    const contact = {
        id: 'contact_' + Date.now(),
        name,
        email,
        message,
        date: new Date().toISOString()
    };
    
    contacts.push(contact);
    loadContacts();
    syncToGitHub();
    closeContactModal();
}

function loadContacts() {
    const list = document.getElementById('contactsList');
    
    if (contacts.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-icon">📧</div>
                <div class="empty-title">No contact submissions yet</div>
                <div class="empty-text">Add a contact or wait for submissions</div>
            </div>
        `;
        return;
    }
    
    list.innerHTML = contacts.map(contact => `
        <div class="contact-card">
            <div class="contact-header">
                <div>
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-email">${contact.email}</div>
                </div>
                <button class="btn btn-danger" onclick="deleteContact('${contact.id}')">🗑️</button>
            </div>
            <div class="contact-message">${contact.message}</div>
            <div class="contact-date">${new Date(contact.date).toLocaleString()}</div>
        </div>
    `).join('');
}

function deleteContact(id) {
    if (confirm('🗑️ Delete this contact?')) {
        contacts = contacts.filter(c => c.id !== id);
        loadContacts();
        syncToGitHub();
    }
}

function loadConfigUI() {
    document.getElementById('githubToken').value = Config.token;
    document.getElementById('githubRepo').value = Config.repo;
    document.getElementById('adminPin').value = Config.pin;
}

function saveConfig() {
    Config.token = document.getElementById('githubToken').value.trim();
    Config.repo = document.getElementById('githubRepo').value.trim();
    Config.pin = document.getElementById('adminPin').value.trim() || '1234';
    
    if (Config.save()) {
        alert('✅ Configuration saved successfully!');
    } else {
        alert('⚠️ Configuration saved (in-memory only - localStorage blocked)');
    }
}

async function syncToGitHub() {
    if (!Config.isConfigured()) {
        updateSyncStatus('error', 'GitHub not configured');
        setTimeout(() => {
            updateSyncStatus('synced', 'Config needed');
        }, 2000);
        return;
    }
    
    updateSyncStatus('syncing', 'Syncing...');
    
    try {
        await uploadToGitHub('data/images.json', {
            images: images,
            folders: folders
        });
        
        await uploadToGitHub('data/projects.json', {
            projects: projects
        });
        
        await uploadToGitHub('data/contacts.json', {
            contacts: contacts
        });
        
        updateSyncStatus('synced', 'Synced to GitHub ✓');
    } catch (error) {
        console.error('GitHub sync error:', error);
        updateSyncStatus('error', 'Sync failed: ' + error.message);
        setTimeout(() => {
            updateSyncStatus('synced', 'Retry available');
        }, 3000);
    }
}

async function uploadToGitHub(path, data) {
    const url = `https://api.github.com/repos/${Config.repo}/contents/${path}`;
    
    let sha = null;
    try {
        const getResponse = await fetch(url, {
            headers: {
                'Authorization': `token ${Config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (getResponse.ok) {
            const fileData = await getResponse.json();
            sha = fileData.sha;
        }
    } catch (e) {
    }
    
    const content = JSON.stringify(data, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${Config.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Update ${path} via admin panel`,
            content: encodedContent,
            sha: sha
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    return response.json();
}

function updateSyncStatus(status, text) {
    const statusEl = document.getElementById('syncStatus');
    const textEl = document.getElementById('syncText');
    
    statusEl.className = 'sync-status ' + status;
    textEl.textContent = text;
}

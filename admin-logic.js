// Make all functions globally available by defining them in the global scope
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
let selectedPlatform = { icon: 'fas fa-envelope', name: 'Email', color: '#6366F1', urlPattern: 'mailto:' };

// Comprehensive social media and contact platforms
const socialPlatforms = [
    // Email & Communication
    { name: 'Email', icon: 'fas fa-envelope', color: '#6366F1', urlPattern: 'mailto:' },
    { name: 'Phone', icon: 'fas fa-phone', color: '#10B981', urlPattern: 'tel:' },
    { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366', urlPattern: 'https://wa.me/' },
    { name: 'Telegram', icon: 'fab fa-telegram', color: '#0088cc', urlPattern: 'https://t.me/' },
    { name: 'Messenger', icon: 'fab fa-facebook-messenger', color: '#0084FF', urlPattern: 'https://m.me/' },
    { name: 'WeChat', icon: 'fab fa-weixin', color: '#09B83E', urlPattern: '' },
    { name: 'Signal', icon: 'fas fa-comment-dots', color: '#3A76F0', urlPattern: '' },
    { name: 'Viber', icon: 'fab fa-viber', color: '#665CAC', urlPattern: '' },
    { name: 'Line', icon: 'fab fa-line', color: '#00B900', urlPattern: '' },
    { name: 'Skype', icon: 'fab fa-skype', color: '#00AFF0', urlPattern: 'skype:' },
    { name: 'Discord', icon: 'fab fa-discord', color: '#5865F2', urlPattern: 'https://discord.gg/' },
    { name: 'Slack', icon: 'fab fa-slack', color: '#4A154B', urlPattern: '' },
    
    // Social Networks
    { name: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2', urlPattern: 'https://facebook.com/' },
    { name: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F', urlPattern: 'https://instagram.com/' },
    { name: 'Twitter/X', icon: 'fab fa-twitter', color: '#1DA1F2', urlPattern: 'https://twitter.com/' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0A66C2', urlPattern: 'https://linkedin.com/in/' },
    { name: 'TikTok', icon: 'fab fa-tiktok', color: '#000000', urlPattern: 'https://tiktok.com/@' },
    { name: 'Snapchat', icon: 'fab fa-snapchat', color: '#FFFC00', urlPattern: 'https://snapchat.com/add/' },
    { name: 'Pinterest', icon: 'fab fa-pinterest', color: '#E60023', urlPattern: 'https://pinterest.com/' },
    { name: 'Reddit', icon: 'fab fa-reddit', color: '#FF4500', urlPattern: 'https://reddit.com/u/' },
    { name: 'Tumblr', icon: 'fab fa-tumblr', color: '#35465C', urlPattern: 'https://tumblr.com/' },
    { name: 'VK', icon: 'fab fa-vk', color: '#0077FF', urlPattern: 'https://vk.com/' },
    { name: 'Mastodon', icon: 'fab fa-mastodon', color: '#6364FF', urlPattern: '' },
    { name: 'BlueSky', icon: 'fas fa-cloud', color: '#0085FF', urlPattern: '' },
    { name: 'Threads', icon: 'fab fa-threads', color: '#000000', urlPattern: '' },
    
    // Professional
    { name: 'GitHub', icon: 'fab fa-github', color: '#181717', urlPattern: 'https://github.com/' },
    { name: 'GitLab', icon: 'fab fa-gitlab', color: '#FC6D26', urlPattern: 'https://gitlab.com/' },
    { name: 'Behance', icon: 'fab fa-behance', color: '#1769FF', urlPattern: 'https://behance.net/' },
    { name: 'Dribbble', icon: 'fab fa-dribbble', color: '#EA4C89', urlPattern: 'https://dribbble.com/' },
    { name: 'Stack Overflow', icon: 'fab fa-stack-overflow', color: '#F58025', urlPattern: 'https://stackoverflow.com/users/' },
    { name: 'Medium', icon: 'fab fa-medium', color: '#000000', urlPattern: 'https://medium.com/@' },
    { name: 'Dev.to', icon: 'fab fa-dev', color: '#0A0A0A', urlPattern: 'https://dev.to/' },
    { name: 'Hashnode', icon: 'fas fa-hashtag', color: '#2962FF', urlPattern: '' },
    { name: 'CodePen', icon: 'fab fa-codepen', color: '#000000', urlPattern: 'https://codepen.io/' },
    
    // Content & Media
    { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000', urlPattern: 'https://youtube.com/@' },
    { name: 'Twitch', icon: 'fab fa-twitch', color: '#9146FF', urlPattern: 'https://twitch.tv/' },
    { name: 'Vimeo', icon: 'fab fa-vimeo', color: '#1AB7EA', urlPattern: 'https://vimeo.com/' },
    { name: 'Spotify', icon: 'fab fa-spotify', color: '#1DB954', urlPattern: 'https://open.spotify.com/user/' },
    { name: 'SoundCloud', icon: 'fab fa-soundcloud', color: '#FF3300', urlPattern: 'https://soundcloud.com/' },
    { name: 'Apple Music', icon: 'fab fa-apple', color: '#FA243C', urlPattern: '' },
    { name: 'Patreon', icon: 'fab fa-patreon', color: '#FF424D', urlPattern: 'https://patreon.com/' },
    { name: 'Ko-fi', icon: 'fas fa-mug-hot', color: '#FF5E5B', urlPattern: 'https://ko-fi.com/' },
    { name: 'Buy Me Coffee', icon: 'fas fa-coffee', color: '#FFDD00', urlPattern: '' },
    
    // Business & Shopping
    { name: 'Website', icon: 'fas fa-globe', color: '#6366F1', urlPattern: 'https://' },
    { name: 'Portfolio', icon: 'fas fa-briefcase', color: '#6366F1', urlPattern: '' },
    { name: 'Blog', icon: 'fas fa-blog', color: '#6366F1', urlPattern: '' },
    { name: 'Etsy', icon: 'fab fa-etsy', color: '#F1641E', urlPattern: 'https://etsy.com/shop/' },
    { name: 'Amazon', icon: 'fab fa-amazon', color: '#FF9900', urlPattern: '' },
    { name: 'eBay', icon: 'fab fa-ebay', color: '#E53238', urlPattern: '' },
    { name: 'Shopify', icon: 'fab fa-shopify', color: '#96BF48', urlPattern: '' },
    
    // Other
    { name: 'Linktree', icon: 'fas fa-link', color: '#43E55E', urlPattern: 'https://linktr.ee/' },
    { name: 'Calendar', icon: 'fas fa-calendar', color: '#6366F1', urlPattern: '' },
    { name: 'Location', icon: 'fas fa-map-marker-alt', color: '#EF4444', urlPattern: '' },
    { name: 'Document', icon: 'fas fa-file', color: '#6366F1', urlPattern: '' },
    { name: 'Download', icon: 'fas fa-download', color: '#10B981', urlPattern: '' },
    { name: 'Custom Link', icon: 'fas fa-external-link-alt', color: '#6366F1', urlPattern: '' }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupUploadZone();
    loadConfigUI();
    initializeIconSelector();
});

// Global function definitions
window.addDigit = function(digit) {
    if (currentPin.length < 4) {
        currentPin += digit;
        updatePinDisplay();
        if (currentPin.length === 4) {
            checkPin();
        }
    }
};

window.clearPin = function() {
    currentPin = '';
    updatePinDisplay();
    document.getElementById('errorMsg').textContent = '';
};

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

window.logout = function() {
    currentPin = '';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
    clearPin();
};

window.switchTab = function(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Section').classList.add('active');
    
    if (tab === 'images') loadImages();
    if (tab === 'projects') loadProjects();
    if (tab === 'contacts') loadContacts();
    if (tab === 'config') loadConfigUI();
};

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
        updateSyncStatus('error', 'Load failed - using defaults');
        
        images = [];
        folders = ['Uncategorized', 'Portfolio', 'UI-UX', 'Web-Design', 'Photography'];
        projects = [];
        contacts = [];
        
        updateFolderList();
        loadImages();
        
        setTimeout(() => {
            updateSyncStatus('synced', 'Ready');
        }, 2000);
    }
}

async function loadImagesData() {
    try {
        const response = await fetch('./data/images.json?t=' + Date.now());
        if (response.ok) {
            const data = await response.json();
            images = data.images || [];
            folders = data.folders || ['Uncategorized', 'Portfolio', 'UI-UX', 'Web-Design', 'Photography'];
        } else {
            console.warn('images.json not found, using defaults');
        }
    } catch (e) {
        console.warn('Failed to load images.json:', e);
    }
}

async function loadProjectsData() {
    try {
        const response = await fetch('./data/projects.json?t=' + Date.now());
        if (response.ok) {
            const data = await response.json();
            projects = Array.isArray(data) ? data : [];
        } else {
            console.warn('projects.json not found, using defaults');
        }
    } catch (e) {
        console.warn('Failed to load projects.json:', e);
    }
}

async function loadContactsData() {
    try {
        const response = await fetch('./data/contacts.json?t=' + Date.now());
        if (response.ok) {
            const data = await response.json();
            contacts = Array.isArray(data) ? data : [];
        } else {
            console.warn('contacts.json not found, using defaults');
        }
    } catch (e) {
        console.warn('Failed to load contacts.json:', e);
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

window.selectFolder = function(folder) {
    currentFolder = folder;
    updateFolderList();
    loadImages();
};

window.openFolderModal = function() {
    document.getElementById('folderModal').classList.add('active');
    document.getElementById('folderNameInput').value = '';
    document.getElementById('folderNameInput').focus();
};

window.closeFolderModal = function() {
    document.getElementById('folderModal').classList.remove('active');
};

window.createFolder = function() {
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
};

window.deleteFolder = function(folder, e) {
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
};

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
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            handleFiles(files);
        }
        e.target.value = '';
    });
}

function handleFiles(files) {
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const id = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const image = {
                id: id,
                url: e.target.result,
                name: file.name,
                folder: currentFolder === 'all' ? 'Uncategorized' : currentFolder,
                uploadDate: new Date().toISOString()
            };
            
            images.push(image);
            loadImages();
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
                <div class="empty-icon">🖼️</div>
                <div class="empty-title">No images here</div>
                <div class="empty-text">Upload some images to get started</div>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filtered.map(img => `
        <div class="image-card">
            <img src="${img.url}" alt="${img.name}" class="image-preview">
            <div class="image-info">
                <div class="image-name">${img.name}</div>
                <div class="image-folder">📁 ${img.folder}</div>
            </div>
            <div class="image-actions">
                <button style="background: var(--primary); color: white;" onclick="openCropModal('${img.id}')">✂️ Crop</button>
                <button style="background: var(--warning); color: white;" onclick="moveImage('${img.id}')">📁 Move</button>
                <button style="background: var(--danger); color: white;" onclick="deleteImage('${img.id}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

window.openCropModal = function(imageId) {
    const img = images.find(i => i.id === imageId);
    if (!img) return;
    
    currentCropId = imageId;
    
    const cropImage = document.getElementById('cropImage');
    cropImage.src = img.url;
    
    document.getElementById('cropModal').classList.add('active');
    
    setTimeout(() => {
        if (cropper) {
            cropper.destroy();
        }
        
        cropper = new Cropper(cropImage, {
            aspectRatio: NaN,
            viewMode: 1,
            autoCropArea: 1,
            responsive: true
        });
    }, 100);
};

window.closeCropModal = function() {
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    document.getElementById('cropModal').classList.remove('active');
    currentCropId = null;
};

window.saveCrop = function() {
    if (!cropper || !currentCropId) return;
    
    const canvas = cropper.getCroppedCanvas();
    const croppedDataUrl = canvas.toDataURL();
    
    const img = images.find(i => i.id === currentCropId);
    if (img) {
        img.url = croppedDataUrl;
        loadImages();
        syncToGitHub();
    }
    
    closeCropModal();
};

window.moveImage = function(imageId) {
    const img = images.find(i => i.id === imageId);
    if (!img) return;
    
    const newFolder = prompt(`Move to folder:\n\nAvailable folders:\n${folders.join(', ')}`, img.folder);
    
    if (newFolder && folders.includes(newFolder)) {
        img.folder = newFolder;
        loadImages();
        updateFolderList();
        syncToGitHub();
    } else if (newFolder) {
        alert('❌ Folder does not exist');
    }
};

window.deleteImage = function(imageId) {
    if (confirm('🗑️ Delete this image?')) {
        images = images.filter(img => img.id !== imageId);
        loadImages();
        updateFolderList();
        syncToGitHub();
    }
};

window.openProjectModal = function(projectId = null) {
    document.getElementById('projectModal').classList.add('active');
    
    if (projectId) {
        currentEditProject = projects.find(p => p.id === projectId);
        document.getElementById('projectModalTitle').textContent = 'Edit Project';
        document.getElementById('projectTitle').value = currentEditProject.title;
        document.getElementById('projectDesc').value = currentEditProject.description;
        document.getElementById('projectTech').value = currentEditProject.technologies.join(', ');
        document.getElementById('projectUrl').value = currentEditProject.url || '';
        selectedImages = [...currentEditProject.images];
    } else {
        currentEditProject = null;
        document.getElementById('projectModalTitle').textContent = 'New Project';
        document.getElementById('projectTitle').value = '';
        document.getElementById('projectDesc').value = '';
        document.getElementById('projectTech').value = '';
        document.getElementById('projectUrl').value = '';
        selectedImages = [];
    }
    
    loadProjectImageSelector();
};

window.closeProjectModal = function() {
    document.getElementById('projectModal').classList.remove('active');
    currentEditProject = null;
    selectedImages = [];
};

function loadProjectImageSelector() {
    const selector = document.getElementById('projectImageSelect');
    const preview = document.getElementById('selectedPreview');
    
    selector.innerHTML = images.map(img => `
        <div class="image-card ${selectedImages.includes(img.url) ? 'selected' : ''}" onclick="toggleImageSelection('${img.url}')">
            <img src="${img.url}" alt="${img.name}" class="image-preview">
        </div>
    `).join('');
    
    preview.innerHTML = selectedImages.map(url => `
        <img src="${url}" alt="Selected">
    `).join('');
}

window.toggleImageSelection = function(imageUrl) {
    const index = selectedImages.indexOf(imageUrl);
    if (index > -1) {
        selectedImages.splice(index, 1);
    } else {
        selectedImages.push(imageUrl);
    }
    loadProjectImageSelector();
};

window.saveProject = function() {
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDesc').value.trim();
    const techString = document.getElementById('projectTech').value.trim();
    const url = document.getElementById('projectUrl').value.trim();
    
    if (!title || !description) {
        alert('❌ Please fill in title and description');
        return;
    }
    
    const technologies = techString.split(',').map(t => t.trim()).filter(t => t);
    
    if (currentEditProject) {
        currentEditProject.title = title;
        currentEditProject.description = description;
        currentEditProject.technologies = technologies;
        currentEditProject.url = url;
        currentEditProject.images = [...selectedImages];
    } else {
        const project = {
            id: 'proj_' + Date.now(),
            title,
            description,
            technologies,
            url,
            images: [...selectedImages],
            createdDate: new Date().toISOString()
        };
        projects.push(project);
    }
    
    loadProjects();
    syncToGitHub();
    closeProjectModal();
};

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
        const projectImages = Array.isArray(project.images) ? project.images : [];
        
        return `
            <div class="project-card">
                <div class="project-slider" id="slider-${project.id}">
                    ${projectImages.length > 0 ? projectImages.map((imgUrl, i) => `
                        <div class="project-slide ${i === 0 ? 'active' : ''}">
                            <img src="${imgUrl}" alt="${project.title}">
                        </div>
                    `).join('') : `
                        <div class="project-slide active">
                            <div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:60px;background:#f0f0f0;">📁</div>
                        </div>
                    `}
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
        if (project.images && project.images.length > 1) {
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

window.deleteProject = function(id) {
    if (confirm('🗑️ Delete this project?')) {
        projects = projects.filter(p => p.id !== id);
        loadProjects();
        syncToGitHub();
    }
};

// Contact Modal Functions
function initializeIconSelector() {
    const iconGrid = document.getElementById('iconGrid');
    
    iconGrid.innerHTML = socialPlatforms.map(platform => `
        <div class="icon-option" onclick="selectPlatform('${platform.name}')" data-platform="${platform.name.toLowerCase()}">
            <i class="${platform.icon}" style="color: ${platform.color};"></i>
            <span class="icon-option-name">${platform.name}</span>
        </div>
    `).join('');
}

window.toggleIconDropdown = function() {
    const dropdown = document.getElementById('iconDropdown');
    dropdown.classList.toggle('active');
    
    if (dropdown.classList.contains('active')) {
        setTimeout(() => {
            document.addEventListener('click', closeIconDropdownOutside);
        }, 100);
    }
};

function closeIconDropdownOutside(e) {
    const dropdown = document.getElementById('iconDropdown');
    const preview = document.getElementById('iconPreview');
    
    if (!dropdown.contains(e.target) && !preview.contains(e.target)) {
        dropdown.classList.remove('active');
        document.removeEventListener('click', closeIconDropdownOutside);
    }
}

window.selectPlatform = function(platformName) {
    const platform = socialPlatforms.find(p => p.name === platformName);
    if (!platform) return;
    
    selectedPlatform = platform;
    
    document.getElementById('selectedIcon').className = platform.icon;
    document.getElementById('selectedIcon').style.color = platform.color;
    document.getElementById('selectedPlatform').textContent = platform.name;
    
    const nameInput = document.getElementById('contactName');
    if (!nameInput.value) {
        nameInput.value = platform.name;
    }
    
    document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('selected'));
    event.target.closest('.icon-option').classList.add('selected');
    
    document.getElementById('iconDropdown').classList.remove('active');
    document.removeEventListener('click', closeIconDropdownOutside);
};

window.filterIcons = function() {
    const searchTerm = document.getElementById('iconSearchInput').value.toLowerCase();
    const options = document.querySelectorAll('.icon-option');
    
    options.forEach(option => {
        const platformName = option.getAttribute('data-platform');
        if (platformName.includes(searchTerm)) {
            option.style.display = 'flex';
        } else {
            option.style.display = 'none';
        }
    });
};

window.openContactModal = function() {
    document.getElementById('contactModal').classList.add('active');
    
    selectedPlatform = { icon: 'fas fa-envelope', name: 'Email', color: '#6366F1', urlPattern: 'mailto:' };
    document.getElementById('selectedIcon').className = 'fas fa-envelope';
    document.getElementById('selectedIcon').style.color = '#6366F1';
    document.getElementById('selectedPlatform').textContent = 'Email';
    
    document.getElementById('contactName').value = '';
    document.getElementById('contactValue').value = '';
    document.getElementById('contactMessage').value = '';
    
    document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('selected'));
};

window.closeContactModal = function() {
    document.getElementById('contactModal').classList.remove('active');
    document.getElementById('iconDropdown').classList.remove('active');
};

window.saveContact = function() {
    const name = document.getElementById('contactName').value.trim();
    const value = document.getElementById('contactValue').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    if (!name || !value) {
        alert('❌ Please fill in label and value fields');
        return;
    }
    
    let link = value;
    if (selectedPlatform.urlPattern) {
        if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('mailto:') || value.startsWith('tel:')) {
            link = value;
        } else {
            link = selectedPlatform.urlPattern + value;
        }
    }
    
    const contact = {
        id: 'contact_' + Date.now(),
        icon: selectedPlatform.icon,
        iconColor: selectedPlatform.color,
        platform: selectedPlatform.name,
        label: name,
        value: value,
        link: link,
        message: message,
        date: new Date().toISOString()
    };
    
    contacts.push(contact);
    loadContacts();
    syncToGitHub();
    closeContactModal();
};

function loadContacts() {
    const list = document.getElementById('contactsList');
    
    if (contacts.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-icon">📧</div>
                <div class="empty-title">No contacts yet</div>
                <div class="empty-text">Add your social media and contact information</div>
            </div>
        `;
        return;
    }
    
    list.innerHTML = contacts.map(contact => `
        <div class="contact-card">
            <div class="contact-header">
                <div>
                    <div class="contact-icon-display">
                        <i class="${contact.icon}" style="color: ${contact.iconColor || '#6366F1'};"></i>
                    </div>
                    <div class="contact-name">${contact.label || contact.name || 'Unknown'}</div>
                    <div class="contact-email">${contact.value || contact.email || ''}</div>
                </div>
                <button class="btn btn-danger" onclick="deleteContact('${contact.id}')">🗑️</button>
            </div>
            ${contact.message ? `<div class="contact-message">${contact.message}</div>` : ''}
            <div class="contact-date">${contact.date ? new Date(contact.date).toLocaleString() : ''}</div>
        </div>
    `).join('');
}

window.deleteContact = function(id) {
    if (confirm('🗑️ Delete this contact?')) {
        contacts = contacts.filter(c => c.id !== id);
        loadContacts();
        syncToGitHub();
    }
};

window.loadConfigUI = function() {
    document.getElementById('githubToken').value = Config.token;
    document.getElementById('githubRepo').value = Config.repo;
    document.getElementById('adminPin').value = Config.pin;
};

window.saveConfig = function() {
    Config.token = document.getElementById('githubToken').value.trim();
    Config.repo = document.getElementById('githubRepo').value.trim();
    Config.pin = document.getElementById('adminPin').value.trim() || '1234';
    
    if (Config.save()) {
        alert('✅ Configuration saved successfully!\n\nYou can now sync to GitHub.');
    } else {
        alert('⚠️ Configuration saved in memory only\n\n(localStorage blocked - config will be lost on page refresh)');
    }
};

async function syncToGitHub() {
    if (!Config.isConfigured()) {
        updateSyncStatus('error', 'GitHub not configured');
        setTimeout(() => {
            updateSyncStatus('synced', 'Configure in Settings');
        }, 2000);
        return;
    }
    
    updateSyncStatus('syncing', 'Pushing to GitHub...');
    
    try {
        await uploadToGitHub('data/images.json', {
            images: images,
            folders: folders
        });
        
        await uploadToGitHub('data/projects.json', projects);
        
        await uploadToGitHub('data/contacts.json', contacts);
        
        updateSyncStatus('synced', 'Synced to GitHub ✓');
        
        setTimeout(() => {
            updateSyncStatus('synced', 'All changes saved');
        }, 2000);
    } catch (error) {
        console.error('GitHub sync error:', error);
        updateSyncStatus('error', 'Sync failed: ' + error.message);
        setTimeout(() => {
            updateSyncStatus('synced', 'Click to retry');
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

# Browser-Proof Portfolio Website

This portfolio website is completely refactored for **maximum browser compatibility** and works perfectly in all environments, including:

- ✅ Chrome, Firefox, Safari (desktop & mobile)
- ✅ In-app browsers (Instagram, WhatsApp, Telegram, Twitter, YouTube)
- ✅ Private/Incognito mode
- ✅ WebViews and restricted JavaScript environments

## 🔒 Architecture Overview

### **Data Storage: GitHub as Single Source of Truth**

- **NO localStorage, sessionStorage, or cookies** for core functionality
- All data stored in static JSON files (`/data/*.json`)
- Public site fetches data via HTTP (`fetch()` API)
- Admin panel pushes changes directly to GitHub via REST API

### **File Structure**

```
portfolio/
├── index.html          # Public-facing portfolio (READ-ONLY)
├── admin.html          # Admin panel for editing (GitHub integration)
├── data/
│   ├── projects.json   # Project data
│   ├── contacts.json   # Contact information
│   └── images.json     # Image URLs (base64 or external)
└── README.md           # This file
```

## 🚀 Setup Instructions

### **Step 1: Upload to GitHub Pages**

1. Create a new GitHub repository
2. Upload all files from this ZIP to the repository
3. Go to **Settings** → **Pages**
4. Set source to `main` branch, `/` (root)
5. Save and wait for deployment

### **Step 2: Configure Admin Panel**

1. Visit your portfolio at `https://yourusername.github.io/repo-name/`
2. Triple-click your name in the top-left corner to access admin panel
3. Enter your PIN (default: `1234` - **change this immediately in admin.html**)
4. Click "Setup GitHub Sync" in the admin panel
5. Enter your GitHub credentials:
   - **Username**: Your GitHub username
   - **Repository**: Repository name (e.g., `portfolio`)
   - **Branch**: `main` (or your default branch)
   - **Personal Access Token**: Create at https://github.com/settings/tokens
     - Required permissions: `repo` (full control of private repositories)
6. Save configuration

### **Step 3: Edit Content**

In the admin panel, you can:

- **Add/Edit Projects**: Title, description, tech stack, links, images
- **Add/Edit Contacts**: Email, LinkedIn, GitHub, etc.
- **Upload Images**: Add project screenshots
- **Push to GitHub**: Click "Sync to GitHub" to publish changes

All changes are saved to `/data/*.json` files and automatically appear on your live site.

## 🔐 Security Best Practices

1. **Change the Default PIN**
   - Open `admin.html`
   - Find `const ADMIN_PIN = '1234';`
   - Change to a secure 4-6 digit PIN

2. **Protect Your Personal Access Token**
   - Never share your GitHub token
   - Token is stored only for current session
   - Regenerate if compromised

3. **GitHub Repository**
   - Keep your repository **public** for GitHub Pages
   - Never commit sensitive data to `/data/*.json` files

## 🌐 How It Works

### Public Site (`index.html`)

```javascript
// On page load:
fetch('./data/projects.json')  // HTTP request
  .then(data => renderProjects(data))  // Display on page
  .catch(() => showDefaultContent())  // Fallback if fetch fails
```

- **No browser storage required**
- Works even if localStorage is blocked
- Graceful degradation if JSON files unavailable

### Admin Panel (`admin.html`)

```javascript
// When you click "Save Project":
1. Update local JSON data
2. Convert to base64
3. Push to GitHub via REST API:
   PUT /repos/:owner/:repo/contents/data/projects.json
4. GitHub automatically deploys updated file
5. Public site fetches new data on next load
```

- GitHub acts as your database
- No backend server required
- Fully static site hosting

## 📱 Browser Compatibility

| Feature | Implementation | Why |
|---------|---------------|-----|
| Data Loading | `fetch()` + JSON | Works universally, no storage APIs |
| Images | Base64 or URLs | No FileReader restrictions |
| Admin State | In-memory only | No persistence needed |
| GitHub Sync | REST API | Standard HTTP, works everywhere |

## 🛠️ Customization

### Change Personal Information

Edit `index.html`:
- Line 1326: Your name
- Lines 1347-1352: Hero section text
- Lines 1408-1412: About section

### Change Default Content

Edit `/data/*.json` files directly:
- `projects.json`: Add sample projects
- `contacts.json`: Add your real contact info
- `images.json`: Leave empty (upload via admin)

### Change PIN

Edit `admin.html`:
- Line ~1700: `const ADMIN_PIN = 'YOUR_NEW_PIN';`

## 🐛 Troubleshooting

### "Projects not loading"
- Check browser console for fetch errors
- Verify `/data/projects.json` exists
- Ensure files are uploaded to correct directory

### "GitHub sync not working"
- Verify Personal Access Token has `repo` permission
- Check repository name is exactly correct (case-sensitive)
- Ensure branch name is correct (`main` vs `master`)

### "Admin panel won't open"
- Triple-click your name quickly (within 0.6 seconds)
- Check browser console for errors
- Verify you haven't modified the logo click handler

### "Changes not appearing on site"
- Wait 1-2 minutes for GitHub Pages to rebuild
- Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Check `/data/*.json` files were updated in GitHub

## 📄 License

This portfolio template is provided as-is for personal use. Modify and customize as needed.

---

**Made browser-proof with ❤️ for universal compatibility**

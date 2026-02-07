# Portfolio Admin Panel

## Overview

This admin panel is architected to be **100% browser-proof** and works reliably across:
- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)
- ✅ In-app browsers (Instagram, WhatsApp, Telegram, Twitter, YouTube)
- ✅ Incognito/Private browsing modes
- ✅ Environments with blocked localStorage/cookies

## Architecture

### Data Flow
```
Admin Panel → GitHub API → /data/*.json → Public Website
```

### Key Principles

1. **GitHub as Single Source of Truth**
   - All data (images, projects, contacts) stored in JSON files
   - Admin panel pushes changes directly to GitHub via REST API
   - Public website reads from static JSON files via fetch()

2. **Zero Browser Storage Dependency**
   - NO localStorage for data persistence
   - NO sessionStorage
   - NO cookies required
   - Configuration stored in localStorage ONLY (optional, degrades gracefully)

3. **Fetch-Based Architecture**
   - All data loaded via HTTP requests
   - Cache-busting with timestamps
   - Graceful degradation on fetch failures

## Setup Instructions

### 1. Configure GitHub Repository

1. Create/use a GitHub repository for your portfolio
2. Ensure these directories exist:
   ```
   your-repo/
   ├── data/
   │   ├── images.json
   │   ├── projects.json
   │   └── contacts.json
   ├── admin.html
   ├── admin-config.js
   ├── admin-logic.js
   └── index.html (your main website)
   ```

### 2. Get GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Give it a name like "Portfolio Admin"
4. Select scope: **`repo`** (full control of private repositories)
5. Generate and **copy the token** (starts with `ghp_`)

### 3. Configure Admin Panel

1. Open `admin.html` in your browser
2. Enter PIN: `1234` (default)
3. Go to **Config** tab
4. Enter:
   - **GitHub Token**: Your personal access token
   - **GitHub Repo**: `username/repository-name`
   - **Admin PIN**: Your desired 4-digit PIN
5. Click **Save Config**

### 4. Deploy to GitHub Pages

1. Push all files to your repository:
   ```bash
   git add .
   git commit -m "Add admin panel"
   git push origin main
   ```

2. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main` / `root`
   - Save

3. Access your admin panel:
   ```
   https://username.github.io/repository/admin.html
   ```

## Usage Guide

### Managing Images

1. **Upload Images**
   - Click "Upload Images" or drag & drop
   - Images stored as base64 in `data/images.json`
   - Supports: PNG, JPG, GIF, WebP
   - Unlimited uploads

2. **Organize in Folders**
   - Create custom folders
   - Drag images between folders
   - Delete folders (images move to Uncategorized)

3. **Crop Images**
   - Click crop button on any image
   - Use cropper tools (zoom, rotate, scale)
   - Save cropped version

### Managing Projects

1. **Create Project**
   - Click "New Project"
   - Fill in details:
     - Title
     - Description
     - Technologies (comma-separated)
     - URL (optional)
   - Select unlimited images
   - Save

2. **Edit Project**
   - Click "Edit" on any project card
   - Modify details
   - Change images
   - Save

3. **Auto-Sliding Gallery**
   - Projects with multiple images auto-slide every 3 seconds
   - Shows all selected images

### Managing Contacts

1. **Add Contact**
   - Click "Add Contact"
   - Enter name, email, message
   - Save

2. **Delete Contact**
   - Click delete button on contact card

### Syncing to GitHub

**Automatic Sync**
- Every change automatically pushes to GitHub
- Watch sync status in header:
  - 🟢 "Synced to GitHub ✓" = Success
  - 🟡 "Syncing..." = In progress
  - 🔴 "Sync failed" = Error (check config)

**Manual Verification**
- Check your GitHub repository
- `data/` folder should update with each change
- Commits show "Update data/xxx.json via admin panel"

## File Structure

```
portfolio-admin/
├── admin.html              # Main admin interface
├── admin-config.js         # Configuration management
├── admin-logic.js          # Core logic + GitHub API
├── data/
│   ├── images.json        # Images + folders
│   ├── projects.json      # Projects data
│   └── contacts.json      # Contact submissions
└── README.md              # This file
```

## Data Format

### images.json
```json
{
  "images": [
    {
      "id": "img_1234567890_abc123",
      "name": "photo.jpg",
      "url": "data:image/jpeg;base64,...",
      "folder": "Portfolio",
      "created": "2024-01-01T00:00:00.000Z"
    }
  ],
  "folders": ["Uncategorized", "Portfolio", "UI-UX"]
}
```

### projects.json
```json
{
  "projects": [
    {
      "id": "proj_1234567890",
      "title": "My Project",
      "description": "Description here",
      "technologies": ["React", "Node.js"],
      "url": "https://example.com",
      "images": ["img_1234567890_abc123"],
      "created": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### contacts.json
```json
{
  "contacts": [
    {
      "id": "contact_1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Hello!",
      "date": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Browser Compatibility

### Tested Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)
- ✅ Samsung Internet
- ✅ Instagram In-App Browser
- ✅ WhatsApp In-App Browser
- ✅ Telegram In-App Browser

### Graceful Degradation
- **localStorage blocked**: Config lost on reload (still functional)
- **Fetch blocked**: Shows error message, doesn't crash
- **GitHub API down**: Shows sync error, data preserved in memory

## Security Notes

1. **Admin PIN**
   - Change default PIN (1234) immediately
   - 4-digit numeric code
   - Stored in browser config (optional)

2. **GitHub Token**
   - Treat as password - never share
   - Only needs `repo` scope
   - Can revoke anytime from GitHub settings

3. **Access Control**
   - Admin panel accessible to anyone with URL
   - PIN required to access dashboard
   - No server-side authentication
   - For personal use only

## Troubleshooting

### Sync Failed Error
1. Check GitHub token is valid
2. Verify repository name format: `username/repo`
3. Ensure token has `repo` scope
4. Check GitHub API rate limits

### Images Not Showing
1. Verify `data/images.json` exists in repo
2. Check browser console for fetch errors
3. Ensure GitHub Pages is enabled
4. Try cache-busting: `?t=timestamp` added automatically

### Can't Login
1. Check PIN in Config tab
2. Default PIN is `1234`
3. Clear browser and try again
4. Check browser console for errors

### Data Not Persisting
1. This is normal if localStorage is blocked
2. Data saved to GitHub, not browser
3. Reload will fetch from GitHub
4. Check sync status shows "Synced ✓"

## Advanced Configuration

### Custom PIN
Edit in Config tab or modify `admin-config.js`:
```javascript
pin: '1234'  // Change to your PIN
```

### Custom Folders
Default folders can be modified in `data/images.json`:
```json
{
  "folders": ["Custom1", "Custom2", "Custom3"]
}
```

### GitHub API Rate Limits
- 60 requests/hour (unauthenticated)
- 5000 requests/hour (authenticated with token)
- Each sync = 3 API calls (images, projects, contacts)

## Development Notes

### No Build Tools Required
- Pure HTML/CSS/JavaScript
- No npm, webpack, or bundlers
- Works directly in browser
- Deploy as-is

### External Dependencies
- Google Fonts (Inter)
- Cropper.js (CDN)
- GitHub REST API

### ES6 Features Used
- async/await
- fetch API
- arrow functions
- template literals
- destructuring

### Browser APIs Avoided
- ❌ localStorage (for data)
- ❌ sessionStorage
- ❌ IndexedDB
- ❌ Service Workers
- ❌ Cookies

## License

Free to use for personal and commercial projects.

## Support

For issues or questions:
1. Check browser console for errors
2. Verify GitHub token/repo configuration
3. Test in different browser
4. Check GitHub API status

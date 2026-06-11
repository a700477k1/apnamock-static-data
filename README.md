[Uploading README (3).md…]()
# ApnaMock Web - Cloudflare Pages

Free mock tests for Indian competitive exams (SSC, Banking, Railway, Teaching, Defence)

## 🚀 Quick Start

### 1. Create Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `apnamock-web`
3. Description: `ApnaMock - Free mock tests for Indian competitive exams`
4. Visibility: **Public** (required for Cloudflare Pages free tier)
5. Check **Add a README file**
6. Click **Create repository**

### 2. Upload Files

#### Option A: GitHub Web Interface (Easiest)
1. Open your new repository: `https://github.com/a700477k1/apnamock-web`
2. Click **Add file** → **Upload files**
3. Drag and drop all files from the `apnamock-web` folder
4. Commit message: `Initial upload`
5. Click **Commit changes**

#### Option B: Git Command Line
```bash
# Clone the repository
git clone https://github.com/a700477k1/apnamock-web.git
cd apnamock-web

# Copy all files from the apnamock-web folder
cp -r /path/to/apnamock-web/* .

# Add, commit, and push
git add .
git commit -m "Initial upload"
git push origin main
```

### 3. Connect to Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Click **Connect to Git**
4. Authorize Cloudflare to access your GitHub account
5. Select the `apnamock-web` repository
6. Configure build settings:
   - **Project name**: `apnamock-web`
   - **Production branch**: `main`
   - **Build command**: `echo "No build needed"`
   - **Build output directory**: `/` (root)
7. Click **Save and Deploy**

### 4. Your Site is Live!

After deployment (usually 1-2 minutes), your site will be available at:
- `https://apnamock-web.pages.dev`

## 📁 Repository Structure

```
apnamock-web/
├── index.html          # Homepage
├── tests.html          # Test catalog (create this)
├── quiz.html           # Quiz interface (create this)
├── result.html         # Results page (create this)
├── favorites.html      # Saved tests (create this)
├── history.html        # Test history (create this)
├── custom-tests.html   # Custom test builder (create this)
├── privacy.html        # Privacy policy (create this)
├── terms.html          # Terms of use (create this)
├── contact.html        # Contact page (create this)
├── css/
│   └── apnamock.css    # Main stylesheet
├── js/
│   ├── data-manager.js # Data caching & analytics
│   ├── apnamock-core.js
│   └── ...             # Other modules
├── data/
│   ├── tests-index.json  # Test metadata
│   └── tests/          # Individual test files
├── assets/
│   └── ...             # Images, logos
├── package.json        # Node.js config
├── wrangler.toml       # Cloudflare config
└── README.md           # This file
```

## 🔗 Related Repositories

- **Static Assets**: [apnamock-static-data](https://github.com/a700477k1/apnamock-static-data) - CSS, JS, test data served via jsDelivr

## 📝 Next Steps

1. Create additional HTML pages (tests.html, quiz.html, etc.)
2. Set up the [apnamock-static-data](https://github.com/a700477k1/apnamock-static-data) repository
3. Configure Google Apps Script for analytics
4. Add custom domain (optional)

## 🆘 Support

- Cloudflare Docs: https://developers.cloudflare.com/pages
- GitHub Docs: https://docs.github.com
- jsDelivr Docs: https://www.jsdelivr.com/documentation

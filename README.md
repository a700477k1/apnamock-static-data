[README (1).md](https://github.com/user-attachments/files/28777579/README.1.md)
# ApnaMock Static Assets

Static assets for ApnaMock served via jsDelivr CDN

## 🚀 Quick Start

### 1. Create Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `apnamock-static-data`
3. Description: `Static assets for ApnaMock - CSS, JS, test data`
4. Visibility: **Public** (required for jsDelivr CDN)
5. Check **Add a README file**
6. Click **Create repository**

### 2. Upload Files

#### Option A: GitHub Web Interface (Easiest)
1. Open your new repository: `https://github.com/a700477k1/apnamock-static-data`
2. Click **Add file** → **Upload files**
3. Drag and drop all files from the `apnamock-static-data` folder
4. Commit message: `Initial upload`
5. Click **Commit changes**

#### Option B: Git Command Line
```bash
# Clone the repository
git clone https://github.com/a700477k1/apnamock-static-data.git
cd apnamock-static-data

# Copy all files from the apnamock-static-data folder
cp -r /path/to/apnamock-static-data/* .

# Add, commit, and push
git add .
git commit -m "Initial upload"
git push origin main
```

### 3. Access Files via jsDelivr

Once uploaded, files are automatically available via jsDelivr CDN:

```
https://cdn.jsdelivr.net/gh/a700477k1/apnamock-static-data@main/css/apnamock.css
https://cdn.jsdelivr.net/gh/a700477k1/apnamock-static-data@main/js/apnamock-core.js
https://cdn.jsdelivr.net/gh/a700477k1/apnamock-static-data@main/data/tests-index.json
https://cdn.jsdelivr.net/gh/a700477k1/apnamock-static-data@main/data/tests/ssc-cgl-2024-tier1.json
```

**Note**: It may take 5-10 minutes after upload for jsDelivr to cache the files.

## 📁 Repository Structure

```
apnamock-static-data/
├── css/
│   └── apnamock.css        # Main stylesheet
├── js/
│   ├── apnamock-core.js    # Core functionality
│   ├── apnamock-ui.js      # UI components
│   ├── data-manager.js     # Data caching & analytics
│   ├── quiz.js             # Quiz logic
│   ├── result.js           # Results display
│   ├── favorites.js        # Favorites management
│   ├── history.js          # Test history
│   └── ...                 # Other modules
├── data/
│   ├── tests-index.json    # Test metadata (all 1000+ tests)
│   └── tests/              # Individual test files
│       ├── ssc-cgl-2024-tier1.json
│       ├── ssc-chsl-2024.json
│       ├── ibps-po-2023.json
│       └── ...             # More test files
├── assets/
│   ├── logo.png            # ApnaMock logo
│   ├── og-image.png        # Open Graph image
│   └── ...                 # Other images
└── README.md               # This file
```

## 📊 Test Data Format

### tests-index.json
```json
{
  "tests": [
    {
      "id": "ssc-cgl-2024-tier1",
      "title": "SSC CGL 2024 Tier 1",
      "exam": "SSC",
      "category": "CGL",
      "year": 2024,
      "questions": 100,
      "duration": 60,
      "difficulty": "moderate",
      "file": "data/tests/ssc-cgl-2024-tier1.json"
    }
  ],
  "total": 1000,
  "exams": ["SSC", "Banking", "Railway", "Teaching", "Defence", "State"]
}
```

### Individual Test File
```json
{
  "id": "ssc-cgl-2024-tier1",
  "title": "SSC CGL 2024 Tier 1",
  "sections": [...],
  "question_pool": [
    {
      "id": 1,
      "section": "General Intelligence",
      "type": "multiple_choice",
      "question": {
        "en": "English question text",
        "hi": "Hindi question text"
      },
      "options": [...],
      "correct_answer": "B",
      "explanation": {
        "en": "English explanation",
        "hi": "Hindi explanation"
      }
    }
  ]
}
```

## 🔄 Updating Files

When you update files in this repository, jsDelivr will automatically refresh the cache:

1. **Immediate update**: Use commit hash in URL
   ```
   https://cdn.jsdelivr.net/gh/a700477k1/apnamock-static-data@abc123/css/apnamock.css
   ```

2. **Purge cache**: Visit [jsdelivr.com](https://www.jsdelivr.com) and use the purge tool

3. **Wait for auto-refresh**: jsDelivr refreshes cache every few hours

## 📈 Scaling to 1000+ Tests

### File Organization
- Split tests by exam: `data/tests/ssc/`, `data/tests/banking/`
- Use pagination: Load 20 tests at a time
- Compress JSON: Minify test files to reduce size

### Performance Tips
- Use `localStorage` caching in browser (7-day cache)
- Lazy load test data only when needed
- Compress images before uploading

## 🔗 Related Repositories

- **Website**: [apnamock-web](https://github.com/a700477k1/apnamock-web) - Cloudflare Pages frontend

## 📝 Adding New Tests

1. Create test JSON file in `data/tests/`
2. Add test metadata to `data/tests-index.json`
3. Commit and push to GitHub
4. Wait 5-10 minutes for jsDelivr cache

## 🆘 Support

- jsDelivr Docs: https://www.jsdelivr.com/documentation
- GitHub Docs: https://docs.github.com
- CDN Cache Purge: https://www.jsdelivr.com/tools/purge

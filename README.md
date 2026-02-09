# Photography Portfolio

A modern, dark-themed photography portfolio website built with Vue 3 and Vite, designed for showcasing photography events and works.

## Features

- 🎨 **Dark Theme**: Professional black background with elegant design
- 📱 **Responsive**: Fully responsive design that works on all devices
- 🖼️ **Image Gallery**: Beautiful grid layout with lightbox viewer
- 🔧 **Easy to Configure**: Simple JSON-based configuration
- 🚀 **Fast**: Built with Vite for optimal performance
- 📦 **CI/CD**: Automated deployment to GitHub Pages

## Project Structure

```
├── public/
│   └── data/
│       └── portfolio.json    # Portfolio configuration
├── imgs/                     # Image storage
│   └── [event-name]/        # Event-specific folders
│       ├── cover.jpg
│       ├── photo1.jpg
│       └── ...
├── src/
│   ├── components/
│   │   ├── Header.vue       # Header with profile info
│   │   ├── EventGallery.vue # Event gallery component
│   │   └── Footer.vue       # Footer component
│   ├── App.vue              # Main app component
│   ├── main.js              # App entry point
│   └── style.css            # Global styles
└── .github/
    └── workflows/
        └── deploy.yml       # GitHub Actions workflow

```

## Configuration

Edit `public/data/portfolio.json` to customize your portfolio:

```json
{
  "info": {
    "name": "Your Name",
    "title": "Photographer",
    "description": "Capturing moments, creating memories",
    "links": [
      {
        "name": "Instagram",
        "url": "https://instagram.com/yourhandle",
        "icon": "instagram"
      }
    ]
  },
  "events": [
    {
      "id": "event-id",
      "name": "Event Name",
      "date": "2024-01-15",
      "location": "City, Country",
      "description": "Event description",
      "folder": "event-folder-name",
      "coverImage": "cover.jpg",
      "images": ["photo1.jpg", "photo2.jpg"]
    }
  ]
}
```

## Adding Events

1. Create a folder in `imgs/` with your event name (e.g., `imgs/wedding-2024/`)
2. Add your photos to the folder
3. Update `public/data/portfolio.json` with event details:
   - Set `folder` to match your folder name
   - List all image filenames in the `images` array

## Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

This project uses GitHub Actions to automatically deploy to GitHub Pages:

1. Push to the `main` branch
2. GitHub Actions will build and deploy automatically
3. Your site will be available at `https://[username].github.io/[repository-name]/`

### GitHub Pages Setup

1. Go to your repository Settings
2. Navigate to Pages
3. Under "Build and deployment", select "GitHub Actions" as the source

## Customization

### Supported Link Icons

- `instagram`: 📷
- `email`: ✉️
- `website`: 🌐
- `twitter`: 🐦
- `facebook`: 👤
- `linkedin`: 💼
- `github`: 💻

### Image Formats

Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

## License

This project is open source and available under the MIT License.


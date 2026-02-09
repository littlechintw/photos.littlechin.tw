# Photography Portfolio

A modern, dark-themed photography portfolio website built with Vue 3 and Vite, designed for showcasing photography works with a focus on the portfolio itself.

## Features

- 🎨 **Dark Theme**: Professional black background with elegant design
- 📱 **Responsive**: Fully responsive design that works on all devices
- 🖼️ **Image Gallery**: Beautiful grid layout with lightbox viewer
- 📊 **EXIF Data Display**: Hover over images to view camera settings and metadata
- 🔗 **Album Links**: Link to full albums (e.g., Google Photos) when showing limited previews
- 🎯 **Limited Display**: Show only a subset of images per event (configurable)
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
│       ├── photo1.jpg
│       ├── photo2.jpg
│       └── ...
├── src/
│   ├── components/
│   │   ├── Header.vue       # Minimal header with portfolio name and links
│   │   ├── EventGallery.vue # Event gallery with EXIF display
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
    "name": "Photography Portfolio",
    "links": [
      {
        "name": "Instagram",
        "url": "https://instagram.com/yourhandle",
        "icon": "instagram"
      }
    ]
  },
  "settings": {
    "maxImagesPerEvent": 6
  },
  "events": [
    {
      "id": "event-id",
      "name": "Event Name",
      "date": "2024-01-15",
      "location": "City, Country",
      "description": "Event description",
      "folder": "event-folder-name",
      "albumUrl": "https://photos.google.com/share/your-album-link",
      "maxImages": 6,
      "images": ["photo1.jpg", "photo2.jpg", "..."]
    }
  ]
}
```

### Configuration Fields

**Global Settings:**
- `settings.maxImagesPerEvent`: Default number of images to display per event (default: 6)

**Event Fields:**
- `id`: Unique identifier for the event
- `name`: Event name displayed as the heading
- `date`: Event date (ISO format recommended)
- `location`: Event location
- `description`: Brief description of the event
- `folder`: Name of the folder in `imgs/` containing event photos
- `albumUrl`: (Optional) Link to full album (e.g., Google Photos)
- `maxImages`: (Optional) Override global setting for this specific event
- `images`: Array of image filenames in the event folder

## Adding Events

1. Create a folder in `imgs/` with your event name (e.g., `imgs/wedding-2024/`)
2. Add your photos to the folder (with EXIF data for camera info display)
3. Update `public/data/portfolio.json` with event details:
   - Set `folder` to match your folder name
   - List all image filenames in the `images` array
   - Add `albumUrl` to link to the full album on Google Photos or similar
   - Set `maxImages` if you want to override the default limit for this event

## EXIF Data Display

When you hover over images, the portfolio will automatically extract and display:
- Camera make and model
- Lens information
- Camera settings (focal length, aperture, shutter speed, ISO)
- Date/time the photo was taken

**Note:** EXIF data must be embedded in the image files. Use tools like Adobe Lightroom or maintain EXIF data when exporting photos.

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


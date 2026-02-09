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
- 🗜️ **Automatic Image Compression**: Images are automatically compressed during build while preserving EXIF data
- 📅 **Flexible Date Formats**: Support for year-only, year-month, year-month-day, and date ranges

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
  - Single date: `"2024-01-15"` displays as "January 15, 2024"
  - Year only: `"2024"` displays as "2024"
  - Year-month: `"2024-01"` displays as "January 2024"
  - Date range (string): `"2024-01-15 to 2024-01-17"` displays as "January 15, 2024 - January 17, 2024"
  - Date range (object): `{"start": "2024-01-15", "end": "2024-01-17"}` or `{"start": "2024-01-15", "end": "2024-01-17", "format": "year-month"}`
- `location`: Event location
- `description`: Brief description of the event
- `folder`: Name of the folder in `imgs/` containing event photos
- `albumUrl`: (Optional) Link to full album (e.g., Google Photos)
- `maxImages`: (Optional) Override global setting for this specific event
- `images`: Array of image filenames in the event folder

**Date Format Examples:**

```json
{
  "events": [
    {
      "name": "Single Day Event",
      "date": "2024-01-15"
    },
    {
      "name": "Multi-day Event",
      "date": "2024-01-15 to 2024-01-17"
    },
    {
      "name": "Month-long Exhibition",
      "date": {"start": "2024-01", "end": "2024-02", "format": "year-month"}
    },
    {
      "name": "Annual Event",
      "date": "2024"
    }
  ]
}
```

## Adding Events

1. Create a folder in `imgs/` with your event name (e.g., `imgs/wedding-2024/`)
2. Add your photos to the folder (with EXIF data for camera info display)
3. Update `public/data/portfolio.json` with event details:
   - Set `folder` to match your folder name
   - List all image filenames in the `images` array
   - Add `albumUrl` to link to the full album on Google Photos or similar
   - Set `maxImages` if you want to override the default limit for this event

## Image Compression

Images are automatically compressed during the build process to optimize loading times:

- **Automatic**: Compression runs automatically before each build via the `prebuild` script
- **Smart Caching**: Already compressed images are skipped on subsequent builds
- **EXIF Preservation**: All camera metadata (EXIF data) is preserved during compression
- **Quality**: Images are compressed to 85% JPEG quality and resized to max 2400px dimension
- **Backup**: Original images are backed up with `.original` extension (excluded from git)
- **Manual Compression**: Run `npm run compress-images` to compress images without building

### Compression Settings

You can modify compression settings in `scripts/compress-images.js`:
- `QUALITY`: JPEG quality (default: 85)
- `MAX_DIMENSION`: Maximum width or height in pixels (default: 2400)

### Compression Metadata

The script maintains a `.compression-metadata.json` file in the `imgs/` directory to track which images have been compressed. This file is excluded from git.

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


# Public Assets

This folder contains static assets that are served directly without processing by Vite.

## Structure

```
public/
└── assets/
    ├── images/    # Static images (logos, backgrounds, etc.)
    ├── icons/     # Icon files (favicons, app icons, etc.)
    └── fonts/     # Custom font files
```

## Usage

Files in this directory can be referenced in your code using absolute paths from the root:

```tsx
// Example: Referencing an image
<img src="/assets/images/logo.png" alt="Logo" />

// Example: Referencing in CSS
background-image: url('/assets/images/background.jpg');
```

## Notes

- Assets in this folder are **not** processed by Vite (no minification, hashing, etc.)
- Use this for assets that should maintain their original filenames
- For images imported in components, consider using imports instead for better optimization
- The public folder is copied as-is to the dist folder during build

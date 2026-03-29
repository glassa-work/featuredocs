# featuredocs

A versioned product feature documentation platform built with Next.js 15.

## Features

- **Versioned documentation** — each version is a snapshot, users can switch between versions
- **Embedded video players** — custom `::video[filename]` directive in markdown
- **User feedback** — select text and mark it as outdated, report videos, or submit general feedback
- **Admin dashboard** — manage all feedback from `/admin` with filtering and status updates
- **Markdown rendering** — remark + rehype pipeline with GFM support
- **SQLite storage** — lightweight feedback storage via better-sqlite3 (no external database)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
featuredocs/
├── src/
│   ├── app/               — Next.js App Router pages and API routes
│   ├── components/        — React components
│   └── lib/               — Content loading, database, types
├── content/               — Documentation content (markdown + videos)
│   └── nesta/             — Example product
└── .data/                 — SQLite database (gitignored)
```

## Adding a New Product

1. Create a directory under `content/` with your product slug:

   ```
   content/my-product/
   ```

2. Add a `product.json` file:

   ```json
   {
     "name": "My Product",
     "tagline": "A short tagline",
     "description": "Longer description of the product.",
     "versions": ["1.0.0"],
     "latest": "1.0.0"
   }
   ```

3. Create a version directory:

   ```
   content/my-product/v1.0.0/
   ```

4. Add a `features.json` file in the version directory:

   ```json
   {
     "version": "1.0.0",
     "releaseDate": "2026-01-15",
     "features": [
       {
         "slug": "my-feature",
         "title": "My Feature Title",
         "summary": "A brief summary of this feature.",
         "video": "videos/demo.mp4",
         "isNew": true
       }
     ]
   }
   ```

5. Create a markdown file for each feature using its slug:

   ```
   content/my-product/v1.0.0/my-feature.md
   ```

6. Optionally add video files:

   ```
   content/my-product/v1.0.0/videos/demo.mp4
   ```

## Adding a New Version

1. Add the version to the product's `product.json`:
   - Add the version string to the `versions` array (newest first)
   - Update `latest` if this is the newest version

2. Create the version directory and its `features.json`

3. Create markdown files for each feature. You can copy from the previous version and update as needed.

## Markdown Syntax

Standard markdown plus a custom video directive:

```markdown
# Feature Title

Regular markdown content here...

::video[videos/demo.mp4]

More content...

::video[videos/another.mp4]{title="Optional Title"}
```

## Feedback System

Users can submit feedback in three ways:

1. **Text selection** — select text on a feature page, click "Mark as outdated"
2. **Video report** — hover over a video player, click the flag icon
3. **General report** — click "Report outdated" button on any feature page

All feedback is stored in SQLite at `.data/feedback.db` and can be managed from the admin dashboard at `/admin`.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS v4
- remark + rehype for markdown
- better-sqlite3 for feedback storage

## Production Deployment

For production, consider replacing file-based SQLite with [Turso](https://turso.tech/) or [libSQL](https://github.com/tursodatabase/libsql) for serverless compatibility. The SQLite operations in `src/lib/feedback-db.ts` are the only file that needs updating.

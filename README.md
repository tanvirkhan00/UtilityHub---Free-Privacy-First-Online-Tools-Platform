# 🛠️ UtilityHub – Free Privacy-First Online Tools Platform

[![React](https://img.shields.io/badge/React-19.0-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/)

> **A modern, blazingly fast suite of 32+ free productivity utilities, file converters, creator tools, and developer helpers — running 100% client-side in your browser with zero data collection.**

---

## ✨ Highlights

- 🔒 **100% Client-Side & Private**: All PDFs, images, text, and data are processed entirely inside your browser memory using HTML5 Canvas, Web APIs, and WebAssembly. No files or personal text are ever uploaded to any backend server.
- 🎮 **Signature TypeRush Typing Speed Game**: Gamified keyboard velocity trainer featuring Arcade Falling Words defense, 15s/30s/60s Speed Sprints, Developer Code Ninja mode, and zero-latency synthetic mechanical switch click audio.
- 🛡️ **Fiverr Message Safety Checker**: Pre-flight heuristic scanner for freelancers to detect off-platform payment traps, TOS violations, sensitive contact leaks, and obtain safe rewrite suggestions.
- ⚡ **Lightning Fast & Lightweight**: Powered by **React 19**, **Vite 8**, and **Tailwind CSS v4** for instant responsiveness and sub-second load times.
- 🎨 **Sleek UX & Dual Theme**: Native Dark/Light mode with zero-flicker pre-mount and system appearance sync.
- ⌨️ **Power-User Command Palette**: Press `Ctrl + K` (or `Cmd + K`) anywhere to jump to any tool instantly, or `Ctrl + J` to toggle themes.

---

## 🧰 Included Tools & Categories (32+ Utilities)

### 🎮 Featured Games & Dexterity
* **TypeRush: Keyboard Typing Speed Practice Game** (NEW & HIGHLIGHTED!) – Arcade Falling Words defense, 15s/30s/60s Speed Sprints, Developer Code Ninja mode, live mechanical keyboard sounds, on-screen keyboard visualizer, and WPM rank tiers.

### 🛡️ Freelancer Safety Suite
* **Fiverr Message Safety Checker** – Real-time policy scanner for freelance messages with risk level scoring, keyword highlighting, safe replacement suggestions, and 6+ vetted response templates.

### 📄 PDF Utilities
* **PDF Merger** – Combine multiple PDF files with drag-and-drop page reordering.
* **PDF Splitter** – Extract specific page ranges into separate PDF documents.
* **JPG to PDF** – Convert single or multiple images into a clean PDF document.
* **PDF Rotator** – Rotate upside-down or landscape pages permanently.
* **PDF Compressor** – Optimize and reduce PDF file size directly in-browser.
* **PDF Metadata Editor** – View and edit Title, Author, Subject, and Keywords.

### 🖼️ Image & Visual Tools
* **Image Quality Improver & Upscaler** (NEW!) – Unblur soft edges, boost micro-contrast, enhance sharpness, and 2x/4x HD upscale with interactive before/after split slider.
* **Image to Public Link Generator** (NEW!) – Instant public CDN links, markdown embeds, HTML snippets, and live mobile QR code generator.
* **Image Compressor** – Shrink WebP, JPEG, and PNG file sizes with custom quality control.
* **Image Resizer** – Resize image dimensions by exact pixels or percentage scale.
* **Image Cropper** – Crop visual assets with freeform or standard aspect ratios.
* **Format Converter** – Convert between PNG, JPEG, WebP, SVG, and BMP.
* **Image to Base64** – Encode images into Data URI strings, CSS backgrounds, or HTML tags.
* **Eyedropper Color Picker** – Inspect image pixel colors with instant RGB and HEX extraction.
* **Background Eraser** – Intelligent contiguous flood-fill and one-click auto background eraser with transparent PNG export.

### 🎨 Creator & Social Media Tools
* **Custom QR Code Generator** – Generate high-res QR codes with custom foreground/background colors and instant PNG download.
* **Social Media Image Resizer** – One-click presets for YouTube banners, Instagram posts/stories, Twitter headers, and LinkedIn covers.
* **Meme Generator** – Create classic top/bottom text memes with custom fonts and stickers.
* **Open Graph Previewer** – Preview how your website URLs look when shared on Facebook, Twitter, and LinkedIn.
* **Color Palette Generator** – Generate harmonious 5-color palettes with hex codes, copy shortcuts, and Spacebar randomization.
* **Favicon Generator** – Generate multi-size browser favicons (16x16, 32x32, 48x48) from any image.

### 🔤 Text & Developer Tools
* **Word & Character Counter** – In-depth text metrics (reading time, speaking time, word/line/paragraph count).
* **Markdown Live Previewer** – Real-time GitHub-flavored Markdown editor with split preview and HTML export.
* **JSON Formatter & Validator** – Beautify, validate, minify, and inspect JSON with syntax error reporting.
* **Case Converter** – Convert text to camelCase, snake_case, kebab-case, PascalCase, UPPERCASE, and Title Case.
* **Text Cleaner** – Strip extra spaces, remove HTML tags, erase empty lines, or remove punctuation.
* **Duplicate Line Remover** – De-duplicate list items with case-sensitivity options and sorting.
* **Text Diff Checker** – Side-by-side visual diff comparison highlighting added, removed, and modified lines.
* **UUID v4 Generator** – Generate cryptographically secure UUIDs/GUIDs in bulk with hyphen/uppercase toggles.
* **URL Encoder / Decoder** – Encode and decode URI components and query strings safely.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed:
- **Node.js**: `v18.0.0` or higher (recommended: `v20.x` or `v22.x`)
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/utilityhub.git
   cd utilityhub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The optimized production bundle will be generated in the `dist/` directory.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Open global Command Palette (Search utilities or type theme commands) |
| `Ctrl + J` / `Cmd + J` | Quick toggle between Dark Mode and Light Mode |
| `Spacebar` | Generate a new randomized color palette (inside Color Palette Tool) |
| `Escape` | Close active modals, dropdowns, and Command Palette |

---

## 🏗️ Tech Stack & Architecture

- **Framework**: React 19 with TypeScript
- **Bundler & Tooling**: Vite 8 & TSX
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Client Libraries**:
  - `pdf-lib` (in-memory PDF manipulation)
  - `qrcode` (SVG and Canvas QR generation)
  - `canvas-confetti` (interactive feedback celebrations)

---

## 🤝 Contributing

Contributions, feature requests, and suggestions are always welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingTool`)
3. Commit your Changes (`git commit -m 'Add some AmazingTool'`)
4. Push to the Branch (`git push origin feature/AmazingTool`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## ⚠️ Disclaimer

*UtilityHub is an independent open-source platform. The Fiverr Message Safety Checker is an unofficial community aid and is not affiliated with, endorsed by, or sponsored by Fiverr International Ltd. Users are advised to review the official terms of service for any third-party platform.*

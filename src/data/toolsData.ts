import { ToolMeta } from '../types';

export const TOOLS: ToolMeta[] = [
  // Signature Tool
  {
    id: 'fiverr-safety-checker',
    name: 'Fiverr Message Safety Checker',
    slug: 'fiverr-safety-checker',
    category: 'fiverr',
    iconName: 'ShieldCheck',
    badge: 'Signature',
    description: 'Scan your freelance messages for terms that trigger Fiverr policy flags, off-platform traps, or warning strikes.',
    longDescription: 'An independent pre-flight safety scanner for freelancers on Fiverr. Identifies risky phrases like direct payments, off-platform contact info (Skype, WhatsApp, Email, Telegram), sensitive passwords, and suggests safe, professional alternatives.',
    keywords: ['fiverr', 'safety checker', 'freelance warning', 'tos violation', 'skype detection', 'off platform payment', 'freelancer communication'],
    features: [
      'Comprehensive regex & contextual heuristic scanner',
      'Categorized risk evaluation (Review Needed, Potential Risk, Informational)',
      'Side-by-side highlighted text preview with direct replacement suggestions',
      '6+ ready-to-use compliant message templates for clients',
      '100% Client-side processing — your client messages never leave your browser'
    ],
    instructions: [
      { step: 1, title: 'Paste your draft message', desc: 'Type or paste the client message you intend to send into the input editor.' },
      { step: 2, title: 'Run instant scan', desc: 'The analyzer runs locally against vetted Fiverr Terms of Service risk patterns.' },
      { step: 3, title: 'Review highlighted risks', desc: 'Review detected keywords, risk reasons, and click suggested compliant rewrites.' },
      { step: 4, title: 'Copy safe message', desc: 'Copy your polished, compliant message directly into your Fiverr inbox with peace of mind.' }
    ],
    faqs: [
      { question: 'Is this an official Fiverr tool?', answer: 'No. UtilityHub is an independent platform and has no affiliation, endorsement, or sponsorship with Fiverr International Ltd. Always check the official Fiverr Terms of Service for binding platform rules.' },
      { question: 'Do my messages get stored on a server?', answer: 'Never. All analysis executes directly in your browser using local JavaScript rules. No text is transmitted or logged anywhere.' },
      { question: 'Will this guarantee my account will never get a warning?', answer: 'No automated tool can provide a 100% legal guarantee. This utility is designed to catch common pitfalls, accidental contact disclosures, and risky phrasing before you press send.' }
    ],
    clientSideOnly: true
  },

  // PDF Tools
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    slug: 'pdf-merger',
    category: 'pdf',
    iconName: 'FileStack',
    badge: 'Popular',
    description: 'Combine multiple PDF documents into a single organized file with custom page reordering.',
    longDescription: 'Merge two or more PDF files seamlessly in your browser using pure client-side PDF-lib. Reorder files via drag and drop before combining.',
    keywords: ['merge pdf', 'combine pdf', 'join pdf documents', 'merge pdf online free'],
    features: [
      'Client-side file merging with zero server uploads',
      'Reorder uploaded documents effortlessly',
      'Preserves original vector quality, bookmarks, and links',
      'Fast processing on multiple files up to 50MB each'
    ],
    instructions: [
      { step: 1, title: 'Select PDF files', desc: 'Upload two or more PDF documents you wish to combine.' },
      { step: 2, title: 'Arrange order', desc: 'Drag or use the up/down arrows to position files in your desired sequence.' },
      { step: 3, title: 'Merge & Download', desc: 'Click "Merge PDFs" and your unified PDF file will be assembled and downloaded.' }
    ],
    faqs: [
      { question: 'Are my confidential documents uploaded?', answer: 'No. All PDF operations happen in your browser memory via WebAssembly and JavaScript. No bytes ever leave your device.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    slug: 'pdf-splitter',
    category: 'pdf',
    iconName: 'Scissors',
    badge: 'Popular',
    description: 'Extract specific page ranges or split every page of your PDF into standalone documents.',
    longDescription: 'Easily separate large PDF documents into manageable chapters or individual pages with custom range selections (e.g. 1-3, 5, 8-12).',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'pdf page extractor'],
    features: [
      'Extract custom page ranges (e.g. 1-5, 8, 11-14)',
      'Split into individual one-page PDFs',
      'Preview total page count before processing',
      '100% private, client-side PDF extraction'
    ],
    instructions: [
      { step: 1, title: 'Upload your PDF', desc: 'Drop or select the PDF document you want to divide.' },
      { step: 2, title: 'Specify page ranges', desc: 'Enter pages or page ranges you want to extract.' },
      { step: 3, title: 'Download separated file', desc: 'Download your newly extracted document immediately.' }
    ],
    faqs: [
      { question: 'What is the format for page ranges?', answer: 'You can use commas and hyphens, for instance: "1-3, 5, 7-10".' }
    ],
    clientSideOnly: true
  },
  {
    id: 'pdf-rotator',
    name: 'PDF Page Rotator',
    slug: 'pdf-rotator',
    category: 'pdf',
    iconName: 'RotateCw',
    badge: 'New',
    description: 'Permanently rotate upside-down or sideways pages in your PDF document by 90, 180, or 270 degrees.',
    longDescription: 'Fix scanned orientations across your entire PDF or target specific pages. Apply permanent rotation and download a clean output file.',
    keywords: ['rotate pdf', 'fix upside down pdf', 'turn pdf pages', 'rotate pdf 90 degrees'],
    features: [
      'Rotate all pages or selective pages',
      'Clockwise 90°, 180°, and Counter-clockwise 270° options',
      'Permanent embedded orientation save',
      'Instant local processing'
    ],
    instructions: [
      { step: 1, title: 'Upload PDF', desc: 'Select the PDF with pages that need orientation correction.' },
      { step: 2, title: 'Select rotation angle', desc: 'Choose 90° Clockwise, 180° Flip, or 270° Counter-Clockwise.' },
      { step: 3, title: 'Save and download', desc: 'Click "Rotate PDF" to generate and download the corrected document.' }
    ],
    faqs: [
      { question: 'Does this recompress or degrade the text?', answer: 'No. Page rotation alters the viewport matrix in the PDF metadata without re-encoding fonts or vectors.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'jpg-to-pdf',
    name: 'Image to PDF Converter',
    slug: 'jpg-to-pdf',
    category: 'pdf',
    iconName: 'FileImage',
    badge: 'Popular',
    description: 'Convert JPG, PNG, and WEBP photos into a clean, print-ready PDF document.',
    longDescription: 'Turn receipts, scans, photos, and graphic designs into a standard multi-page or single-page PDF document with custom margins and page fit options.',
    keywords: ['jpg to pdf', 'image to pdf', 'png to pdf', 'convert photos to pdf'],
    features: [
      'Supports JPG, JPEG, PNG, and WEBP images',
      'Reorder images before generating PDF',
      'Auto-fit or retain original image aspect ratios',
      'Instant client-side PDF compilation'
    ],
    instructions: [
      { step: 1, title: 'Add images', desc: 'Upload your photos or scans.' },
      { step: 2, title: 'Reorder if needed', desc: 'Drag or organize images in the desired page sequence.' },
      { step: 3, title: 'Generate PDF', desc: 'Click "Convert to PDF" to download the assembled document.' }
    ],
    faqs: [
      { question: 'Is there a limit on how many images I can convert?', answer: 'You can convert multiple images at once directly in your browser.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'pdf-compressor',
    name: 'PDF Optimizer & Compressor',
    slug: 'pdf-compressor',
    category: 'pdf',
    iconName: 'Minimize2',
    description: 'Optimize PDF file structure and strip redundant objects to reduce file footprint.',
    longDescription: 'Client-side PDF optimizer that rewrites PDF cross-reference streams and cleans redundant metadata to minimize document size.',
    keywords: ['compress pdf', 'reduce pdf size', 'optimize pdf', 'shrink pdf'],
    features: [
      'Structural PDF stream compression',
      'Strips unnecessary document bloat and duplicate references',
      'Fast client-side calculation with before/after size readout',
      'Completely secure and private'
    ],
    instructions: [
      { step: 1, title: 'Select PDF', desc: 'Upload your bulky PDF file.' },
      { step: 2, title: 'Optimize stream', desc: 'Our in-browser compressor analyzes and deflates the internal object streams.' },
      { step: 3, title: 'Download lightweight PDF', desc: 'Save your optimized PDF directly to your device.' }
    ],
    faqs: [
      { question: 'Will text clarity be affected?', answer: 'No. Vector text and font glyphs remain crisp and unaffected.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'pdf-metadata',
    name: 'PDF Metadata Viewer & Stripper',
    slug: 'pdf-metadata',
    category: 'pdf',
    iconName: 'FileSearch',
    description: 'Inspect document author, creator, creation date, and strip sensitive tracking metadata.',
    longDescription: 'View internal PDF properties such as Author, Producer, Creator Tool, Creation Date, Modification Date, and Keywords. Strip them with one click for anonymous sharing.',
    keywords: ['pdf metadata', 'remove pdf author', 'inspect pdf properties', 'strip pdf tracking'],
    features: [
      'Inspect Title, Author, Subject, Keywords, and Creator app',
      'One-click "Sanitize & Strip All Metadata"',
      'Download sanitized anonymous PDF',
      '100% browser-based security inspection'
    ],
    instructions: [
      { step: 1, title: 'Upload PDF', desc: 'Choose any PDF file to inspect.' },
      { step: 2, title: 'Inspect fields', desc: 'Review extracted metadata properties and creation timestamps.' },
      { step: 3, title: 'Strip & Export', desc: 'Clear all metadata tags and download a scrubbed copy.' }
    ],
    faqs: [
      { question: 'Why remove metadata?', answer: 'PDFs often contain your computer username, operating system, and editing software details, which can pose privacy risks.' }
    ],
    clientSideOnly: true
  },

  // Image Tools
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    category: 'image',
    iconName: 'FileArchive',
    badge: 'Popular',
    description: 'Compress JPG, PNG, and WEBP images with real-time quality slider and instant byte savings.',
    longDescription: 'Compress your photos and illustrations up to 80% without noticeable quality loss. Uses client-side canvas rasterization with adjustable quality control and live side-by-side comparison.',
    keywords: ['image compressor', 'compress jpg', 'reduce png size', 'compress webp online'],
    features: [
      'Adjustable compression quality from 10% to 100%',
      'Live before and after file size comparison & savings calculation',
      'Supports JPG, PNG, and WEBP inputs',
      'Immediate download with preserved dimensions'
    ],
    instructions: [
      { step: 1, title: 'Upload an image', desc: 'Drag and drop or select your photo.' },
      { step: 2, title: 'Adjust quality slider', desc: 'Slide to balance image clarity against file size.' },
      { step: 3, title: 'Download compressed image', desc: 'Check the file savings and download the optimized image.' }
    ],
    faqs: [
      { question: 'Is my image uploaded to any server?', answer: 'No. All compression is executed locally on your browser hardware using the HTML5 Canvas API.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer',
    category: 'image',
    iconName: 'Maximize',
    badge: 'Popular',
    description: 'Resize image dimensions by pixels or percentage with aspect ratio lock and presets.',
    longDescription: 'Change width and height of any image with precision. Includes aspect ratio preservation, custom percentage scaling (25%, 50%, 75%), and instant preview.',
    keywords: ['image resizer', 'resize picture', 'change image dimensions', 'scale photo'],
    features: [
      'Custom pixel width & height controls',
      'One-click aspect ratio locking',
      'Preset scaling options (25%, 50%, 75%, 200%)',
      'Smooth high-quality bicubic interpolation'
    ],
    instructions: [
      { step: 1, title: 'Upload image', desc: 'Drop the image file you want to scale.' },
      { step: 2, title: 'Enter dimensions', desc: 'Specify new width or height, or pick a percentage scale.' },
      { step: 3, title: 'Download', desc: 'Save the resized image directly.' }
    ],
    faqs: [
      { question: 'Does it distort my image?', answer: 'Not if you keep the aspect ratio lock enabled, which automatically calculates the matching dimension.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    slug: 'image-cropper',
    category: 'image',
    iconName: 'Crop',
    badge: 'New',
    description: 'Crop images to standard ratios (1:1, 16:9, 4:3, 9:16) or custom freeform rectangles.',
    longDescription: 'Focus on what matters in your photos. Interactive cropping tool with ratio presets for Instagram square, YouTube 16:9, Stories 9:16, or freeform drag handles.',
    keywords: ['crop image', 'photo cropper', 'square crop', '16:9 image crop'],
    features: [
      'Interactive visual crop marquee',
      'Popular aspect ratio locks (1:1, 16:9, 4:3, 9:16, Freeform)',
      'Live cropped preview with dimension readout',
      'Crisp high-resolution export'
    ],
    instructions: [
      { step: 1, title: 'Upload image', desc: 'Select any picture you want to crop.' },
      { step: 2, title: 'Adjust bounding box', desc: 'Select an aspect ratio preset and position the crop area.' },
      { step: 3, title: 'Export cropped image', desc: 'Download your newly framed visual.' }
    ],
    faqs: [
      { question: 'Will original image resolution be kept?', answer: 'The crop extracts pixels at full 1:1 fidelity from the source image coordinates.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'format-converter',
    name: 'Image Format Converter',
    slug: 'format-converter',
    category: 'image',
    iconName: 'RefreshCw',
    badge: 'Popular',
    description: 'Convert between JPG, PNG, and modern high-efficiency WEBP formats instantly.',
    longDescription: 'Easily convert transparent PNGs to JPG, turn heavy JPGs into next-gen WEBP files, or convert photos with full control over background fills for transparent assets.',
    keywords: ['jpg to png', 'png to jpg', 'convert to webp', 'image format converter'],
    features: [
      'Bi-directional conversion between JPG, PNG, and WEBP',
      'Custom background color selector for transparent PNG to JPG conversion',
      'Quality tuning for lossy WEBP and JPG',
      'Instant local canvas rendering'
    ],
    instructions: [
      { step: 1, title: 'Upload image', desc: 'Choose a JPG, PNG, or WEBP file.' },
      { step: 2, title: 'Select target format', desc: 'Pick your desired output format and settings.' },
      { step: 3, title: 'Convert & Download', desc: 'Click convert to immediately receive the converted file.' }
    ],
    faqs: [
      { question: 'What happens to transparency when converting PNG to JPG?', answer: 'JPG does not support transparency, so you can choose a clean background fill color (default white).' }
    ],
    clientSideOnly: true
  },
  {
    id: 'image-to-base64',
    name: 'Image to Base64 Encoder',
    slug: 'image-to-base64',
    category: 'image',
    iconName: 'Binary',
    description: 'Convert image files into Base64 Data URI strings for inline HTML, CSS, or JSON.',
    longDescription: 'Generate raw Base64 data strings, CSS `background-image: url(...)` code, and HTML `<img src="..." />` tags ready for copy-pasting into your code.',
    keywords: ['image to base64', 'base64 image encoder', 'data uri generator', 'embed image in html'],
    features: [
      'Generates Data URI, HTML img tag, and CSS background code',
      'Live image preview alongside generated code',
      'One-click copy to clipboard',
      'Shows exact string character length and base64 overhead'
    ],
    instructions: [
      { step: 1, title: 'Upload image', desc: 'Drag in an icon, logo, or image.' },
      { step: 2, title: 'Choose format', desc: 'Pick Data URI, CSS snippet, or HTML tag.' },
      { step: 3, title: 'Copy code', desc: 'Click copy and paste directly into your project.' }
    ],
    faqs: [
      { question: 'When should I use Base64 images?', answer: 'Base64 is ideal for small icons, loaders, and email templates to reduce extra HTTP requests.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'color-picker',
    name: 'Image Color Picker & Palette Extractor',
    slug: 'color-picker',
    category: 'image',
    iconName: 'Pipette',
    description: 'Pick colors directly from photos, view HEX / RGB / HSL values, and extract dominant color palettes.',
    longDescription: 'Interactive canvas eyedropper tool. Hover over any pixel to inspect magnified coordinates, pick exact hex codes, and automatically extract the top 6 dominant colors from your photograph.',
    keywords: ['color picker', 'image eyedropper', 'extract palette from photo', 'hex color picker'],
    features: [
      'Interactive pixel-level magnifier eyedropper',
      'System EyeDropper API support where supported by browser',
      'Hex, RGB, and HSL values with quick copy buttons',
      'Auto-extracted 6-swatch dominant image palette'
    ],
    instructions: [
      { step: 1, title: 'Upload image', desc: 'Select any graphic, illustration, or photo.' },
      { step: 2, title: 'Click on image', desc: 'Hover or click anywhere on the image canvas to sample colors.' },
      { step: 3, title: 'Copy color codes', desc: 'Copy HEX, RGB, or HSL codes with a single click.' }
    ],
    faqs: [
      { question: 'Can I copy the entire extracted palette?', answer: 'Yes! The extracted color palette allows you to copy individual colors or all hex codes at once.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'background-remover',
    name: 'Image Background Eraser',
    slug: 'background-remover',
    category: 'image',
    iconName: 'Eraser',
    description: 'Erase solid backgrounds, isolate subjects with adjustable color thresholding, and export transparent PNGs.',
    longDescription: 'High-speed client-side background removal using color-distance clustering and tolerance thresholding. Perfect for logos, graphics, signatures, and solid-backdrop photos without external server latency.',
    keywords: ['remove background', 'transparent background maker', 'isolate subject', 'erase background'],
    features: [
      'Interactive background sample color selector',
      'Adjustable tolerance & edge feathering sliders',
      'Transparent checkered preview with dark/light backdrop toggles',
      'Export crisp transparent PNG locally'
    ],
    instructions: [
      { step: 1, title: 'Upload graphic or photo', desc: 'Add an image with a solid or high-contrast background.' },
      { step: 2, title: 'Sample background color', desc: 'Click on the background area you wish to remove.' },
      { step: 3, title: 'Adjust tolerance & Download', desc: 'Tweak tolerance to eliminate halos and download your transparent PNG.' }
    ],
    faqs: [
      { question: 'Does this use an external cloud server?', answer: 'No. This operates 100% locally via Canvas pixel manipulation. For complex human hair on busy backgrounds, deep learning models are typically required, but for logos, products, signatures, and high-contrast visuals, this client tool is instant and private.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'image-quality-improver',
    name: 'Image Quality Improver & Upscaler',
    slug: 'image-quality-improver',
    category: 'image',
    iconName: 'Sparkles',
    badge: 'Popular',
    description: 'Enhance photo sharpness, unblur soft edges, boost vibrancy, and upscale to 2x/4x HD resolution.',
    longDescription: 'Restore blurry photos, improve micro-contrast, sharpen soft edges, and upscale images up to 2x and 4x using in-browser unsharp convolution kernels, adaptive histogram equalization, and interactive before/after split comparison slider.',
    keywords: ['image quality improver', 'unblur image', 'photo enhancer', 'super resolution', 'sharpen image', 'hd upscale'],
    features: [
      'Unsharp mask convolution to recover blurry details and crisp edges',
      '2x HD and 4x Ultra HD bicubic super-resolution upscaling',
      'Interactive Before/After split comparison drag slider',
      '5 one-click presets: Smart Auto, Unblur, 2x HD, Vibrant Pop, and Low-Light Shadow Fix',
      'Granular controls for sharpness, clarity, dynamic contrast, and color saturation',
      '100% private in-browser GPU & Canvas hardware accelerated processing'
    ],
    instructions: [
      { step: 1, title: 'Upload your image', desc: 'Drop any blurry, soft, or low-resolution photo (JPG, PNG, WEBP).' },
      { step: 2, title: 'Select preset or tweak sliders', desc: 'Choose "Smart Auto Enhance" or slide sharpness, clarity, and 2x HD upscale.' },
      { step: 3, title: 'Compare difference', desc: 'Drag the interactive split slider left and right to inspect the dramatic improvement.' },
      { step: 4, title: 'Download HD photo', desc: 'Download your enhanced high-definition image instantly.' }
    ],
    faqs: [
      { question: 'Does it upload my photos to any AI cloud servers?', answer: 'No! All convolution filtering, edge enhancement, and HD upscaling execute 100% client-side in your browser memory.' },
      { question: 'Can this fix out-of-focus camera pictures?', answer: 'Yes. The high-pass unsharp mask algorithm amplifies high-frequency edge gradients to bring back sharpness.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'image-to-public-link-generator',
    name: 'Image to Public Link Generator',
    slug: 'image-to-public-link-generator',
    category: 'image',
    iconName: 'Link2',
    badge: 'New',
    description: 'Upload any image to generate instant shareable public URLs, direct CDN links, HTML embed tags, and mobile QR codes.',
    longDescription: 'Turn any picture from your device into an instantly accessible public web link. Generates direct CDN image links for hotlinking, markdown tags for GitHub & Notion, HTML embed snippets for websites, BBCode for forums, and on-screen QR codes for smartphone scanning.',
    keywords: ['image to link', 'image url generator', 'upload image get link', 'image hosting free', 'image to qr code', 'shareable image link'],
    features: [
      'Generates instant Direct Image URLs (HTTPS) for fast hotlinking and sharing',
      'One-click Markdown (`![alt](url)`) and HTML (`<img src="..." />`) embed snippets',
      'Instant smartphone QR Code generated directly on-screen for mobile camera scanning',
      'BBCode tags ready for forums and online message boards',
      'Supports JPG, PNG, WEBP, GIF, and SVG files',
      'Zero account creation or login required'
    ],
    instructions: [
      { step: 1, title: 'Upload image', desc: 'Select or drop any photo, screenshot, logo, or diagram from your device.' },
      { step: 2, title: 'Instant link generation', desc: 'The tool allocates a public URL and prepares embed tags and QR codes.' },
      { step: 3, title: 'Copy or scan', desc: 'Click "Copy Direct Link" or scan the QR code from your phone to share anywhere.' }
    ],
    faqs: [
      { question: 'Do I need an account or API key?', answer: 'No. The link generator works immediately with zero signup, credit card, or API key configuration.' },
      { question: 'Where can I paste the generated links?', answer: 'Everywhere: GitHub, Discord, Notion, Slack, forums, email newsletters, and HTML websites.' }
    ],
    clientSideOnly: true
  },

  // Creator & Social Media Tools
  {
    id: 'typing-speed-game',
    name: 'TypeRush: Sky Altitude Floater & Turbo Racing Game',
    slug: 'typing-speed-game',
    category: 'creator',
    iconName: 'Gamepad2',
    badge: 'Featured Game',
    description: 'Keep your pointer floating in the sky by typing rapidly, race AI cars in Turbo Grand Prix, and blast enemy drones in Space Blaster!',
    longDescription: 'Features the custom Sky Altitude Floater where keyboard typing provides upward lift against gravity to keep your flyer soaring, plus Turbo Grand Prix car racing and Space Blaster defender!',
    keywords: ['typing speed game', 'sky floater typing', 'keep pointer floating typing', 'typeracer game', 'nitro type', 'space blaster typing', 'car racing typing test', 'wpm race battle', 'keyboard typing practice'],
    features: [
      'Sky Altitude Floater: Real-time gravity physics where typing lifts your pointer/flyer into the stratosphere',
      'Selectable flyers: Paraglider, Hot Air Balloon, Aero Jetpack, Golden Falcon, or UFO Drone',
      'Turbo Grand Prix car racing battle with 3 AI competitors (Rookie to Legend)',
      'Galaxy Space Blaster defender mode with laser cannons, shields, and alien waves',
      'Dynamic climb rates (m/s), altitude meters, emergency parachutes, and peak height recording',
      'Realistic mechanical key sounds, thrusters whoosh, and audio feedback via Web Audio API'
    ],
    instructions: [
      { step: 1, title: 'Choose your game mode', desc: 'Select Sky Altitude Floater to keep your flyer airborne, Turbo Grand Prix for car racing, or Space Blaster.' },
      { step: 2, title: 'Type prompt words', desc: 'Type each word smoothly. In Sky mode, typing faster generates upward lift against falling gravity.' },
      { step: 3, title: 'Trigger combos and boosts', desc: 'Chain consecutive words without errors to unleash booster thrusts or nitro speed acceleration.' },
      { step: 4, title: 'Reach peak altitude and win trophies', desc: 'Reach the highest altitude or claim 1st place on the podium to set new personal records.' }
    ],
    faqs: [
      { question: 'How does the Sky Altitude Floater work?', answer: 'Gravity constantly pulls your pointer downward towards the ground. Every keystroke generates upward aerodynamic lift, and completing words triggers booster thrusters to keep your flyer climbing into the stratosphere!' },
      { question: 'Can I play offline without internet?', answer: 'Yes! All flight physics, competitor curves, and sound effects execute 100% locally in your browser.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    category: 'creator',
    iconName: 'QrCode',
    badge: 'Popular',
    description: 'Generate customizable, high-resolution QR codes for websites, Wi-Fi networks, text, and vCards.',
    longDescription: 'Create professional QR codes with custom foreground and background colors, configurable error correction levels (L, M, Q, H), size adjustments, and instant high-res PNG or SVG export.',
    keywords: ['qr code generator', 'make qr code', 'custom qr code', 'wifi qr code', 'free qr code'],
    features: [
      'Supports URLs, Plain Text, Wi-Fi Login, and Contact vCards',
      'Custom foreground & background color pickers',
      'Configurable Error Correction Level (up to 30% damage tolerance)',
      'Export high-resolution PNG or crisp vector SVG'
    ],
    instructions: [
      { step: 1, title: 'Select content type', desc: 'Choose URL, Wi-Fi details, or text.' },
      { step: 2, title: 'Customize appearance', desc: 'Adjust colors, margin padding, and size.' },
      { step: 3, title: 'Download QR code', desc: 'Download as a ready-to-print PNG or scalable SVG.' }
    ],
    faqs: [
      { question: 'Do these QR codes expire?', answer: 'Never. These are direct, static QR codes that encode your data directly into the pixel matrix. No redirects or expiring accounts.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'social-resizer',
    name: 'Social Media Image Resizer',
    slug: 'social-resizer',
    category: 'creator',
    iconName: 'Share2',
    badge: 'Popular',
    description: 'Format photos for YouTube thumbnails, Instagram posts & stories, LinkedIn banners, and Twitter/X.',
    longDescription: 'Stop guessing social media dimensions. Choose from tested platform presets with intelligent center-cropping and framing for YouTube, Instagram, Facebook, LinkedIn, and X.',
    keywords: ['social media image resizer', 'youtube thumbnail size', 'instagram post resizer', 'linkedin banner size'],
    features: [
      'Presets for YouTube Thumbnail (1280x720), IG Square (1080x1080), IG Story (1080x1920), X/Twitter (1600x900), LinkedIn (1200x627)',
      'Smart fit modes: Cover, Contain with background blur, or Pad with custom color',
      'Live platform aspect ratio preview',
      'High-quality PNG/JPG download'
    ],
    instructions: [
      { step: 1, title: 'Upload image', desc: 'Select any high-resolution image.' },
      { step: 2, title: 'Select social platform preset', desc: 'Click YouTube, Instagram, LinkedIn, or Twitter preset.' },
      { step: 3, title: 'Choose fit mode & export', desc: 'Select Cover or Blurred Padding, then download.' }
    ],
    faqs: [
      { question: 'What is the best format for YouTube thumbnails?', answer: '1280x720 pixels in JPG or PNG format under 2MB, which this tool generates automatically.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'meme-generator',
    name: 'Meme Generator',
    slug: 'meme-generator',
    category: 'creator',
    iconName: 'Smile',
    description: 'Create viral memes with custom top & bottom captions, Impact font, text outlines, and live preview.',
    longDescription: 'Design classic and modern memes in seconds. Upload your own image or choose a popular starter template, add text with customizable sizes and stroke outlines, and export directly.',
    keywords: ['meme generator', 'make a meme', 'impact font meme', 'create funny meme'],
    features: [
      'Classic bold Impact font with crisp black outline stroke',
      'Top and Bottom caption inputs with size sliders',
      'Upload custom image or pick starter templates',
      'Instant canvas render and download'
    ],
    instructions: [
      { step: 1, title: 'Upload or choose image', desc: 'Select your meme template or upload any photo.' },
      { step: 2, title: 'Add captions', desc: 'Type your top and bottom punchlines.' },
      { step: 3, title: 'Download & Share', desc: 'Export high-res meme image ready to post.' }
    ],
    faqs: [
      { question: 'Are watermarks added?', answer: 'Zero watermarks. UtilityHub exports 100% clean memes.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'og-preview',
    name: 'Open Graph Social Card Previewer',
    slug: 'og-preview',
    category: 'creator',
    iconName: 'LayoutTemplate',
    badge: 'New',
    description: 'Simulate how your website link card will look when shared on X (Twitter), Facebook, LinkedIn, and Discord.',
    longDescription: 'Ensure your Open Graph title, description, and social share image look impeccable before going live. Preview real-time mockups for Twitter Large Cards, Facebook Link Previews, LinkedIn, and Discord embeds.',
    keywords: ['open graph preview', 'social card simulator', 'twitter card preview', 'og image tester'],
    features: [
      'Live simulations for X (Twitter) Large Card, Facebook Feed, LinkedIn Post, and Discord Embed',
      'Custom Title, Description, Site Name, and Image upload preview',
      'Generates copy-paste HTML meta tags for your <head>',
      'Checks recommended character lengths and image dimensions'
    ],
    instructions: [
      { step: 1, title: 'Enter metadata', desc: 'Input your page title, description, and site URL.' },
      { step: 2, title: 'Upload share image', desc: 'Drop your 1200x630 OG banner image.' },
      { step: 3, title: 'Review & Copy tags', desc: 'Preview across social platforms and copy the ready-to-use HTML meta tags.' }
    ],
    faqs: [
      { question: 'What is the ideal Open Graph image size?', answer: '1200 x 630 pixels with an aspect ratio of 1.91:1 ensures perfect display across Twitter, Facebook, and LinkedIn.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'color-palette',
    name: 'Color Palette Generator',
    slug: 'color-palette',
    category: 'creator',
    iconName: 'Palette',
    description: 'Generate harmonious color palettes with locking, hex codes, and CSS variable export.',
    longDescription: 'Explore trending color harmonies (Monochromatic, Analogous, Complementary, Triadic). Lock your favorite shades, hit spacebar or click generate to randomize, and export as CSS variables or Tailwind classes.',
    keywords: ['color palette generator', 'color schemes', 'hex palette', 'css color variables'],
    features: [
      'Generate 5-shade balanced color schemes',
      'Lock individual colors while regenerating others',
      'Harmony modes: Complementary, Analogous, Triadic, Monochromatic',
      'Export as CSS variables, Tailwind tokens, or JSON'
    ],
    instructions: [
      { step: 1, title: 'Generate colors', desc: 'Click "Generate" or press spacebar to shuffle new schemes.' },
      { step: 2, title: 'Lock favorites', desc: 'Click the lock icon on shades you want to keep.' },
      { step: 3, title: 'Export palette', desc: 'Copy Hex codes or export clean CSS variables for your project.' }
    ],
    faqs: [
      { question: 'Can I manually tweak a color?', answer: 'Yes! Click any color swatch to open the hex color picker.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'favicon-generator',
    name: 'Favicon & App Icon Generator',
    slug: 'favicon-generator',
    category: 'creator',
    iconName: 'Sparkle',
    description: 'Convert any logo or graphic into 16x16, 32x32, 48x48, and 180x180 Apple Touch icons.',
    longDescription: 'Create complete web icon packages in seconds. Upload your logo to generate standard browser favicons (16x16, 32x32, 48x48) and high-res Apple Touch icons (180x180), complete with copy-paste HTML tags.',
    keywords: ['favicon generator', 'make favicon', 'apple touch icon', 'website icon creator'],
    features: [
      'Generates 16x16 (classic favicon), 32x32 (standard tab), 48x48, and 180x180 (iOS Apple Touch)',
      'Live browser tab preview mockup',
      'Copy-paste HTML `<link rel="icon">` snippet',
      'Individual icon downloads'
    ],
    instructions: [
      { step: 1, title: 'Upload square logo', desc: 'Upload a 512x512 PNG or high-res icon graphic.' },
      { step: 2, title: 'Preview resolutions', desc: 'Check clarity at small 16x16 and 32x32 sizes.' },
      { step: 3, title: 'Download icons', desc: 'Download icons and copy the header HTML tags.' }
    ],
    faqs: [
      { question: 'What file format works best?', answer: 'A transparent PNG with a 1:1 square aspect ratio delivers the cleanest results.' }
    ],
    clientSideOnly: true
  },

  // Text & Productivity Tools
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    slug: 'word-counter',
    category: 'text',
    iconName: 'FileText',
    badge: 'Popular',
    description: 'Count words, characters, sentences, paragraphs, and calculate estimated reading & speaking time.',
    longDescription: 'Comprehensive writing metrics analyzer. Tracks words, characters (with and without spaces), sentences, paragraphs, reading time, speaking duration, and top keyword frequencies in real time.',
    keywords: ['word counter', 'character counter', 'reading time calculator', 'sentence counter'],
    features: [
      'Real-time metrics: words, characters, sentences, paragraphs',
      'Estimated reading time (225 wpm) and speech duration (140 wpm)',
      'Keyword density frequency table',
      'Direct copy and clear controls'
    ],
    instructions: [
      { step: 1, title: 'Type or paste text', desc: 'Paste your essay, article, or post into the editor.' },
      { step: 2, title: 'Review live metrics', desc: 'See instantaneous counts and reading duration updates.' },
      { step: 3, title: 'Analyze keywords', desc: 'Inspect keyword repetition to optimize SEO density.' }
    ],
    faqs: [
      { question: 'How is reading time calculated?', answer: 'Based on the average adult reading speed of 225 words per minute.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'markdown-previewer',
    name: 'Markdown Editor & Live Previewer',
    slug: 'markdown-previewer',
    category: 'text',
    iconName: 'BookOpen',
    badge: 'Popular',
    description: 'Write Markdown with real-time rendered preview, table formatting, code highlights, and HTML export.',
    longDescription: 'Distraction-free Markdown workspace. Supports standard GitHub Flavored Markdown (headings, tables, blockquotes, lists, code blocks, task items) with side-by-side rendering and one-click HTML / Markdown export.',
    keywords: ['markdown previewer', 'markdown editor', 'markdown to html', 'gfm editor'],
    features: [
      'Side-by-side split view editor and renderer',
      'Supports headings, lists, tables, links, code blocks, and blockquotes',
      'One-click export to raw Markdown (.md) or clean HTML',
      'Preloaded sample cheatsheet guide'
    ],
    instructions: [
      { step: 1, title: 'Write Markdown', desc: 'Type in the left editor or load our sample template.' },
      { step: 2, title: 'View live render', desc: 'The right panel shows formatted typography in real time.' },
      { step: 3, title: 'Export', desc: 'Download as .md or copy the generated HTML.' }
    ],
    faqs: [
      { question: 'Does this support tables and checkboxes?', answer: 'Yes! GitHub Flavored Markdown tables and task lists are fully rendered.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    slug: 'json-formatter',
    category: 'text',
    iconName: 'Braces',
    badge: 'Popular',
    description: 'Format, prettify, minify, and validate JSON data with clear syntax error indicators.',
    longDescription: 'Clean up messy JSON strings. Beautify with 2-space or 4-space indentation, minify for payload reduction, and immediately spot syntax errors with line and column indicators.',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'minify json', 'format json online'],
    features: [
      'Beautify with 2-space or 4-space indentation',
      'Minify / compact JSON for API payloads',
      'Instant syntax validation with exact error description',
      'Direct copy and JSON file download'
    ],
    instructions: [
      { step: 1, title: 'Paste JSON', desc: 'Paste raw JSON into the input box.' },
      { step: 2, title: 'Format or Minify', desc: 'Click "Beautify" to indent or "Minify" to strip whitespace.' },
      { step: 3, title: 'Validate and Copy', desc: 'Check the validity badge and copy formatted JSON.' }
    ],
    faqs: [
      { question: 'Is my JSON data secure?', answer: 'Yes. Processing uses JavaScript JSON.parse/stringify strictly in your browser session.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    slug: 'case-converter',
    category: 'text',
    iconName: 'Type',
    description: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, kebab-case, and snake_case.',
    longDescription: 'Easily switch case styles for code, copy, titles, and variables. Includes UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, PascalCase, and CONSTANT_CASE.',
    keywords: ['case converter', 'camelcase converter', 'title case online', 'snake case', 'kebab case'],
    features: [
      '8+ instant case transformations',
      'Preserves original numbers and underscores where appropriate',
      'One-click copy for every converted case variant',
      'Word and character counters included'
    ],
    instructions: [
      { step: 1, title: 'Enter text', desc: 'Paste or type your sentence or variable name.' },
      { step: 2, title: 'Choose style', desc: 'Click on any case style card to copy that format.' },
      { step: 3, title: 'Paste anywhere', desc: 'Use in your code, documentation, or marketing copy.' }
    ],
    faqs: [
      { question: 'What is camelCase vs PascalCase?', answer: 'camelCase starts with a lowercase letter (e.g. userProfile), while PascalCase capitalizes the first letter (e.g. UserProfile).' }
    ],
    clientSideOnly: true
  },
  {
    id: 'text-cleaner',
    name: 'Text Cleaner & Whitespace Sanitizer',
    slug: 'text-cleaner',
    category: 'text',
    iconName: 'Sparkles',
    description: 'Remove extra spaces, blank lines, strip HTML tags, and clean up messy copied text.',
    longDescription: 'Strip formatting junk from web copy and PDFs. Remove duplicate spaces, eliminate blank lines, strip HTML tags, and normalize quotes and line breaks with customizable toggle switches.',
    keywords: ['text cleaner', 'remove extra spaces', 'strip html tags', 'remove empty lines'],
    features: [
      'Remove duplicate and trailing spaces',
      'Remove blank lines or condense multiple empty lines to one',
      'Strip HTML/XML tags',
      'Normalize smart quotes into straight ASCII quotes'
    ],
    instructions: [
      { step: 1, title: 'Paste dirty text', desc: 'Paste copy copied from PDFs, emails, or messy web sources.' },
      { step: 2, title: 'Toggle cleaning rules', desc: 'Select which cleanup filters you want to apply.' },
      { step: 3, title: 'Copy clean text', desc: 'Copy the sanitized output.' }
    ],
    faqs: [
      { question: 'Can this remove HTML tags?', answer: 'Yes! Toggle "Strip HTML Tags" to remove tags while keeping text content.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'duplicate-remover',
    name: 'Duplicate Line Remover',
    slug: 'duplicate-remover',
    category: 'text',
    iconName: 'ListFilter',
    description: 'Find and remove duplicate lines from lists, emails, keywords, and datasets.',
    longDescription: 'Deduplicate large text lists instantly. Choose case-sensitive or case-insensitive matching, sort results alphabetically or preserve original order, and view duplicate counts.',
    keywords: ['remove duplicate lines', 'deduplicate list', 'unique lines extractor', 'list cleaner'],
    features: [
      'Instant deduplication with duplicate count report',
      'Preserve original order or sort A-Z / Z-A',
      'Case-sensitive toggle and trim-whitespace options',
      'Handles thousands of lines without lag'
    ],
    instructions: [
      { step: 1, title: 'Paste your list', desc: 'Paste items separated by newlines.' },
      { step: 2, title: 'Configure options', desc: 'Select case sensitivity and sorting order.' },
      { step: 3, title: 'Copy unique list', desc: 'Review how many duplicates were pruned and copy the clean list.' }
    ],
    faqs: [
      { question: 'Can it sort the cleaned list?', answer: 'Yes, you can choose between Preserving Original Order, Ascending (A-Z), or Descending (Z-A).' }
    ],
    clientSideOnly: true
  },
  {
    id: 'diff-checker',
    name: 'Text Difference Checker',
    slug: 'diff-checker',
    category: 'text',
    iconName: 'GitCompare',
    description: 'Compare two text snippets side-by-side to highlight added, removed, and altered lines.',
    longDescription: 'Easily spot differences between two revisions of code, contracts, or copy. Provides side-by-side comparison with color-coded green additions and red deletions.',
    keywords: ['text diff checker', 'compare text', 'text difference', 'diff viewer online'],
    features: [
      'Side-by-side comparative diff display',
      'Highlights additions (green) and deletions (red)',
      'Line-by-line alignment',
      'Fast client-side comparison algorithm'
    ],
    instructions: [
      { step: 1, title: 'Enter Original Text', desc: 'Paste the original baseline text in the left pane.' },
      { step: 2, title: 'Enter Modified Text', desc: 'Paste the modified version in the right pane.' },
      { step: 3, title: 'Compare Differences', desc: 'Review highlighted changes and summary stats.' }
    ],
    faqs: [
      { question: 'Is this suitable for code snippets?', answer: 'Yes! It handles code, JSON, plain text, and configuration files.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'uuid-generator',
    name: 'UUID / GUID Generator',
    slug: 'uuid-generator',
    category: 'text',
    iconName: 'Fingerprint',
    description: 'Generate cryptographically secure RFC4122 Version 4 UUIDs in bulk.',
    longDescription: 'Produce single or bulk UUIDs (GUIDs) using the browser\'s native `crypto.randomUUID()` API. Toggle uppercase/lowercase, hyphens, and bulk quantity up to 100 at once.',
    keywords: ['uuid generator', 'guid generator', 'random uuid', 'bulk uuid generator', 'v4 uuid'],
    features: [
      'Uses cryptographically secure window.crypto',
      'Generate up to 100 UUIDs in one click',
      'Uppercase or lowercase styling',
      'Include or exclude hyphens',
      'One-click copy all or individual UUIDs'
    ],
    instructions: [
      { step: 1, title: 'Choose quantity', desc: 'Select how many UUIDs you need (1 to 100).' },
      { step: 2, title: 'Customize format', desc: 'Choose uppercase/lowercase and hyphen options.' },
      { step: 3, title: 'Generate & Copy', desc: 'Click generate and copy individually or all at once.' }
    ],
    faqs: [
      { question: 'Are these truly random?', answer: 'Yes. They are generated using the browser\'s hardware-backed cryptographic random number generator complying with RFC 4122 version 4.' }
    ],
    clientSideOnly: true
  },
  {
    id: 'url-encoder',
    name: 'URL & Base64 String Encoder / Decoder',
    slug: 'url-encoder',
    category: 'text',
    iconName: 'Link',
    description: 'Encode and decode query strings, URI components, and Base64 UTF-8 text strings.',
    longDescription: 'Convert special characters into percent-encoded URL components (`encodeURIComponent`), parse encoded query strings, or encode/decode UTF-8 strings to and from Base64 with instant output.',
    keywords: ['url encoder', 'url decoder', 'base64 encoder', 'decode uri', 'percent encoding'],
    features: [
      'Two-in-one URL and Base64 converter',
      'Handles full UTF-8 Unicode characters safely',
      'Live bi-directional encode / decode modes',
      'One-click swap and copy controls'
    ],
    instructions: [
      { step: 1, title: 'Select mode', desc: 'Choose URL Encoding or Base64 Encoding.' },
      { step: 2, title: 'Input string', desc: 'Paste text or encoded payload.' },
      { step: 3, title: 'Copy result', desc: 'Copy the safely encoded or decoded string.' }
    ],
    faqs: [
      { question: 'Does this handle emojis and special symbols?', answer: 'Yes. Our encoder uses complete UTF-8 byte stream processing to avoid garbled Unicode symbols.' }
    ],
    clientSideOnly: true
  }
];

export const POPULAR_TOOLS = TOOLS.filter(t => t.badge === 'Popular' || t.badge === 'Signature');
export const FEATURED_TOOLS = TOOLS.slice(0, 8);

export const TOOLS_CATALOG = TOOLS;

export const getToolBySlug = (slug: string): ToolMeta | undefined => {
  return TOOLS.find(t => t.slug === slug);
};

export const getToolsByCategory = (category: string): ToolMeta[] => {
  return TOOLS.filter(t => t.category === category);
};

export const searchTools = (query: string): ToolMeta[] => {
  const q = query.toLowerCase().trim();
  if (!q) return TOOLS;
  return TOOLS.filter(
    t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some(k => k.toLowerCase().includes(q))
  );
};

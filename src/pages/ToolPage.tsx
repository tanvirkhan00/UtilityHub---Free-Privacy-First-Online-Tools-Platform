import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getToolBySlug } from '../data/toolsData';
import { ToolLayout } from '../components/ToolLayout/ToolLayout';

// Tool Components
import { FiverrSafetyChecker } from '../tools/fiverr/FiverrSafetyChecker';
import { PdfMerger } from '../tools/pdf/PdfMerger';
import { PdfSplitter } from '../tools/pdf/PdfSplitter';
import { JpgToPdf } from '../tools/pdf/JpgToPdf';
import { PdfRotator } from '../tools/pdf/PdfRotator';
import { PdfCompressor } from '../tools/pdf/PdfCompressor';
import { PdfMetadata } from '../tools/pdf/PdfMetadata';
import { ImageCompressor } from '../tools/image/ImageCompressor';
import { ImageResizer } from '../tools/image/ImageResizer';
import { ImageCropper } from '../tools/image/ImageCropper';
import { FormatConverter } from '../tools/image/FormatConverter';
import { ImageToBase64 } from '../tools/image/ImageToBase64';
import { ColorPickerTool } from '../tools/image/ColorPickerTool';
import { BackgroundEraser } from '../tools/image/BackgroundEraser';
import { QrCodeGenerator } from '../tools/creator/QrCodeGenerator';
import { SocialMediaResizer } from '../tools/creator/SocialMediaResizer';
import { MemeGenerator } from '../tools/creator/MemeGenerator';
import { OgPreview } from '../tools/creator/OgPreview';
import { ColorPaletteTool } from '../tools/creator/ColorPaletteTool';
import { FaviconGenerator } from '../tools/creator/FaviconGenerator';
import { WordCounter } from '../tools/text/WordCounter';
import { MarkdownPreviewer } from '../tools/text/MarkdownPreviewer';
import { JsonFormatter } from '../tools/text/JsonFormatter';
import { CaseConverter } from '../tools/text/CaseConverter';
import { TextCleaner } from '../tools/text/TextCleaner';
import { DuplicateRemover } from '../tools/text/DuplicateRemover';
import { DiffChecker } from '../tools/text/DiffChecker';
import { UuidGenerator } from '../tools/text/UuidGenerator';
import { UrlEncoder } from '../tools/text/UrlEncoder';

export const ToolPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? getToolBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (tool) {
      document.title = `${tool.name} — Modern UtilityHub`;
    }
  }, [tool]);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Tool Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400">
          The requested tool could not be located in our catalog.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-xs"
        >
          Return to Tools Catalog
        </Link>
      </div>
    );
  }

  const renderToolComponent = () => {
    switch (tool.slug) {
      case 'fiverr-safety-checker':
        return <FiverrSafetyChecker />;
      case 'pdf-merger':
        return <PdfMerger />;
      case 'pdf-splitter':
        return <PdfSplitter />;
      case 'jpg-to-pdf':
        return <JpgToPdf />;
      case 'pdf-rotator':
        return <PdfRotator />;
      case 'pdf-compressor':
        return <PdfCompressor />;
      case 'pdf-metadata':
        return <PdfMetadata />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'image-cropper':
        return <ImageCropper />;
      case 'format-converter':
        return <FormatConverter />;
      case 'image-to-base64':
        return <ImageToBase64 />;
      case 'color-picker':
        return <ColorPickerTool />;
      case 'background-eraser':
        return <BackgroundEraser />;
      case 'qr-code-generator':
        return <QrCodeGenerator />;
      case 'social-media-resizer':
        return <SocialMediaResizer />;
      case 'meme-generator':
        return <MemeGenerator />;
      case 'og-preview':
        return <OgPreview />;
      case 'color-palette':
        return <ColorPaletteTool />;
      case 'favicon-generator':
        return <FaviconGenerator />;
      case 'word-counter':
        return <WordCounter />;
      case 'markdown-preview':
        return <MarkdownPreviewer />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'case-converter':
        return <CaseConverter />;
      case 'text-cleaner':
        return <TextCleaner />;
      case 'duplicate-remover':
        return <DuplicateRemover />;
      case 'diff-checker':
        return <DiffChecker />;
      case 'uuid-generator':
        return <UuidGenerator />;
      case 'url-encoder':
        return <UrlEncoder />;
      default:
        return (
          <div className="p-8 text-center text-slate-500">
            Tool implementation is loading...
          </div>
        );
    }
  };

  return (
    <ToolLayout tool={tool}>
      {renderToolComponent()}
    </ToolLayout>
  );
};

"use client";

import VideoPlayer from "./VideoPlayer";

interface MarkdownRendererProps {
  html: string;
  productSlug: string;
  featureSlug: string;
  version: string;
  onReportVideo?: (videoReference: string) => void;
}

export default function MarkdownRenderer({
  html,
  productSlug,
  featureSlug,
  version,
  onReportVideo,
}: MarkdownRendererProps) {
  const parts = splitHtmlByVideoEmbeds(html);

  return (
    <div className="prose-featuredocs">
      {parts.map((part, index) => {
        if (part.type === "html") {
          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: part.content }}
            />
          );
        }
        const videoSrc = `/api/content/${productSlug}/v${version}/${part.video}`;
        return (
          <VideoPlayer
            key={index}
            src={videoSrc}
            title={part.title}
            productSlug={productSlug}
            featureSlug={featureSlug}
            version={version}
            onReportVideo={onReportVideo}
          />
        );
      })}
    </div>
  );
}

type ContentPart =
  | { type: "html"; content: string }
  | { type: "video"; video: string; title?: string };

function splitHtmlByVideoEmbeds(html: string): ContentPart[] {
  const parts: ContentPart[] = [];
  const videoPattern =
    /<div class="video-embed" data-video="([^"]+)"(?:\s+title="([^"]+)")?\s*><\/div>/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = videoPattern.exec(html)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "html",
        content: html.slice(lastIndex, match.index),
      });
    }

    parts.push({
      type: "video",
      video: match[1],
      title: match[2] || undefined,
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    parts.push({
      type: "html",
      content: html.slice(lastIndex),
    });
  }

  return parts;
}

"use client";

import { useState, useCallback } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import TextSelectionFeedback from "./TextSelectionFeedback";
import FeedbackDialog from "./FeedbackDialog";

interface FeaturePageClientProps {
  html: string;
  productSlug: string;
  featureSlug: string;
  version: string;
}

export default function FeaturePageClient({
  html,
  productSlug,
  featureSlug,
  version,
}: FeaturePageClientProps) {
  const [videoReportRef, setVideoReportRef] = useState<string | null>(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  const handleReportVideo = useCallback((videoReference: string) => {
    setVideoReportRef(videoReference);
    setIsVideoDialogOpen(true);
  }, []);

  return (
    <div className="relative">
      <TextSelectionFeedback
        product={productSlug}
        feature={featureSlug}
        version={version}
      />
      <MarkdownRenderer
        html={html}
        productSlug={productSlug}
        featureSlug={featureSlug}
        version={version}
        onReportVideo={handleReportVideo}
      />
      <FeedbackDialog
        isOpen={isVideoDialogOpen}
        onClose={() => {
          setIsVideoDialogOpen(false);
          setVideoReportRef(null);
        }}
        product={productSlug}
        feature={featureSlug}
        version={version}
        type="video"
        videoReference={videoReportRef ?? undefined}
      />
    </div>
  );
}

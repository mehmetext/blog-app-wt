"use client";

import { Button } from "@/components/ui/button";
import { Copy, Facebook, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ShareButtons({ content }: { content: string }) {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  return (
    <div className="sticky top-1/4 flex flex-row lg:flex-col gap-4">
      <Button size="icon" variant="ghost" asChild>
        <Link
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
          )}&text=${encodeURIComponent(content)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter />
          <span className="sr-only">Twitter&apos;da Paylaş</span>
        </Link>
      </Button>

      <Button size="icon" variant="ghost" asChild>
        <Link
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook />
          <span className="sr-only">Facebook&apos;ta Paylaş</span>
        </Link>
      </Button>

      <Button size="icon" variant="ghost" asChild>
        <Link
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin />
          <span className="sr-only">LinkedIn&apos;de Paylaş</span>
        </Link>
      </Button>

      <Button size="icon" variant="ghost" asChild>
        <Link
          href={`mailto:?subject=${encodeURIComponent(
            content
          )}&body=${encodeURIComponent(shareUrl)}`}
        >
          <Mail />
          <span className="sr-only">Email ile Paylaş</span>
        </Link>
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          navigator.clipboard.writeText(shareUrl);
        }}
        title="Bağlantıyı Kopyala"
      >
        <Copy />
        <span className="sr-only">Bağlantıyı Kopyala</span>
      </Button>
    </div>
  );
}

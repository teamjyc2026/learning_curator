"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImagePlus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/** 이미지 파일 → 캔버스 다운스케일 → PNG Blob (엣지함수가 AVIF로 변환) */
async function fileToPngBlob(file: File, maxW = 1600): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxW / bitmap.width);
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 미지원");
  ctx.drawImage(bitmap, 0, 0, w, h);
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("이미지 변환 실패"))),
      "image/png",
    ),
  );
}

async function uploadImage(file: File): Promise<string> {
  const png = await fileToPngBlob(file);
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke<{ url: string }>(
    "compress-image",
    { body: png, headers: { "Content-Type": "image/png" } },
  );
  if (error || !data?.url) {
    throw new Error(error?.message ?? "업로드 실패");
  }
  return data.url;
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [&>svg]:size-4",
        active && "bg-primary-soft text-primary",
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({
  editor,
  onPickImage,
  uploading,
}: {
  editor: Editor;
  onPickImage: () => void;
  uploading: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 p-1.5">
      <ToolbarButton
        title="굵게"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold />
      </ToolbarButton>
      <ToolbarButton
        title="기울임"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic />
      </ToolbarButton>
      <ToolbarButton
        title="취소선"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-border" />
      <ToolbarButton
        title="제목 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 />
      </ToolbarButton>
      <ToolbarButton
        title="제목 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 />
      </ToolbarButton>
      <ToolbarButton
        title="글머리 목록"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List />
      </ToolbarButton>
      <ToolbarButton
        title="번호 목록"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered />
      </ToolbarButton>
      <ToolbarButton
        title="인용"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-border" />
      <ToolbarButton
        title="링크"
        active={editor.isActive("link")}
        onClick={() => {
          const prev = editor.getAttributes("link").href as string | undefined;
          const url = window.prompt("링크 URL", prev ?? "https://");
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().unsetLink().run();
            return;
          }
          editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        <Link2 />
      </ToolbarButton>
      <ToolbarButton title="이미지 업로드" onClick={onPickImage}>
        {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  name,
  defaultValue = "",
  placeholder = "내용을 입력하세요. 이미지는 붙여넣기(Ctrl+V) 또는 드래그하면 자동 압축되어 올라갑니다.",
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-64 px-4 py-3 focus:outline-none",
      },
      handlePaste(_view, event) {
        const files = event.clipboardData?.files;
        if (files && files.length > 0) {
          const imgs = Array.from(files).filter((f) =>
            f.type.startsWith("image/"),
          );
          if (imgs.length > 0) {
            event.preventDefault();
            void insertImages(imgs);
            return true;
          }
        }
        return false;
      },
      handleDrop(_view, event) {
        const files = (event as DragEvent).dataTransfer?.files;
        if (files && files.length > 0) {
          const imgs = Array.from(files).filter((f) =>
            f.type.startsWith("image/"),
          );
          if (imgs.length > 0) {
            event.preventDefault();
            void insertImages(imgs);
            return true;
          }
        }
        return false;
      },
    },
  });

  async function insertImages(files: File[]) {
    if (!editor) return;
    setUploading(true);
    for (const file of files) {
      const toastId = toast.loading("이미지 압축·업로드 중…");
      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
        toast.success("이미지 업로드 완료", { id: toastId });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "이미지 업로드 실패", {
          id: toastId,
        });
      }
    }
    setUploading(false);
  }

  if (!editor) {
    return (
      <div className="h-72 rounded-lg border bg-muted/20" aria-hidden />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-input bg-background">
      <Toolbar
        editor={editor}
        uploading={uploading}
        onPickImage={() => fileInputRef.current?.click()}
      />
      <EditorContent editor={editor} />
      {/* 폼 전송용 HTML 값 */}
      <input type="hidden" name={name} value={editor.getHTML()} readOnly />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) void insertImages(Array.from(e.target.files));
          e.target.value = "";
        }}
      />
    </div>
  );
}

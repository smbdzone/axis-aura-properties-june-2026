"use client";

import { Icon } from "@iconify/react";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type ToolbarButtonProps = {
  label: string;
  icon: string;
  active?: boolean;
  onClick: () => void;
};

function ToolbarButton({
  label,
  icon,
  active = false,
  onClick,
  dark = false,
}: ToolbarButtonProps & { dark?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors ${dark
          ? active
            ? "bg-white/20 text-white"
            : "text-white/50 hover:bg-white/10 hover:text-white"
          : active
            ? "bg-primary text-white"
            : "text-primary/70 hover:bg-primary/10 hover:text-primary"
        }`}
    >
      <Icon icon={icon} width={14} height={14} color="currentColor" />
    </button>
  );
}

type RichTextEditorProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeightClass?: string;
  variant?: "light" | "dark";
  labelClassName?: string;
};

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = "Write here...",
  minHeightClass = "min-h-[200px]",
  variant = "light",
  labelClassName,
}: RichTextEditorProps) {
  const isDark = variant === "dark";
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextAlign.configure({
        types: ["paragraph"],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none font-sans text-sm font-medium leading-[18px] ${isDark ? "text-white" : "text-primary"} ${minHeightClass}`,
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    const normalizedValue = value || "<p></p>";
    const normalizedCurrent = currentHtml === "<p></p>" ? "" : currentHtml;
    const normalizedIncoming = normalizedValue === "<p></p>" ? "" : normalizedValue;
    if (normalizedIncoming !== normalizedCurrent) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  function insertLink() {
    const previousUrl = editor?.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const dividerClass = isDark ? "bg-white/30" : "bg-accent-light";
  const toolbarClass = isDark
    ? "w-fit rounded-lg border-[1.5px] border-accent-light bg-primary px-6 py-3"
    : "w-full rounded-lg border-[1.5px] border-accent-light bg-white px-4 py-2.5";
  const editorSurfaceClass = isDark
    ? "relative isolate overflow-hidden rounded-xl border-[1.5px] border-accent-light bg-primary p-4"
    : `relative rounded-xl border-[1.5px] border-accent-light bg-white p-4`;

  return (
    <div className="flex flex-col gap-2.5">
      {label ? (
        <label
          className={
            labelClassName ??
            `font-sans text-[28px] font-medium leading-[37px] ${isDark ? "text-black" : "text-primary"}`
          }
        >
          {label}
        </label>
      ) : null}

      <div className={toolbarClass}>
        <div className="flex flex-wrap items-center gap-3">
          <ToolbarButton
            dark={isDark}
            label="Bold"
            icon="octicon:bold-24"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            dark={isDark}
            label="Italic"
            icon="mingcute:italic-fill"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            dark={isDark}
            label="Underline"
            icon="mingcute:underline-fill"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
          <span className={`mx-1 h-5 w-px ${dividerClass}`} aria-hidden="true" />
          <ToolbarButton
            dark={isDark}
            label="Bullet list"
            icon="heroicons:list-bullet-16-solid"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <span className={`mx-1 h-5 w-px ${dividerClass}`} aria-hidden="true" />
          <ToolbarButton
            dark={isDark}
            label="Align left"
            icon="tabler:align-left"
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          />
          <ToolbarButton
            dark={isDark}
            label="Align center"
            icon="tabler:align-center"
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          />
          <ToolbarButton
            dark={isDark}
            label="Align right"
            icon="tabler:align-right"
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          />
          <span className={`mx-1 h-5 w-px ${dividerClass}`} aria-hidden="true" />
          <ToolbarButton
            dark={isDark}
            label="Insert link"
            icon="mingcute:link-line"
            active={editor.isActive("link")}
            onClick={insertLink}
          />
        </div>
      </div>

      <div className={`${editorSurfaceClass} ${minHeightClass}`}>
        {editor.isEmpty ? (
          <span
            className={`pointer-events-none absolute left-4 top-4 z-[1] font-sans text-sm font-medium ${isDark ? "text-white/60" : "text-primary/60"}`}
          >
            {placeholder}
          </span>
        ) : null}
        <EditorContent editor={editor} className={`rich-text-editor ${isDark ? "rich-text-editor-dark" : ""}`} />
      </div>
    </div>
  );
}

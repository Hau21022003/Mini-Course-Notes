"use client";
import {
  Bold,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  UnderlineIcon,
} from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import React, { useEffect } from "react";
import { useUploadFile } from "@/hooks/use-upload-file";
import { cn } from "@/lib/utils";

export default function TextEditor({
  setValue,
  value,
  className = "",
}: {
  value?: string;
  setValue: (value: string) => void;
  className?: string;
}) {
  const { fileInputRef, openFileDialog, handleFileChange } = useUploadFile();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type something...",
      }),
      Underline,
      ListItem,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <div className={cn(className, "min-w-0")}>
      <div className="flex items-center gap-2 p-1 border border-gray-300 rounded-t-lg bg-gray-50 text-gray-600">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("bold") ? "bg-blue-200" : ""
          }`}
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("italic") ? "bg-blue-200" : ""
          }`}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("underline") ? "bg-blue-200" : ""
          }`}
        >
          <UnderlineIcon size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("bulletList") ? "bg-blue-200" : ""
          }`}
        >
          <List size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor?.isActive("orderedList") ? "bg-blue-200" : ""
          }`}
        >
          <ListOrdered size={16} />
        </button>

        <button
          type="button"
          onClick={openFileDialog}
          className="p-2 rounded hover:bg-gray-200"
        >
          <ImageIcon size={16} />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={async (e) => {
            const imageUrl = await handleFileChange(e);
            if (imageUrl)
              editor?.chain().focus().setImage({ src: imageUrl }).run();
          }}
          className="hidden"
        />
      </div>

      <div
        className={`flex-1 bg-gray-200 h-48 border border-gray-300 rounded-b-lg relative overflow-y-auto`}
      >
        {!value && (
          <div className="absolute top-4 left-4 text-gray-500 pointer-events-none">
            Type something...
          </div>
        )}

        <EditorContent
          editor={editor}
          onClick={() => editor?.commands.focus()}
          className="h-full max-h-full px-4 py-2 prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:outline-none
            [&_p]:my-2
            [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-2
            [&_strong]:font-bold
            [&_em]:italic
            [&_ul]:list-disc [&_ul]:pl-6
            [&_ol]:list-decimal [&_ol]:pl-6
            [&_li]:my-1"
        />
      </div>
    </div>
  );
}

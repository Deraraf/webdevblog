"use client";

import { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";

import "@blocknote/mantine/style.css";
import "./editor.css";

interface BlockNoteEditorProps {
  initialContent?: string;
  onChange?: (value: string) => void;
  editable?: boolean;
}

const BlockNoteEditor = ({
  initialContent,
  onChange,
  editable,
}: BlockNoteEditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await edgestore.publicFiles.upload({ file });
      return imageUrl.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return "";
    }
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleImageUpload,
  });

  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onChange={
        onChange ? () => onChange(JSON.stringify(editor.document)) : () => {}
      }
      editable={editable}
    />
  );
};

export default BlockNoteEditor;

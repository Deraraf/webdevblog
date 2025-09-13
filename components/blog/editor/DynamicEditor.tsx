"use client";

import dynamic from "next/dynamic";

export const BlockNoteEditor = dynamic(() => import("./BlockNoteEditor"), {
  ssr: false,
});

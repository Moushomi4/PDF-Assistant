//   'use client'
// import { useRouter } from "next/navigation";
// import {useUser} from "@clerk/nextjs"
// import {useState} from "react";
// import {v4 as uuidv4} from "uuid";
// import { supabase } from "@/supabase";


// export enum StatusText{
//     UPLOADING ="Uploading file....",
//     UPLOADED="File uploaded successfuly",
//     SAVING="Saving file to database....",
//     GENERATING="Generating AI Embeddings, This will only take a few seconds.."

// }

// export type Status= StatusText[keyof StatusText];

// function useUpload() {
//   const [progress, setProgress]= useState<number | null>(null);
//   const [fileId, setFileId]= useState<string | null>(null);
//   const [status, setStatus]= useState<Status | null>(null);
//   const {user}= useUser();
//   const { session } = useSession();
//   const router = useRouter();
//   // const { createClerkClient } = useClerkSupabaseClient();
//   const supabase= useClerkSupabaseClient();
//   const clerkUser = user;

//   const handleUpload= async(file: File)=>{
//     if(!file || !clerkUser) return;

//     try {
//       const res = await fetch('/api/supabase-user', {
//   method: 'POST',
//   body: JSON.stringify({ clerkId: clerkUser.id }),
// })

// const { supabaseUserId } = await res.json()
      

//       const fileIdToUploadTo = uuidv4();
//       // const filePath = `users/${user.id}/files/${fileIdToUploadTo}`;
//       const filePath = `users/${supabaseUserId}/files/${fileIdToUploadTo}`;

//       // 1️⃣ Upload to Supabase Storage
//       setStatus(StatusText.UPLOADING);

//       // const { data: user } = await supabase.auth.getUser()
//      console.log("clerk user:", user?.id);

//       const { error: uploadError } = await supabase.storage
//         .from("files")
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       setProgress(100);
//       setStatus(StatusText.UPLOADED);

//       const { data } = supabase
//       .storage
//       .from("files")
//       .getPublicUrl(filePath);

//       const downloadUrl = data.publicUrl;

//       // 2️⃣ Save metadata to Supabase DB
//       setStatus(StatusText.SAVING);

//       const { error: dbError } = await supabase
//         .from("files")
//         .insert({
//           id: fileIdToUploadTo,
//           user_id: supabaseUserId,
//           name: file.name,
//           size: file.size,
//           type: file.type,
//           downloadUrl: downloadUrl,
//           ref: filePath,
//           // createdAt: new Date(),
//         });

//       if (dbError) throw dbError;

//       // 3️⃣ Continue your flow
//       setStatus(StatusText.GENERATING);
//       setFileId(fileIdToUploadTo);

//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error("Upload error:", error.message);
//       }
//     }
//   };

//   return { progress, status, fileId, handleUpload };
// }

// export default useUpload;


"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase/client";
import { generateEmbeddings } from "@/actions/generateEmbeddings";

export const StatusText = {
  UPLOADING: "Uploading file....",
  UPLOADED: "File uploaded successfully",
  SAVING: "Saving file to database....",
  GENERATING: "Generating AI Embeddings, This will only take a few seconds..",
}

export type Status = (typeof StatusText)[keyof typeof StatusText];

function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);

  const router = useRouter();

  const fakeProgress = (from: number, to: number, duration = 800) => {
  return new Promise<void>((resolve) => {
    const steps = 10;
    const stepTime = duration / steps;
    let current = from;

    const interval = setInterval(() => {
      current += (to - from) / steps;
      setProgress(Math.min(Math.round(current), to));
    }, stepTime);

    setTimeout(() => {
      clearInterval(interval);
      resolve();
    }, duration);
  });
};

  const handleUpload = async (file: File) => {
    if (!file) return;

    try {
      // ✅ 1. Get logged-in Supabase user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      const fileIdToUploadTo = uuidv4();
      const filePath = `users/${user.id}/files/${fileIdToUploadTo}`;

      // 2️⃣ Upload to Storage
      setStatus(StatusText.UPLOADING);
      setProgress(10);

      await fakeProgress(10, 35);

      const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // setProgress(100);
      await fakeProgress(35, 80);
      setStatus(StatusText.UPLOADED);

      // 3️⃣ Get public URL
      const { data } = supabase.storage
        .from("files")
        .getPublicUrl(filePath);

      const downloadUrl = data.publicUrl;

      // 4️⃣ Save metadata in DB
      setStatus(StatusText.SAVING);
      await fakeProgress(80, 90);

      const { error: dbError } = await supabase.from("files").insert({
        id: fileIdToUploadTo,
        user_id: user.id,
        name: file.name,
        size: file.size,
        type: file.type,
        downloadUrl,
        ref: filePath,
      });

      if (dbError) throw dbError;

      // 5️⃣ Done
      setStatus(StatusText.GENERATING);
      await generateEmbeddings(fileIdToUploadTo);
      await fakeProgress(90, 100);
      setFileId(fileIdToUploadTo);

      router.push(`/protected/files/${fileIdToUploadTo}`);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return { progress, status, fileId, handleUpload };
}

export default useUpload;

// function generateEmbeddings(fileIdToUploadTo: string) {
//   throw new Error("Function not implemented.");
// }

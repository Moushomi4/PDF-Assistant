'use server'
// import {auth} from "@supabase/auth-helpers-nextjs"
// import { createClient } from "@supabase/supabase-js";
// export async function generateEmbeddings(fileId: string) {
//  auth.protect();
// }
import { createClient } from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
export async function generateEmbeddings(docId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("/protected");
  }

  await generateEmbeddingsInPineconeVectorStore(docId);

  revalidatePath('/protected')
  return {completed: true}

}

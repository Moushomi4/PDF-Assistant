import React from 'react'
import PlaceholderDocument from './PlaceholderDocument'
import { createClient } from '@/lib/supabase/server'
import Document2 from './Document2';

async function Document ()  {
  const supabase= await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // const documentSnapshot= await adminDb
  // .collection("users")
  // .doc(userId)
  // .collection("files")
  // .get()

  const { data: documents, error } = await supabase
    .from("files")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <div className='flex flex-wrap p-5 bg-gray-100 justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto'>

    {documents.map((doc)=>{
      const {name, downloadUrl, size}= doc;
      return(
        <Document2
        key={doc.id}
        id={doc.id}
        name={name}
        size={size}
        downloadUrl={downloadUrl}
         />
      )
    })}

      <PlaceholderDocument />
    </div>
  )
}

export default Document
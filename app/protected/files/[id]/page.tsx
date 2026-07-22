// "use client";
// import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
// import PdfView from "@/components/PdfView";
import PdfViewWrapper from "@/components/PdfViewWrapper"; 
import Chat from "@/components/Chat"

// import dynamic from "next/dynamic";
// import { Loader2Icon } from "lucide-react";

// // ← this is the key fix
// const PdfView = dynamic(() => import("@/components/PdfView"), {
//     ssr: false,
//     loading: () => <Loader2Icon className="animate-spin h-20 w-20 text-indigo-600 mt-20" />,
// });

async function ChatToFilePage ({params}:{params:{id:string}})  {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ← protect the route
  if (!user) {
    redirect("/auth/login");
  }

  // ← fetch file from Supabase instead of Firebase
  const { data: fileData, error } = await supabase
    .from("files")
    .select("downloadUrl, name, ref")
    .eq("user_id", user.id)
    .eq("id", id)
    .single();

  if ( !fileData) {
    redirect("/protected");
  }

  const url = fileData.downloadUrl;


  return (
    <div className="grid lg:grid-cols-5 h-screen overflow-hidden">
      {/* Right */}
      <div className="col-span-5 lg:col-span-2 overflow-y-auto">
      {/* chat */}
      <Chat id={id} />
      </div>
      
      <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto">

        {/* PDF View */}
         <PdfViewWrapper  storageRef={fileData.ref} />
      </div>
    </div>
  )
}

export default ChatToFilePage

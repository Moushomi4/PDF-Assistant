// "use client";

// import dynamic from "next/dynamic";

// const PDFViewer = dynamic(() => import("./PdfView"), {
//   ssr: false,
// });

// export default function PdfView({ url }: { url: string }) {
//   return <PDFViewer url={url} />;
// }

"use client";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";

const PdfView = dynamic(() => import("@/components/PdfView"), {
    ssr: false,
    loading: () => <Loader2Icon className="animate-spin h-20 w-20 text-indigo-600 mt-20" />,
});

export default function PdfViewWrapper({ storageRef }: { storageRef: string }) {
    return <PdfView storageRef={storageRef} />;
}
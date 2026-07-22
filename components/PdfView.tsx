'use client' 
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";
//  import * as pdfjs from 'pdfjs-dist'

import {Document, Page, pdfjs} from "react-pdf";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon} from "lucide-react";


// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function PdfView ({ storageRef }: { storageRef: string })  {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [file, setFile] = useState<Blob | null>(null);
    const [rotation, setRotation]=useState<number>(0);
    const [scale, setScale] = useState<number>(1);

    useEffect(() => {
        const fetchFile = async () => {
            const res = await fetch(`/api/get-signed-url?ref=${storageRef}`);
        const { signedUrl } = await res.json();

        console.log("Signed URL:", signedUrl);
            const response= await fetch(signedUrl);
            console.log("Status:", response.status);  // ← add this
        console.log("Content-Type:", response.headers.get("content-type")); 
            const file= await response.blob();
            console.log("Blob size:", file.size);  // ← should be > 1000
        console.log("Blob type:", file.type); 
            setFile(file);
        };
        fetchFile();
    },[storageRef]);

    const onDocumentLoadSuccess = ({numPages}:{numPages:number}) => {
        setNumPages(numPages);
    };
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="sticky top-0 bg-gray-100 p-2 rounded-b-lg">
        {/* <div className="max-w-6xl px-2 grid grid-col-3 gap-2"> */}
        <div className="max-w-6xl mx-auto px-2 flex items-center gap-2">
          <Button
            variant="outline"
            disabled={pageNumber === 1}
            onClick={() => {
              if (pageNumber > 1) {
                setPageNumber(pageNumber - 1);
              }
            }}
          >
            Previous
            </Button>

            <p className="flex items-center justify-center">
              Page {pageNumber} of {numPages}
            </p>

          <Button variant="outline" disabled={pageNumber === numPages} onClick={()=> {
            if(pageNumber < numPages){
              setPageNumber(pageNumber + 1);
            }
          }}>
            Next
            </Button>

            <Button variant="outline"  
            onClick={()=> 
            setRotation((rotation +90)% 360)
          }>
            <RotateCw />
            </Button>

            <Button variant="outline" 
            disabled={scale >= 1.5} 
            onClick={()=> {
            setScale(scale * 1.2);
          }}>
            <ZoomInIcon />
            </Button>

            <Button variant="outline" 
            disabled={scale <= 0.75} 
            onClick={()=> {
            setScale(scale / 1.2);
          }}>
            <ZoomOutIcon />
            </Button>

        </div>
      </div>

        {
            !file ? (<Loader2Icon className="animate-spin h-20 w-20 text-indigo-600 mt-20" />
            ): (
            <Document
      loading={null}
        file={file}
        rotate={rotation}
        onLoadSuccess={onDocumentLoadSuccess}
        className="m-4 overflow-scroll"
      >
        <Page className="shadow-lg" scale={scale} pageNumber={pageNumber} />
      </Document>
            )
        }
      {/* <Document
      loading={null}
        file={file}
        rotate={rotation}
        onLoadSuccess={onDocumentLoadSuccess}
        className="m-4 overflow-scroll"
      >
        <Page className="shadow-lg" scale={scale} pageNumber={pageNumber} />
      </Document> */}
    </div>
  )
}

export default PdfView

import NavBar from "@/components/NavBar";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

function DashboardLayout ({children}:{children: React.ReactNode}) {
  return (
    
    <div className="flex-1 flex flex-col h-screen">
      {/* <NavBar /> */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
    
  )
}

export default DashboardLayout;
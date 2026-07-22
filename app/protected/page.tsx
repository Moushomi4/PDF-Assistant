
// import NavBar from "@/components/NavBar";
// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// // import { features } from "@/lib/features";
// import {
//   BrainCogIcon,
//   EyeIcon,
//   GlobeIcon,
//   MonitorSmartphoneIcon,
//   ServerCogIcon,
//   ZapIcon,
// }from "lucide-react";
// const features=[
//   {
//     name:"Store your PDF Documents",
//     description:"Keep all your importtant PDF files securely stored and accessible anytime, anywhere.",
//     icon:GlobeIcon
//   },
//   {
//     name:"Blazing Fast Response",
//     description:"Keep all your importtant PDF files securely stored and accessible anytime, anywhere.",
//     icon:ZapIcon
//   },
//   {
//     name:"Chat Memorization",
//     description:"Keep all your importtant PDF files securely stored and accessible anytime, anywhere.",
//     icon:BrainCogIcon
//   },
//   {
//     name:"Interactive PDF Viewer",
//     description:"Keep all your importtant PDF files securely stored and accessible anytime, anywhere.",
//     icon:EyeIcon
//   },
//   {
//     name:"Cloud Backup",
//     description:"Keep all your importtant PDF files securely stored and accessible anytime, anywhere.",
//     icon:ServerCogIcon
//   },
//   {
//     name:"Responsive Across Devices",
//     description:"Keep all your importtant PDF files securely stored and accessible anytime, anywhere.",
//     icon:MonitorSmartphoneIcon
//   },
// ]

// export default function ProtectedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <main className="min-h-screen flex flex-col items-center">
//       <NavBar />

//       {/* HERO / LANDING CONTENT */}
//       <section className="flex-1 w-full overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-950">
//         <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
//           <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
//             <div className="mx-auto max-w-2xl sm:text-center">
//               <h2 className="text-base font-semibold leading-7 text-blue-800">
//                 Your interactive Document Companion
//               </h2>

//               <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
//                 Transform your PDFs into Interactive Conversation
//               </p>

//               <p className="mt-6 text-lg leading-8 text-gray-600">
//                 Introducing{" "}
//                 <span className="font-bold text-blue-600">Chat with PDF</span>
//                 <br />
//                 <br />
//                 Upload your documents, and our chatbot will answer questions,
//                 summarize context, and answer all your questions. Ideal for
//                 everyone, <span className="font-bold">dynamic conversations</span>,
//                 enhancing productivity 10x fold effortlessly.
//               </p>
//             </div>

//             <Button className="mt-6 bg-blue-950 rounded-md text-white" asChild>
//               <Link href="/dashboard">Get Started</Link>
//             </Button>
//           </div>

//           {/* IMAGE */}
//           <div className="relative overflow-hidden pt-16">
//             <div className="mx-auto max-w-7xl px-6 lg:px-8">
//               <Image
//                 alt="App Screenshot"
//                 src="https://i.imgur.com/VciRSTI.jpeg"
//                 width={2432}
//                 height={1442}
//                 className="rounded-xl shadow-2xl ring-1 ring-gray-900/10"
//               />
//             </div>
//           </div>

//           {/* FEATURES */}
//           <div className="mt-20 px-6">
//             <dl className="mx-auto grid max-w-7xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
//               {features.map((feature) => (
//                 <div key={feature.name} className="relative pl-9">
//                   <dt className="inline font-semibold text-gray-900">
//                     <feature.icon
//                       aria-hidden="true"
//                       className="absolute left-1 top-1 h-5 w-5 text-blue-800"
//                     />
//                   </dt>
//                   <dd>{feature.description}</dd>
//                 </div>
//               ))}
//             </dl>
//           </div>
//         </div>

//         {/* RENDER PAGE CONTENT BELOW HERO */}
//         <div className="w-full max-w-7xl mt-20">{children}</div>
//       </section>
//     </main>
//   );
// }

import Document from "@/components/Document";
export const dynamic= "force-dynamic";

function dashboard() {
  return (
    <div className="h-full max-w-7xl mx-auto">
      <h1 className="text-3xl p-5 bg-gray-100 font-extralight text-blue-800">
        My Document
      </h1>

      <Document />
    </div>
  )
}

export default dashboard
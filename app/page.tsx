// import { DeployButton } from "@/components/deploy-button";
// import { EnvVarWarning } from "@/components/env-var-warning";
// import { AuthButton } from "@/components/auth-button";
// import { Hero } from "@/components/hero";
// import { ThemeSwitcher } from "@/components/theme-switcher";
// import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
// import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
// import { hasEnvVars } from "@/lib/utils";
// import Link from "next/link";
// import { Suspense } from "react";

// export default function Home() {
//   return (
//     <main className="min-h-screen flex flex-col items-center">
//       <div className="flex-1 w-full flex flex-col gap-20 items-center">
//         <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
//           <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
//             <div className="flex gap-5 items-center font-semibold">
//               <Link href={"/"}>Next.js Supabase Starter</Link>
//               <div className="flex items-center gap-2">
//                 <DeployButton />
//               </div>
//             </div>
//             {!hasEnvVars ? (
//               <EnvVarWarning />
//             ) : (
//               <Suspense>
//                 <AuthButton />
//               </Suspense>
//             )}
//           </div>
//         </nav>
//         <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
//           <Hero />
//           <main className="flex-1 flex flex-col gap-6 px-4">
//             <h2 className="font-medium text-xl mb-4">Next steps</h2>
//             {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
//           </main>
//         </div>

//         <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
//           <p>
//             Powered by{" "}
//             <a
//               href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
//               target="_blank"
//               className="font-bold hover:underline"
//               rel="noreferrer"
//             >
//               Supabase
//             </a>
//           </p>
//           <ThemeSwitcher />
//         </footer>
//       </div>
//     </main>
//   );
// }

"use client";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";
// import NavBar from "@/components/NavBar";


import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
}from "lucide-react";
const features=[
  {
    name:"Store your PDF Documents",
    description:"Keep all your importtant PDF files securely stored and accessible anytime, anywhere.",
    icon:GlobeIcon
  },
  {
    name:"Blazing Fast Response",
    description:"Keep all your importtant PDF files securely stored and accessible anytime, anywhere.",
    icon:ZapIcon
  },
  {
    name:"Chat Memorization",
    description:"Keep all your importtant PDF files securely stored and accessible anytime, anywhere.",
    icon:BrainCogIcon
  },
  {
    name:"Interactive PDF Viewer",
    description:"Keep all your importtant PDF files securely stored and accessible anytime, anywhere.",
    icon:EyeIcon
  },
  {
    name:"Cloud Backup",
    description:"Keep all your importtant PDF files securely stored and accessible anytime, anywhere.",
    icon:ServerCogIcon
  },
  {
    name:"Responsive Across Devices",
    description:"Keep all your importtant PDF files securely stored and accessible anytime, anywhere.",
    icon:MonitorSmartphoneIcon
  },
]
export default function Home() {
  return (
    <div className="">
    

      <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-950 ">
        {/* <h1>Lets build a Saas AI Project</h1> */}
        <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
          <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center"> 
              <h2 className="text-base font-semibold leading-7  text-blue-800">Your interactive Document Companion</h2>

              {/* <p className="mt-2 text-3xl font-bold tracking-tight text-grey-900 sm:text-6xl">Transform your PDFs into Interactive Conversation</p> */}
              <h1 className="mt-2 text-5xl font-bold">Make Every PDF</h1>
              <h1 className="mt-2 text-5xl font-bold">
      {" "}
      <span className="text-blue-600">
        <TypeAnimation
          sequence={[
            "Searchable",
            1500,
            "",
            300,
            "Conversational",
            1500,
            "",
            300,
            "Smart",
            1500,
            "",
            300,
          ]}
          speed={50}
          repeat={Infinity}
        />
      </span>
    </h1>

              <p className="mt-6 text-lg leading-8 text-grey-600">
                Introducing{" "}
                <span className="FONT-BOLD text-blue-600">PDF Assistant</span>
                <br />
                <br />
                Upload your documents, and our chatbot will answer questions, summarize context, and answer all your questions. Ideal for everyone,<span className="font-bold">dynamic conversations</span>, enhancing productivity 10x fold effortlessly.
              </p>
            </div>
            
            <Button className="mt-6 bg-blue-950 rounded-md text-white" asChild>
              <Link href={"/protected"}>Get Started</Link>
            </Button>
            
            
            </div>

            <div className="relative overflow-hidden pt-16">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <Image
                alt="App Screenshot"
                // src="https://imgur.com/VciRSTI.jpeg"
                // src="https://i.imgur.com/VciRSTI.jpeg"
                src="/app.png"
                width={2432}
                height={1442}
                className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-grey-900/10"
                />
                <div aria-hidden="true" className="relative">
                <div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-white/95 pt-[5%]" />
              </div>
              </div>
            </div>
            <div className="">
              <dl className="mx-auto grid mt-4 max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text0gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
                {features.map(feature=>{
                  return(
                    <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                      aria-hidden="true"
                      className="absolute left-1 top-1 h-5 w-5 text-blue-800"/>
                    </dt>
                    <dd>{feature.description}</dd>
                  </div>
                  )
                })}
              </dl>
            </div>
        </div>
      </main>
      
    </div>
  );
}



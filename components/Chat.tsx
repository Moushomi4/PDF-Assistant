// 'use client'
// import { useEffect, useRef, useState,useTransition, SubmitEvent } from "react";
// import { Button } from "./ui/button";
// import {Input} from "./ui/input";
// import { Loader2Icon } from "lucide-react";
// // import { createClient } from "@/lib/supabase/client";
// import { supabase } from "@/lib/supabase/client";
// import { askQuestion } from "@/actions/askQuestion";
// // import {useCollection} from "react-firebase-hooks/firestore";
// // import {useUser} from "@clerk/nextjs";
// // import {collection, orderBy, query, where} from "firebase/firestore";
// // import {db} from "@/firebase";

// export type Message={
//     id: string;
//     role:"human"|"ai"|"placeholder";
//     message: string;
//     createdAt: Date;
// }


//  function Chat({id}:{id: string}){

//     // const { data: { user } } =await  supabase.auth.getUser();
//     // if (!user) return;
    
//     const [input, setInput] = useState<string>("");
//     const [isPending, startTransition] = useTransition();
//     const [messages, setMessages]= useState<Message[]>([]);
//     const bottomRef = useRef<HTMLDivElement>(null);

//     // const [snapshot, loading, error]=useCollection(
//     //     user && query(
//     //         collection(db, "users", user.id, "files", id, "chat"),
//     //         orderBy("createdAt", "asc")
//     //     )
//     // )

//     useEffect(() => {
// //     const fetchAndSubscribe = async () => {
// //         const { data: { user } } = await supabase.auth.getUser();
// //         if (!user) return;

// //         // ← initial fetch
// //         const { data } = await supabase
// //             .from("messages")
// //             .select("*")
// //             .eq("file_id", id)
// //             .eq("user_id", user.id)
// //             .order("created_at", { ascending: true });

// //         if (data) {
// //             setMessages(data.map((m) => ({
// //                 id: m.id,
// //                 role: m.role,
// //                 message: m.message,
// //                 createdAt: new Date(m.created_at),
// //             })));
// //         }
// //  }
// //  fetchAndSubscribe();
//  const fetchAndSubscribe = async () => {
//             const { data: { user } } = await supabase.auth.getUser();
//             if (!user) return;

//             // initial fetch - replaces useCollection
//             const { data: chats, error } = await supabase
//                 .from("messages")
//                 .select("*")
//                 .eq("file_id", id)
//                 .eq("user_id", user.id)
//                 .order("created_at", { ascending: true });

//             if (error || !chats) return;

//             // replaces snapshot check
//             const lastMessage = [...messages].pop();
//             if (lastMessage?.role === "placeholder" &&
//                 lastMessage?.message === "Thinking...") {
//                 return;
//             }

//             // replaces snapshot.docs.map(doc => doc.data())
//             const newMessages: Message[] = chats.map((doc) => ({
//                 id: doc.id,
//                 role: doc.role,
//                 message: doc.message,
//                 createdAt: new Date(doc.created_at), // replaces createdAt.toDate()
//             }));

//             setMessages(newMessages);
//         }
//             fetchAndSubscribe();
// }, [id]);

//     useEffect(() => {
//         bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);
    

//     const handleSubmit= async(e: React.SubmitEvent<HTMLFormElement>)=>{
//         e.preventDefault();

//         const q= input;
//     setInput("");

//     // setMessages((prev)=>[
//     //     ...prev,
//     //     {
//     //         role:"human",
//     //         message:q,
//     //         created: new Date(),
//     //     },
//     //     {
//     //         role:"AI",
//     //         message:"thinking...",
//     //         created: new Date(),
//     //     }
//     // ]);
//     setMessages((prev) => [
//     ...prev,
//     {
//         id: crypto.randomUUID(),
//         role: "human" as const,
//         message: q,
//         createdAt: new Date(),
//     },
//     {
//         id: crypto.randomUUID(),
//         role: "placeholder" as const,
//         message: "Thinking...",
//         createdAt: new Date(),
//     }
// ]);
//     startTransition(async()=>{
//         const {success, message}=await askQuestion(id, q);
//         if(!success){
//             setMessages((prev)=>
//             prev.slice(0, prev.length-1).concat([
//                 {
//                     id: crypto.randomUUID(),
//                     role:"ai",
//                     message: `Whoops...${message}`,
//                     createdAt: new Date(),
//                 }
//             ]))
//         }
//     })
//     }
// //     const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
// //   e.preventDefault();
// // };
//     return (
//         <div className="flex flex-col h-full overflow-scroll">
//             <div className="flex-1 w-full">
//             {messages.map((message)=>(
//                 <div key={message.id}>
//                     <p>{message.message}</p>
//                 </div>
//             ))}
//             </div>

//             <form 
//             onSubmit={handleSubmit}
//             className="flex sticky bottom-0 space-x-2 p-5 bg-indigo-600/75">
//                 <Input
//                 placeholder="Ask a question..."
//                 value={input}
//                 onChange={(e)=> setInput(e.target.value)}/>
//                 <Button type="submit" disabled={!input || isPending}>
//                     {isPending ? (<Loader2Icon className="animate-spin text-indigo-600"/> ): ("Ask")}
//                 </Button>
//             </form>
//         </div>
//     )
//  }
//  export default Chat;


'use client'
import { useEffect, useRef, useState, useTransition } from "react";  // ← removed SubmitEvent
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2Icon } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { askQuestion } from "@/actions/askQuestion";
import { ChatMessage } from "./ChatMessage";

export type Message = {
    id: string;
    role: "human" | "ai" | "placeholder";
    message: string;
    createdAt: Date;
}

function Chat({ id }: { id: string }) {
    const [input, setInput] = useState<string>("");
    const [isPending, startTransition] = useTransition();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    // ← initial fetch on mount
    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: chats, error } = await supabase
                .from("messages")
                .select("*")
                .eq("file_id", id)
                .eq("user_id", user.id)
                .order("created_at", { ascending: true });

            if (error || !chats) {
                setLoading(false);
                return;
            }

            setMessages(chats.map((doc) => ({
                id: doc.id,
                role: doc.role,
                message: doc.message,
                createdAt: new Date(doc.created_at),
            })));

            setLoading(false);
        };

        fetchMessages();
    }, [id]);

    // ← scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {  // ← fixed type
        e.preventDefault();
        if (!input.trim()) return;

        const q = input;
        setInput("");

        // ← add human + placeholder messages
        setMessages((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                role: "human" as const,
                message: q,
                createdAt: new Date(),
            },
            {
                id: crypto.randomUUID(),
                role: "placeholder" as const,
                message: "Thinking...",
                createdAt: new Date(),
            }
        ]);

        startTransition(async () => {
            const { success, message } = await askQuestion(id, q);

            // ← refetch all messages after AI responds
            const { data: chats } = await supabase
                .from("messages")
                .select("*")
                .eq("file_id", id)
                .order("created_at", { ascending: true });

            if (chats) {
                setMessages(chats.map((doc) => ({
                    id: doc.id,
                    role: doc.role,
                    message: doc.message,
                    createdAt: new Date(doc.created_at),
                })));
            }

            // ← show error if failed
            if (!success) {
                setMessages((prev) =>
                    prev.filter((m) => m.role !== "placeholder").concat([{
                        id: crypto.randomUUID(),
                        role: "ai" as const,
                        message: `Whoops... ${message}`,
                        createdAt: new Date(),
                    }])
                );
            }
        });
    };

    return (
        <div className="flex flex-col h-full overflow-scroll">
            <div className="flex-1 w-full p-4 space-y-4">
                { loading ? (
                    <div className="flex items-center justify-center">
                        <Loader2Icon className="animate-spin h-20 w-20 text-indigo-600 mt-20" />
                    </div>
                ):(
                    <div>
                        {/* {messages.map((message) => (
                    <div key={message.id}
                        className={`flex ${message.role === "human" ? "justify-end" : "justify-start"}`}>
                        <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm
                            ${message.role === "human"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-800"}
                            ${message.role === "placeholder"
                                ? "animate-pulse" : ""}`}>
                            {message.message}
                        </div>
                    </div>
                ))} */}
                {messages.length===0 &&(
                    <ChatMessage 
                    key={"placeholder"}
                    message={{
                        id: "placeholder",  
                        role: "ai",
                        message: "Ask me anything about the document",
                        createdAt: new Date(),
                    }} 
                    />
                )}

                { messages.map((message, index)=>(
                    <ChatMessage key={message.id} message={message} />
                ))}
                    </div>
                    
                )}
                
                <div ref={bottomRef} />
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex sticky bottom-0 space-x-2 p-5 bg-indigo-600/75"
            >
                <Input
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" disabled={!input.trim() || isPending}>
                    {isPending
                        ? <Loader2Icon className="animate-spin text-indigo-600" />
                        : "Ask"}
                </Button>
            </form>
        </div>
    );
}

export default Chat;
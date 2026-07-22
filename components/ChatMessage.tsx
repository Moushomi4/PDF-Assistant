'use client'
import Markdown from "react-markdown"
import { Message } from "./Chat"
import { Loader2Icon } from "lucide-react";
import { BotIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

  export function ChatMessage({message}:{message:Message}) {
    const isHuman= message.role ==="human";
    // const {user}= useUser();
    const [userImage, setUserImage] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            // ← get avatar from user metadata
            setUserImage(user?.user_metadata?.avatar_url ?? null);
        };
        getUser();
    }, []);

  return (
    <div className={`chat ${isHuman ? "chat-end": "chat-start"}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
        {
            isHuman ? (
                userImage && (
                    <Image 
                    src={userImage}
                    alt="Profile Picture"
                    width={40}
                    height={40}
                    className="rounded-full"
                    />
                )
            ):(
                <div className="h-10 w-10 bg-indigo-600 flex items-center justify-center">
                    <BotIcon className="text-white h-7 w-7" />
                </div>
            )
        }
        </div>
      </div>

      <div className={`chat-bubble prose ${ isHuman && "bg-indigo-600 text-white"}`} >
        {message.message === "Thinking.."?(
            <div className="flex items-center justify-center">
                <Loader2Icon className="animate-spin h-5 w-5 text-white" />
            </div>
        ):(
            <Markdown>{message.message}</Markdown>
        )}

      </div>
    </div>
  )
}

export default ChatMessage;

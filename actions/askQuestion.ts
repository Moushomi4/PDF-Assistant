// 'use server'
// import { createClient } from "@/lib/supabase/server";
// import { generateLangchainCompletion } from "@/lib/langchain";
// import { Message } from "@/components/Chat";
// import { create } from "domain";

// const FREE_LIMIT=3;
// const PRO_LIMIT= 100;
// export async function askQuestion(id: string, question: string){
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return;

//     // const chatRef= adminDb
//     // .collection("users")
//     // .doc(userId),
//     // .collection("files")
//     // .doc(id)
//     // .collection("chat");
//     const { data: humanMessages, error: countError } = await supabase
//         .from("messages")
//         .select("id")
//         .eq("file_id", id)
//         .eq("user_id", user.id)
//         .eq("role", "human");

//          if (countError) return { success: false, message: countError.message };


//     // checks how many user messages are in the chat
//     // const chatSnapshot= await chatRef.get();
//     // const userMessages= chatSnapshot.docs.filter(
//     //     (doc) => doc.data().role === "human"
//     // );

//     //  tomorrow limit the PRO/FREE users

//     const userMessage: Message={
//         role:'human',
//         message: question,
//         createdAt: new Date(),
//     }
//     await chatRef.add(userMessage);

//     // Generate AI RESPONSE
//     const reply= await generateLangchainCompletion(id, question);

//     // const aiMessage: Message={
//     //     role:'AI',
//     //     message: reply,
//     //     createdAt: new Date(),
//     // }
//     // await chatRef.add(aiMessage);
//     const { error: aiError } = await supabase
//         .from("messages")
//         .insert({
//             file_id: id,
//             user_id: user.id,
//             role: "ai",        // ← lowercase
//             message: reply,
//             created_at: new Date(),
//         });

//     if (aiError) return { success: false, message: aiError.message };

//     return { success: true, message: reply };
// }


'use server'
import { createClient } from "@/lib/supabase/server";
import { generateLangchainCompletion } from "@/lib/langchain";
import { Message } from "@/components/Chat";

const FREE_LIMIT = 3;
const PRO_LIMIT = 100;

export async function askQuestion(id: string, question: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    console.log("User in askQuestion:", user?.id); 
    if (!user) return { success: false, message: "Not authenticated" };

    // ← check how many human messages exist (replaces chatSnapshot)
    const { data: userMessages, error: countError } = await supabase
        .from("messages")
        .select("id")
        .eq("file_id", id)
        .eq("user_id", user.id)
        .eq("role", "human");

    if (countError) return { success: false, message: countError.message };

    // ← enforce free/pro limits
    const limit = FREE_LIMIT; // replace with PRO_LIMIT if user is pro
    if (userMessages && userMessages.length >= limit) {
        return {
            success: false,
            message: `You have reached your limit of ${limit} messages. Upgrade to Pro!`,
        };
    }

    // ← save human message (replaces chatRef.add(userMessage))
    const { error: humanError } = await supabase
        .from("messages")
        .insert({
            file_id: id,
            user_id: user.id,
            role: "human",
            message: question,
            created_at: new Date(),
        });

    if (humanError) return { success: false, message: humanError.message };

    // ← generate AI response
    const reply = await generateLangchainCompletion(id, question);

    // ← save AI message (replaces chatRef.add(aiMessage))
    const { error: aiError } = await supabase
        .from("messages")
        .insert({
            file_id: id,
            user_id: user.id,
            role: "ai",         // ← lowercase, was "AI"
            message: reply,
            created_at: new Date(),
        });

    if (aiError) return { success: false, message: aiError.message };

    return { success: true, message: reply };
}
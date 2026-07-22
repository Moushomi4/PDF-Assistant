

// import { GoogleGenAI } from "@google/genai";
// import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
// import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import {createStuffDocumentsChain} from "langchain/chains/combine_documents"
// import {ChatPromptTemplate} from "@langchain/core/prompts";
// import {createRetrievalChain} from "langchain/chains/retrieval";
// import {createHistoryAwareRetriever} from "langchain/chains/history_aware_retriever";
// import {HumanMessage, AIMessage } from "@langchain/core/messages"
// import pineconeClient from "./pinecone"
// import {PineconeStore} from "@langchain/pinecone"
// import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
// import {Index, Pinecone, RecordMetadata} from "@pinecone-database/pinecone";
// // import {adminDb} from "../firebaseAdmin";
// // import {auth} from
// import { createClient } from "@/lib/supabase/server";

// export const genAI = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY!,
//     // modelName: "gemini-3-flash-preview",

// });
// // const embeddings = new GoogleGenerativeAIEmbeddings({
// //     apiKey: process.env.GEMINI_API_KEY!,
// //     modelName: "text-embedding-004", // Google's best embedding model
// // });
// const supabase = await createClient();
// export const indexName="chatwithpdf";

// export async function generateDocs(docId: string){
    
// }

// async function namespaceExists(index: Index<RecordMetadata>, namespace: string){
//     if (namespace === null){
//         throw new Error ("No namespace value provided");
//     } 
//     const {namespaces} = await index.describeIndexStats();
//     return namespaces?.[namespace] !== undefined;
// }
// export async function GoogleGenerativeAIEmbeddings(docId: string){
// const {
//   data: { user },
// } = await supabase.auth.getUser();
// if (!user) {
//   throw new Error("Not authenticated");
// }
// let pineconeVectorStore;

// console.log("----Generating embeddings.... ----");
// const embeddings=new GoogleGenerativeAIEmbeddings();

// const index= await pineconeClient.index(indexName);
// const namespaceAlreadyExists=await namespaceExists
// (index,docId);
// if(namespaceAlreadyExists){
//     console.log(`----Namespace ${docId} already exists , reusing exixting embeddings.... ---- `);

//     pineconeVectorStore= await PineconeStore.fromExistingIndex(embeddings, {
//         pineconeIndex: index,
//         namespace: docId,
//     });
//     return pineconeVectorStore;
// }
// else{
//     //if namespace does not exists, Download the file from supabase and then generate the embeddings and store in pinecone
//     const splitDocs = await generateDocs(docId);
// }
// }




import { GoogleGenAI } from "@google/genai";
import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import {createStuffDocumentsChain} from "langchain/chains/combine_documents"
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {createRetrievalChain} from "langchain/chains/retrieval";
import {createHistoryAwareRetriever} from "langchain/chains/history_aware_retriever";
import {HumanMessage, AIMessage } from "@langchain/core/messages"
import pineconeClient from "./pinecone"
import {PineconeStore} from "@langchain/pinecone"
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import {Index, RecordMetadata} from "@pinecone-database/pinecone";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import {adminDb} from "../firebaseAdmin";
// import {auth} from
import { createClient } from "@/lib/supabase/server";

// export const genAI = new ChatOpenAI({
//     apiKey: process.env.OPENAI_API_KEY!,
//      modelName: "GPT-4o",
// });
import { Embeddings } from "@langchain/core/embeddings";
import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiEmbeddings extends Embeddings {
    private model: any;

    constructor(apiKey: string) {
        super({});
        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
        const embeddings = await Promise.all(
            texts.map((text) => this.embedQuery(text))
        );
        return embeddings;
    }

    async embedQuery(text: string): Promise<number[]> {
        const result = await this.model.embedContent(text);
        console.log("Embedding dim:", result.embedding.values.length); // should be 768
        return result.embedding.values;
    }
}

// Use it like this
const embeddings = new GeminiEmbeddings(process.env.GEMINI_API_KEY!);

 const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!,
    modelName: "gemini-3.1-flash-lite",
});

export const indexName="chatwithpdf";

async function fetchMessagesFromDB(docId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    console.log("--- Fetching chat history from Supabase... ---");
    const { data: chats, error } = await supabase
    .from("messages")
    .select("*")
    .eq("file_id", docId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

if (error) throw new Error(error.message);

// const chatHistory= chats.docs.map((doc) => {
//     doc.data().role === "human"? 
//     new HumanMessage(doc.data().message): 
//     new AIMessage(doc.data().message) 
// }
// );
 const chatHistory = chats.map((doc: { role: string; message: string }) =>
        doc.role === "human"
            ? new HumanMessage(doc.message)
            : new AIMessage(doc.message)
    );

console.log(`---Fetched ${chatHistory.length} messages from DB... ---`);
console.log(chatHistory.map((msg) => msg.content.toString()));
return chatHistory;

}

export async function generateDocs(docId: string){
// const {userId}= await auth();
// if (!user) {
//   throw new Error("Not authenticated");
// }
// console.log("--- Fetching the download URL from firebase..---");
 const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Not authenticated");
    }

    console.log("--- Fetching the download URL from Supabase... ---");

 const { data: fileData, error } = await supabase
        .from("files")
        .select("downloadUrl, ref")
        .eq("user_id", user.id)
        .eq("id", docId)
        .single();


if (error || !fileData?.downloadUrl) {
        throw new Error("Download URL not found");
    }

// const downloadUrl = fileData.downloadUrl;
//     console.log(`--- Download URL fetched successfully: ${downloadUrl} ---`);

console.log("--- Generating signed URL... ---");

// ✅ Use signed URL instead of public URL
const { data: signedData, error: signedError } = await supabase.storage
    .from("files")
    .createSignedUrl(fileData.ref, 60);  // ← use ref column as storage path

if (signedError || !signedData?.signedUrl) {
    throw new Error("Could not generate signed URL");
}

const downloadUrl = signedData.signedUrl;
console.log(`--- Signed URL generated: ${downloadUrl} ---`);


const response= await fetch(downloadUrl);
console.log("Status:", response.status);  // ← add this
console.log("Content-Type:", response.headers.get("content-type"));
// const data= await response.blob();
const arrayBuffer = await response.arrayBuffer();
const data = new Blob([arrayBuffer], { type: "application/pdf" });

console.log("---Loading PDF document...---")
const loader= new PDFLoader(data);
const docs= await loader.load();

console.log("--- Splitting the document into smaller parts... ---");
const splitter= new RecursiveCharacterTextSplitter();
const splitDocs= await splitter.splitDocuments(docs);
console.log(`---Split into ${splitDocs.length} parts... ----`);

return splitDocs;
}

async function namespaceExists(
    // index: Index<RecordMetadata>, 
    index: ReturnType<typeof pineconeClient.index>, 
    namespace: string
) {
    if (namespace === null) {
        throw new Error("No namespace value provided");
    }
    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
    // const {userId}= await auth();
    // if (!user) {
    //   throw new Error("Not authenticated");
    // }
    // let pineconeVectorStore;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Not authenticated");
    }

    let pineconeVectorStore;

console.log("----Generating embeddings.... ----");

const embeddings = new GeminiEmbeddings(process.env.GEMINI_API_KEY!);

//  const embeddings = new GoogleGenerativeAIEmbeddings({
//         apiKey: process.env.GEMINI_API_KEY!,
//         model: "text-embedding-004",
//     });


const index= await pineconeClient.index(indexName);
const namespaceAlreadyExists=await namespaceExists
(index,docId);
if(namespaceAlreadyExists){
    console.log(`----Namespace ${docId} already exists , reusing existing embeddings.... ---- `);

    pineconeVectorStore= await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: index,
        namespace: docId,
    });
    return pineconeVectorStore;
}
else{
    //if namespace does not exists, Download the file from supabase and then generate the embeddings and store in pinecone
    const splitDocs= await generateDocs(docId);
    console.log(
	`--- Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vector 	store... ---`
	);
    pineconeVectorStore= await PineconeStore.fromDocuments(
	splitDocs,
	embeddings,
	{
	pineconeIndex: index,
	namespace: docId,
	}
);
return pineconeVectorStore;

}
}

// import { generateLangchainCompletion } from "@/lib/langchain";
const generateLangchainCompletion= async (docId: string, question: string) => {
    let pineconeVectorStore;

    pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId);
    if(!pineconeVectorStore){
        throw new Error("Pinecone vector store not found");
    }

    console.log("---Creating the retrieval chain... ---");
    const retriever = pineconeVectorStore.asRetriever();

    const chatHistory= await fetchMessagesFromDB(docId);

   console.log("Defining a prompt template... ---");
   const historyAwarePrompt= ChatPromptTemplate.fromMessages([
    ...chatHistory, 
    ["user","{input}"],
    [
        "user",
        "Given the above conversation, generate a search query to look up in order to get information relavent to the conversation",
    ]
   ]);

//     create history aware retreiver chain that uses the model, retreiver, and prompt
   console.log("-- Creating a history aware retriever chain... ---");
    const historyAwareRetrieverChain= await createHistoryAwareRetriever({
        llm: model,
        retriever,
        rephrasePrompt: historyAwarePrompt,
    });
    

    // define a prompt template for answering questions based on retrieved context
    console.log("---Defining a prompt template for answering questions...--");
    const historyAwareRetrievalPrompt= ChatPromptTemplate.fromMessages([
        [
            "system",
            "Answer the user's questions based on the below context:\n\n{context}",
        ],
        ...chatHistory,   // INsert the actual chat history
        ["user","{input}"],
    ])

    //create a chain to combine the retreived documents into a coherent response
    console.log("--- Create a document combining chain...---");
    const historyAwareCombineDocsChain = await createStuffDocumentsChain({
        llm: model,
        prompt: historyAwareRetrievalPrompt,
    })

    // create the main retreival chain that combines the history-aware retreiver and document combining chains.
    console.log("--- Creating the main retreival chain... ---");
    const conversationalRetreivalChain= await createRetrievalChain({
        retriever: historyAwareRetrieverChain,
        combineDocsChain: historyAwareCombineDocsChain,
    })

    console.log("--- Running the chain with a sample conversation... --")
    const reply= await conversationalRetreivalChain.invoke({
        chat_history: chatHistory,
        input: question,
    });

    console.log(reply.answer);
    return reply.answer;

};

export { model , generateLangchainCompletion}









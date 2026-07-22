// app/api/get-signed-url/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get("ref");

    console.log("ref:", ref);

    if (!ref) {
        return NextResponse.json({ error: "No ref provided" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.storage
        .from("files")
        .createSignedUrl(ref, 3600); // 1 hour expiry

        console.log("signedUrl:", data?.signedUrl);  // ← debug
    console.log("error:", error);  // ← debug

    if (error || !data?.signedUrl) {
        return NextResponse.json({ error: "Could not generate signed URL" }, { status: 500 });
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
}
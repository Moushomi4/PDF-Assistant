// 'use client'

// import { useState, useEffect } from "react";
// import { createClient } from "@/lib/supabase/server";
// import {useCollection, useDocument} from "react-firebase-hooks/firestore";


// // no of documents
// const PRO_LIMIT= 20;
// const FREE_LIMIT=2;
// const supabase= createClient();

// async function useSubscription() {
//   const [hasActiveMembership, setActiveMembership]= useState(null);
//   const [isOverFileLimit, setIsOverFileLimit]= useState(false);
//   const { data: { user } } = await supabase.auth.getUser();
//     if (!user) throw new Error("Not authenticated");
//     // listen to the User document
//     const [snapshot, loading, error]= useDocument{
//         user && doc(db, "users",user.id),
//         {
//             snapshotListenOptions: {includeMetadataChanges: true},
//         }
//     };

//     const [fileSnapshot, filesLoading]= useCollection(
//         user && Collection(db,"users",user?.id,"files")
//     )

//     useEffect(()=>{
//         if(!snapshot) return;

//         const data= fileSnapshot.data();
//         if(!data) return;

//         setHasActiveMembership(data.activeMembership);
//     },[snapshot]);

//     useEffect(()=>{
//         if (!fileSnapshot || hasActiveMembership === null) return;

//         const files= fileSnapshot.docs;
//         const usersLimit= hasActiveMembership ? PRO_LIMIT : FREE_LIMIT
//         console.log(
//             "Check if user is over file limit",
//             files.length,
//             usersLimit
//         );
//     }, [fileSnapshot, hasActiveMembership,, PRO_LIMIT, FREE_LIMIT]);
// }

// export default useSubscription


'use client'

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";  // ← client not server

const PRO_LIMIT = 20;
const FREE_LIMIT = 2;

function useSubscription() {
    const [hasActiveMembership, setHasActiveMembership] = useState<boolean | null>(null);
    const [isOverFileLimit, setIsOverFileLimit] = useState(false);
    const [filesLoading, setFilesLoading] = useState(true);
    const [fileCount, setFileCount] = useState(0);

    // ← listen to user membership status
    useEffect(() => {
        const fetchMembership = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // ← replaces useDocument for user membership
            const { data: userData } = await supabase
                .from("users")
                .select("activeMembership")
                .eq("id", user.id)
                .single();

            setHasActiveMembership(userData?.activeMembership ?? false);
        };

        fetchMembership();
    }, []);

    // ← listen to file count
    useEffect(() => {
        const fetchFiles = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setFilesLoading(true);

            // ← replaces useCollection for files
            const { data: files, error } = await supabase
                .from("files")
                .select("id")
                .eq("user_id", user.id);

            if (error) {
                setFilesLoading(false);
                return;
            }

            setFileCount(files.length);
            setFilesLoading(false);
        };

        fetchFiles();
    }, []);

    // ← check if user is over file limit
    useEffect(() => {
        if (hasActiveMembership === null) return;

        const userLimit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;
        console.log("Check if user is over file limit", fileCount, userLimit);

        setIsOverFileLimit(fileCount >= userLimit);
    }, [fileCount, hasActiveMembership]);

    return { hasActiveMembership, isOverFileLimit, filesLoading };
}

export default useSubscription;

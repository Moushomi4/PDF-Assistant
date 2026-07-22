
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { FilePlus2 } from "lucide-react";


export  async function AuthButton() {
  const supabase =  await createClient();

  // You can also use getUser() which will be slower.
  // const { data } = await supabase.auth.getClaims();

  // const user = data?.claims;
  const { data: { user } } = await supabase.auth.getUser();
 

  // useEffect(() => {
  //   supabase.auth.getUser().then(({ data }) => {
  //     setUser(data.user)
  //   })
  // }, [])
// export function AuthButton() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Get current user on load
//     supabase.auth.getUser().then(({ data }) => {
//       setUser(data.user);
//       setLoading(false);
//     });

//     // Listen for auth changes (login/logout)
//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user ?? null);
//       }
//     );

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   if (loading) return null;

  return user ? (
    <div className="flex items-center gap-4">
      <Button asChild variant='link' className="hidden md:flex">
        <Link href='/protected/upgrade'>Pricing</Link>
    </Button>

    <Button asChild variant='outline' >
        <Link href='/protected'>My Documents</Link>
    </Button>

    <Button asChild variant='outline' className="border-blue-800" >
        <Link href='/protected/upload'>
        <FilePlus2 className="text-blue-800" />
        </Link>
    </Button>
      Hey, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}

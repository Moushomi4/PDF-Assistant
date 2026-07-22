'use client'
import { supabase } from '@/lib/supabase/client';
// import {SocialAuthButton} from './social-button';
import Image from 'next/image';
import SocialAuthButton from './social-button';

type provider = 'google' | 'github' |'facebook'

type providerType={
    name:provider;
    label: string;
    icon: string;
    size: number;
};

const providers: providerType[] = [
    {
        name: 'google',
        label: 'Sign in with Google',
        icon: '/google.png',
        size: 30
    },
    {
        name: 'github',
        label: 'Sign in with GitHub',
        icon: '/github.png',
        size: 30
    },
    {
        name: 'facebook',
        label: 'Sign in with Facebook',
        icon: '/facebook.png',
        size: 30
    }
];

const SocialAuthButtons = () => {
    const handleOAuthLogin= async(provider: provider) => {
        // const supabase= createClient();
        await supabase.auth.signInWithOAuth({
            provider,
            options:{
                redirectTo:`${window.location.origin}/auth/callback?next=/protected`,
                queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
            }
        })
    }
  return (
    <div>
        {providers.map((provider: providerType)=>(
            <SocialAuthButton key={provider.name} action={()=>handleOAuthLogin(provider.name)}>
                <Image 
                src={provider.icon}
                width={provider.size} 
                height={provider.size} 
                alt={provider.name} />
                
                {provider.label}
            </SocialAuthButton>
        )    )} 
        </div>
  )
}

export default SocialAuthButtons

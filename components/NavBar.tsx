
import React from 'react'
import  Link  from 'next/link';
import { DeployButton } from './deploy-button';
import { hasEnvVars } from '@/lib/utils';
import { EnvVarWarning} from './env-var-warning';
 import { Suspense } from 'react';
 import { AuthButton } from './auth-button';
 
const NavBar = () => {
  
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className=' text-indigo-700'>
              <span className='text-indigo-700 text-bold text-lg'>PDF</span><span className='text-indigo-950 text-bold text-lg'>Assistant</span>
              </Link>
              <div className="flex items-center gap-2">
                
              </div>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
  )
}

export default NavBar;

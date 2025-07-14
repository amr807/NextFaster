"use client"
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image"
import { Button } from "@/components/ui/button";

export default function GoogleButton(){
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
   const res= await signIn("google",{
      redirect: true,
      callbackUrl:"/login"
   })
   if (!res?.ok) {
   console.log("Google sign-in response:", res?.ok)
    setIsGoogleLoading(false)
   }

  }

    return(
                        <Button
                          onClick={handleGoogleSignup}
                          disabled={isGoogleLoading}
                          variant="outline"
                          className="w-full h-9 xs:h-10 sm:h-11 text-xs xs:text-sm sm:text-base border-[#E5E7EB] dark:border-gray-600 hover:bg-[#F9FAFB] dark:hover:bg-gray-700 hover:border-[#22D3EE] hover:shadow-md transition-all duration-200 dark:bg-gray-800 dark:text-gray-200"
                        >
                          {isGoogleLoading ? (
                            <div className="w-3 h-3 xs:w-4 xs:h-4 border-2 border-gray-300 dark:border-gray-600 border-t-[#6366F1] rounded-full animate-spin mr-2" />
                          ) : (
                            <Image src="google.svg" width={20} height={20} alt={"google.png"} />
                          )}
                          <span className="hidden xs:inline">Continue with Google</span>
                          <span className="xs:hidden"> Continue with Google</span>
                        </Button>
    )
}
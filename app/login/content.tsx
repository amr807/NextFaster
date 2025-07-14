"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useFormStatus } from "react-dom"
import { getCsrfToken, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import ConnectionToast from "@/components/ui/totats"
import GoogleButton from "../../components/Contents/client/googleButton"

export  function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [mounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const FadeIn = dynamic(() => import('@/components/animation/fadeIn'), {
  ssr: false,
});
  const params = useSearchParams().get("error")
console.log(params)
    const fetchCsrfToken = async () => {
      try {
        const token = await getCsrfToken()
        setCsrfToken(token || "")
      } catch (error) {
        console.error("Failed to get CSRF token:", error)
      }
    }
    fetchCsrfToken()
const router=useRouter()

 function SubmitButton() {
  const { pending } = useFormStatus();
return(
  
                  <Button
                    type="submit"
                    disabled={ pending}
                    className="w-full h-9 xs:h-10 sm:h-11 text-xs xs:text-sm sm:text-base bg-gradient-to-r from-[#3B82F6] to-[#6366F1] hover:from-[#22D3EE] hover:to-[#3B82F6] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {pending ? (
                      <div className="w-3 h-3 xs:w-4 xs:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : null}
                    {pending ? "Signing in..." : "Sign in"}
                  </Button>
)}

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
const result=await signIn("credentials", {email, password, redirect: false})
    if (result?.ok) { 
                  router.prefetch('/')

                           router.push("/") 

     }
      
    else{
  setError("Invalid email or password. Please check your credentials and try again.")


    

  }
  }
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#F9FAFB] via-white to-[#F3F4F6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    {params? <ConnectionToast/>:""

    }
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div
          className="absolute inset-0 sm:bg-[length:300px_300px,350px_350px,325px_325px,375px_375px] md:bg-[length:400px_400px,450px_450px,425px_425px,475px_475px]"
          style={{
            backgroundImage: `
            radial-gradient(circle at 25% 25%, #3B82F6 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #6366F1 0%, transparent 50%),
            radial-gradient(circle at 75% 25%, #22D3EE 0%, transparent 50%),
            radial-gradient(circle at 25% 75%, #3B82F6 0%, transparent 50%)
          `,
            backgroundSize: "200px 200px, 250px 250px, 225px 225px, 275px 275px",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          className="absolute inset-0 sm:bg-[length:30px_30px] md:bg-[length:40px_40px] lg:bg-[length:50px_50px]"
          style={{
            backgroundImage: `
            linear-gradient(#6366F1 1px, transparent 1px),
            linear-gradient(90deg, #6366F1 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>
      {mounted && (
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
        <FadeIn/>
        </div>
      )}


      <div className="relative z-10 min-h-screen flex items-center justify-center p-2 xs:p-3 sm:p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[280px] xs:max-w-sm sm:max-w-md lg:max-w-lg"
        >
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mx-auto">
            <CardHeader className="text-center pb-4 xs:pb-6 sm:pb-8 pt-4 xs:pt-6 sm:pt-8 px-3 xs:px-4 sm:px-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#6366F1] to-[#3B82F6] rounded-xl flex items-center justify-center mb-2 xs:mb-3 sm:mb-4 shadow-lg"
              >
                <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 bg-white rounded-md" />
              </motion.div>
              <CardTitle className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent">
                Welcome back
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Sign in to your account
              </CardDescription>
            </CardHeader>

            <CardContent className="px-3 xs:px-4 sm:px-8 pb-4 xs:pb-6 sm:pb-8">
              <div className="space-y-3 xs:space-y-4 sm:space-y-6">
<GoogleButton/>
                <div className="relative">
                  <Separator className="bg-[#E5E7EB] dark:bg-gray-600" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-2 xs:px-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    or
                  </span>
                </div>

                <form action={handleSubmit} className="space-y-2 xs:space-y-3 sm:space-y-4">
                  
                  <div className="space-y-1 sm:space-y-2">
                                    {csrfToken && (
                    <input type="hidden" name="csrfToken" value={csrfToken} />
                  )}
                    <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-2 xs:left-3 top-1/2 -translate-y-1/2 w-3 h-3 xs:w-4 xs:h-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-7 xs:pl-10 h-9 xs:h-10 sm:h-11 text-xs xs:text-sm sm:text-base border-[#E5E7EB] dark:border-gray-600 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:shadow-md transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                        required
                        onChange={() => setError(null)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-2 xs:left-3 top-1/2 -translate-y-1/2 w-3 h-3 xs:w-4 xs:h-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-7 xs:pl-10 pr-7 xs:pr-10 h-9 xs:h-10 sm:h-11 text-xs xs:text-sm sm:text-base border-[#E5E7EB] dark:border-gray-600 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:shadow-md transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                        required
                        onChange={() => setError(null)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 xs:right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#22D3EE] transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-3 h-3 xs:w-4 xs:h-4" />
                        ) : (
                          <Eye className="w-3 h-3 xs:w-4 xs:h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between space-y-2 xs:space-y-0">
                   
                    {error && (
                      <span className="text-xs sm:text-sm text-red-500 font-medium mt-1 block">
                        {error}
                      </span>
                    )}
                    <Link
                      href="/forgot-password"
                      className="text-xs sm:text-sm text-[#6366F1] hover:text-[#22D3EE] font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
<SubmitButton />
                </form>

                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link onMouseEnter={()=>router.prefetch("/signup")} href="/signup" className="text-[#6366F1] hover:text-[#22D3EE] font-medium transition-colors">
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

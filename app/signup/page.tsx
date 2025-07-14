"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {  AnimatePresence, motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, Check} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useFormStatus } from "react-dom"
import safeJsonStringify  from "safe-json-stringify"
import ToastMessages from "@/components/animation/toast_messages"
import { getCsrfToken } from "next-auth/react"
import { useQuery } from '@tanstack/react-query';
import GoogleButton from "@/components/Contents/client/googleButton"

async function fetchCsrfToken ()  {
      try {
        const token = await getCsrfToken()
        return token
      } catch (error) {
        console.error("Failed to get CSRF token:", error)
      }
    }
 

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showToast, setShowToast] = useState(false)
const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [mounted, setMounted] = useState(false)
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")
  const [viewportWidth, setViewportWidth] = useState(0)
     const { data: csrfToken } = useQuery({
    queryKey: ['csrfToken'],
    queryFn: fetchCsrfToken,
  });

useEffect(() => {
    setMounted(true)

    const checkViewport = () => {
      setViewportWidth(window.innerWidth)
      if (window.matchMedia("(orientation: portrait)").matches) {
        setOrientation("portrait")
      } else {
        setOrientation("landscape")
      }
    }

    checkViewport()
    window.addEventListener("resize", checkViewport)
    window.addEventListener("orientationchange", checkViewport)

    return () => {
      window.removeEventListener("resize", checkViewport)
      window.removeEventListener("orientationchange", checkViewport)
    }
  }, [])
const passwordRequirements = [
  { text: "8+ chars", met: password.length >= 8 },
  { text: "Letter (uppercase or lowercase)", met: /[A-Za-z]/.test(password) },
  { text: "Number", met: /\d/.test(password) },
  { text: "Special character (@$!%*?&)", met: /[@$!%*?&]/.test(password) },
];

   function SubmitButton() {
  const { pending } = useFormStatus();
const allRequirementsMet = passwordRequirements.every(r => r.met);
  return(                  <Button
                    type="submit"
                    disabled={pending || password !== confirmPassword || !allRequirementsMet}
                    className="w-full h-9 xs:h-10 sm:h-11 text-xs xs:text-sm sm:text-base bg-gradient-to-r from-[#3B82F6] to-[#6366F1] hover:from-[#22D3EE] hover:to-[#3B82F6] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {pending ? (
                      <div className="w-3 h-3 xs:w-4 xs:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : null}
                    {pending ? "Creating account..." : "Create account"}
                  </Button>)
 }
  const handleSubmit = async (formData:FormData) => {
    setPassword("")
    setConfirmPassword("")

const firstName=formData.get("firstName") as string
const lastName=formData.get("lastName")as string
const email=formData.get("email")as string
const password=formData.get("password")as string
try {
  const body=  safeJsonStringify(
   {
firstName: firstName,
lastName: lastName,
email: email,
password: password,

   } )

const response = await fetch(`${process.env.BASE_URL}/users/user_signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  })
if (response.status == 201) {
        setShowToast(true)


}
if (response.status == 409) {

  setError("Account already exists or needs verification. Please check your email.")
  
}

if (response.status == 500) {
  throw new Error("Internal server error")
}
  
// Remove sensitive logging in production
if (process.env.NODE_ENV === 'development') {
  console.log("body",body)
}
} catch (error) {
  console.error("Error during signup:", error)
}

  }


  const useSingleColumn = viewportWidth < 400 || (orientation === "portrait" && viewportWidth < 640)

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#F9FAFB] via-white to-[#F0F9FF] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div
          className="absolute inset-0 sm:bg-[length:400px_400px,450px_450px,500px_500px] md:bg-[length:500px_500px,550px_550px,600px_600px]"
          style={{
            backgroundImage: `
            radial-gradient(circle at 20% 80%, #22D3EE 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #3B82F6 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, #6366F1 0%, transparent 50%)
          `,
            backgroundSize: "300px 300px, 350px 350px, 400px 400px",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          className="absolute inset-0 sm:bg-[length:40px_40px] md:bg-[length:50px_50px] lg:bg-[length:60px_60px]3"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%236366F1' fillOpacity='1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}

        />
      </div>

      {mounted && (
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
          <AnimatePresence>
            <motion.div
            key={1}
              animate={{
                x: [0, -50, 0],
                y: [0, 100, 0],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 30,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute top-1/6 right-1/6 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 border-2 border-[#22D3EE]/20 rounded-xl"
            />
            <motion.div
              animate={{
                x: [0, 70, 0],
                y: [0, -50, 0],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute bottom-1/4 left-1/6 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-[#3B82F6]/10 to-[#6366F1]/10 rounded-full"
            />
          </AnimatePresence>
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
                className="mx-auto w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#6366F1] to-[#22D3EE] rounded-xl flex items-center justify-center mb-2 xs:mb-3 sm:mb-4 shadow-lg"
              >
                <User className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <CardTitle className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-[#6366F1] to-[#22D3EE] bg-clip-text text-transparent">
                Create account
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Get started with your free account
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
                  <div className={`grid ${useSingleColumn ? "grid-cols-1" : "grid-cols-2"} gap-2 xs:gap-3 sm:gap-4`}>
                                 {csrfToken && (
                    <input type="hidden" name="csrfToken" value={csrfToken} />
                  )}
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        First name
                      </Label>
                      <Input
                      onChange={() => setError(null)}
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        className="h-9 xs:h-10 sm:h-11 text-xs xs:text-sm sm:text-base border-[#E5E7EB] dark:border-gray-600 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:shadow-md transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                        required
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Last name
                      </Label>
                      <Input
                        onChange={() => setError(null)}
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        className="h-9 xs:h-10 sm:h-11 text-xs xs:text-sm sm:text-base border-[#E5E7EB] dark:border-gray-600 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:shadow-md transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-2 xs:left-3 top-1/2 -translate-y-1/2 w-3 h-3 xs:w-4 xs:h-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        onChange={() => setError(null)}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-7 xs:pl-10 h-9 xs:h-10 sm:h-11 text-xs xs:text-sm sm:text-base border-[#E5E7EB] dark:border-gray-600 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:shadow-md transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                        required
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
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}
                        className="pl-7 xs:pl-10 pr-7 xs:pr-10 h-9 xs:h-10 sm:h-11 text-xs xs:text-sm sm:text-base border-[#E5E7EB] dark:border-gray-600 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:shadow-md transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>{ setShowPassword(!showPassword)
                            setError(null)
                        }}
                        className="absolute right-2 xs:right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#22D3EE] transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-3 h-3 xs:w-4 xs:h-4" />
                        ) : (
                          <Eye className="w-3 h-3 xs:w-4 xs:h-4" />
                        )}
                      </button>
                    </div>
                    {password !="" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="grid grid-cols-2 gap-1 xs:gap-2 mt-1 xs:mt-2 p-1.5 xs:p-2 sm:p-3 bg-gradient-to-r from-[#F9FAFB] to-[#F0F9FF] dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg"
                      >
                        {passwordRequirements.map((req, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-1 xs:space-x-2 text-[10px] xs:text-xs"
                          >
                            <Check
                              className={`w-2.5 h-2.5 xs:w-3 xs:h-3 ${req.met ? "text-[#22D3EE]" : "text-[#E5E7EB] dark:text-gray-600"}`}
                            />
                            <span className={req.met ? "text-[#22D3EE]" : "text-gray-500 dark:text-gray-400"}>
                              {req.text}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-2 xs:left-3 top-1/2 -translate-y-1/2 w-3 h-3 xs:w-4 xs:h-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-7 xs:pl-10 pr-7 xs:pr-10 h-9 xs:h-10 sm:h-11 text-xs xs:text-sm sm:text-base border-[#E5E7EB] dark:border-gray-600 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:shadow-md transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 xs:right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#22D3EE] transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-3 h-3 xs:w-4 xs:h-4" />
                        ) : (
                          <Eye className="w-3 h-3 xs:w-4 xs:h-4" />
                        )}
                      </button>
                    </div>
                    {confirmPassword !="" && password !== confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] xs:text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-1.5 xs:p-2 rounded-md"
                      >
                        Passwords do not match
                      </motion.p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" required className="mt-0.5 xs:mt-1" />
                    <Label
                      htmlFor="terms"
                      className="text-[10px] xs:text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-[#6366F1] hover:text-[#22D3EE] transition-colors">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-[#6366F1] hover:text-[#22D3EE] transition-colors">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] xs:text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-1.5 xs:p-2 rounded-md"
                    >
                      {error}
                    </motion.p>
                  )}
<SubmitButton/>

                </form>

                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#6366F1] hover:text-[#22D3EE] font-medium transition-colors">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
<ToastMessages
  showToasts={showToast}
  toastMessage="Your email was sent. Check to verify."
  toastType="success"
  onClose={() => setShowToast(false)}
/>
   
   
   </div>
  )
}
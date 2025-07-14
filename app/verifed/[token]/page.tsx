"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { verify_email } from "@/components/apis/verifed"
import dynamic from "next/dynamic"

type VerificationState = "loading" | "success" | "expired" | "error"
const Button = dynamic(() => import('@/components/ui/button').then(mod => mod.Button), { ssr: false })
const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card), { ssr: false })
const CardContent = dynamic(() => import('@/components/ui/card').then(mod => mod.CardContent), { ssr: false })
const CardDescription = dynamic(() => import('@/components/ui/card').then(mod => mod.CardDescription), { ssr: false })
const CardHeader = dynamic(() => import('@/components/ui/card').then(mod => mod.CardHeader), { ssr: false })
const CardTitle = dynamic(() => import('@/components/ui/card').then(mod => mod.CardTitle), { ssr: false })

const VERIFICATION_STATES = {
  loading: {
    icon: Loader2,
    title: "Verifying your email...",
    iconClass: "h-12 w-12 sm:h-16 sm:w-16 animate-spin text-blue-500",
    description: "Please wait while we verify your email address...",
  },
  success: {
    icon: CheckCircle,
    title: "Email Verified!",
    iconClass: "h-12 w-12 sm:h-16 sm:w-16 text-green-500",
    description: "Thank you for verifying your email address. Your account is now active.",
  },
  expired: {
    icon: XCircle,
    title: "Link Expired",
    iconClass: "h-12 w-12 sm:h-16 sm:w-16 text-red-500",
    description: "Your confirmation link is no longer valid. Please request a new verification email.",
  },
  error: {
    icon: XCircle,
    title: "Verification Failed",
    iconClass: "h-12 w-12 sm:h-16 sm:w-16 text-red-500",
    description: "An error occurred during verification. Please try again.",
  },
} as const

export default function Verification() {
  const [state, setState] = useState<VerificationState>("loading")
  const [customMessage, setCustomMessage] = useState("")
  const router = useRouter()
  const params = useParams()
const token = params.token as string 
  const verifyToken = useCallback(async () => {
    if (!token) {
      setState("error")
      setCustomMessage("No verification token provided.")
      return
    }

    setState("loading")
    setCustomMessage("")

    try {
      const response = await verify_email(token)

      if (response === true) {
        setState("success")
        // Auto-redirect after 3 seconds
        // setTimeout(() => router.push("/login"), 3000)
      } else if (response === false) {
        setState("expired")
        // Auto-redirect after 5 seconds
        // setTimeout(() => router.push("/"), 5000)
      } else {
        setState("error")
        setCustomMessage("An error occurred during verification. Please try again.")
      }
    } catch (error) {
      console.error("Verification error:", error)
      setState("error")
      setCustomMessage("Network error. Please check your connection and try again.")
    }
  }, [token])

  useEffect(() => {
    verifyToken()
  }, [verifyToken])

  const currentState = VERIFICATION_STATES[state]
  const IconComponent = currentState.icon
  const displayMessage = customMessage || currentState.description

  return (
    <>
    <head>
<title>{currentState.title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content={currentState.description} />

    </head>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-sm sm:max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <IconComponent className={currentState.iconClass} />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">{currentState.title}</CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
              {displayMessage}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="text-center space-y-4 pt-0">
          {state === "success" && (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">Your email verification is complete!</p>
                <p className="text-xs text-green-600 mt-1">Redirecting to login in 3 seconds...</p>
              </div>
              <Button onClick={() => router.push("/login")} className="w-full h-11 font-medium" size="lg">
                Continue to Login
              </Button>
            </div>
          )}

          {state === "expired" && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-700">
                  Please request a new verification email from the registration page.
                </p>
                <p className="text-xs text-amber-600 mt-1">Redirecting to home in 5 seconds...</p>
              </div>
              <Button onClick={() => router.push("/")} variant="outline" className="w-full h-11" size="lg">
                Go Home Now
              </Button>
            </div>
          )}

          {state === "error" && (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700">{customMessage || "Something went wrong during verification."}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={verifyToken} variant="outline" className="flex-1 h-11 bg-transparent" size="lg">
                  Try Again
                </Button>
                <Button onClick={() => router.push("/")} variant="ghost" className="flex-1 h-11" size="lg">
                  Go Home
                </Button>
              </div>
            </div>
          )}

          {state === "loading" && (
            <div className="py-4">
              <div className="animate-pulse space-y-2">
                <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div></>
  )
}

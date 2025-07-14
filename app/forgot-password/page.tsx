"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle, Key } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#F9FAFB] via-white to-[#EFF6FF] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 opacity-20 dark:opacity-10 sm:bg-[length:600px_600px] md:bg-[length:800px_800px]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, #22D3EE 0%, transparent 70%)`,
              backgroundSize: "400px 400px",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-2 xs:p-3 sm:p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[280px] xs:max-w-sm sm:max-w-md"
          >
            <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-center mx-auto">
              <CardContent className="pt-6 xs:pt-8 sm:pt-12 pb-4 xs:pb-6 sm:pb-8 px-3 xs:px-4 sm:px-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] rounded-full flex items-center justify-center mb-3 xs:mb-4 sm:mb-6 shadow-lg"
                >
                  <CheckCircle className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-white" />
                </motion.div>
                <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold bg-gradient-to-r from-[#6366F1] to-[#22D3EE] bg-clip-text text-transparent mb-1 xs:mb-2">
                  Check your email
                </h2>
                <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 xs:mb-4 sm:mb-6">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-200 bg-gradient-to-r from-[#F9FAFB] to-[#EFF6FF] dark:from-gray-700 dark:to-gray-600 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded break-all">
                    {email}
                  </span>
                </p>
                <div className="space-y-2 xs:space-y-3">
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="w-full h-9 xs:h-10 sm:h-11 text-xs xs:text-sm sm:text-base border-[#E5E7EB] dark:border-gray-600 hover:bg-[#F9FAFB] dark:hover:bg-gray-700 hover:border-[#22D3EE] hover:shadow-md transition-all duration-200 dark:bg-gray-800 dark:text-gray-200"
                  >
                    Try another email
                  </Button>
                  <Link href="/login" className="block">
                    <Button className="w-full h-9 xs:h-10 sm:h-11 text-xs xs:text-sm sm:text-base bg-gradient-to-r from-[#3B82F6] to-[#6366F1] hover:from-[#22D3EE] hover:to-[#3B82F6] text-white shadow-lg hover:shadow-xl transition-all duration-200">
                      Back to sign in
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#F9FAFB] via-white to-[#EFF6FF] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 opacity-25 dark:opacity-15 sm:bg-[length:400px_400px,450px_450px] md:bg-[length:500px_500px,550px_550px]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 30% 70%, #6366F1 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, #22D3EE 0%, transparent 50%)
          `,
            backgroundSize: "300px 300px, 350px 350px",
            filter: "blur(50px)",
          }}
        />
      </div>

      {/* Responsive Dot Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div
          className="absolute inset-0 sm:bg-[length:20px_20px] md:bg-[length:25px_25px] lg:bg-[length:30px_30px]"
          style={{
            backgroundImage: `radial-gradient(circle, #6366F1 1px, transparent 1px)`,
            backgroundSize: "15px 15px",
          }}
        />
      </div>

      {/* Animated Elements - Hidden on mobile */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
          <AnimatePresence>
            <motion.div
              animate={{
                x: [0, 30, 0],
                y: [0, -40, 0],
                rotate: [0, 45, 0],
              }}
              transition={{
                duration: 18,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute top-1/3 left-1/5 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 border border-[#22D3EE]/30 rounded-md"
            />
          </AnimatePresence>
        </div>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-2 xs:p-3 sm:p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[280px] xs:max-w-sm sm:max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mx-auto">
            <CardHeader className="text-center pb-4 xs:pb-6 sm:pb-8 pt-4 xs:pt-6 sm:pt-8 px-3 xs:px-4 sm:px-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#6366F1] to-[#22D3EE] rounded-xl flex items-center justify-center mb-2 xs:mb-3 sm:mb-4 shadow-lg"
              >
                <Key className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <CardTitle className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-[#6366F1] to-[#22D3EE] bg-clip-text text-transparent">
                Reset password
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Enter your email and we&apos;ll send you a reset link
              </CardDescription>
            </CardHeader>

            <CardContent className="px-3 xs:px-4 sm:px-8 pb-4 xs:pb-6 sm:pb-8">
              <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4 sm:space-y-6">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2 xs:left-3 top-1/2 -translate-y-1/2 w-3 h-3 xs:w-4 xs:h-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-7 xs:pl-10 h-9 xs:h-10 sm:h-11 text-xs xs:text-sm sm:text-base border-[#E5E7EB] dark:border-gray-600 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:shadow-md transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full h-9 xs:h-10 sm:h-11 text-xs xs:text-sm sm:text-base bg-gradient-to-r from-[#3B82F6] to-[#6366F1] hover:from-[#22D3EE] hover:to-[#3B82F6] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="w-3 h-3 xs:w-4 xs:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : null}
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </form>

              <div className="mt-3 xs:mt-4 sm:mt-6 text-center space-y-2 xs:space-y-3 sm:space-y-4">
                <Link
                  href="/login"
                  className="inline-flex items-center text-[10px] xs:text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-[#6366F1] font-medium transition-colors"
                >
                  <ArrowLeft className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-1" />
                  Back to sign in
                </Link>

                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-[#6366F1] hover:text-[#22D3EE] font-medium transition-colors">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

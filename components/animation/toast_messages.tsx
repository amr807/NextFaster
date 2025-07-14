import { Send, Sparkles, MessageSquare } from "lucide-react"
import { useEffect } from "react"

type toastMessage={
  showToasts:boolean
toastMessage:string
toastType: "success" | "error"
  onClose: () => void

}


export default function ToastMessages({
  showToasts,
  toastMessage,
  toastType,
  onClose

}: toastMessage) {

useEffect(() => {
    const timer = setTimeout(() => {
onClose()

}, 4000)

    return () => clearTimeout(timer)
  }, [onClose])


  return (
    <div>
      {showToasts && (
        <div
          className={`fixed top-6 right-4 md:right-6 z-[100] transform transition-all duration-500 ${
            showToasts ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <div
            className={`relative overflow-hidden rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-lg border min-w-[280px] md:min-w-[320px] ${
              toastType === "success"
                ? "bg-gradient-to-r from-emerald-500/90 to-teal-500/90 border-emerald-400/50"
                : "bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400/50"
            }`}
          >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-white/40 rounded-full animate-ping delay-500"></div>
              <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white/20 rounded-full animate-ping delay-1000"></div>
            </div>

            <div className="relative flex items-center space-x-4">
              <div className="p-2 rounded-full bg-white/20">
                {toastType === "success" ? (
                  <div className="relative">
                    <Send className="w-5 h-5 md:w-6 md:h-6 text-white animate-bounce" />
                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-spin" />
                  </div>
                ) : (
                  <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white animate-pulse" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-white font-semibold text-base md:text-lg">{toastMessage}</p>
                <div className="flex items-center mt-1 space-x-1">
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse delay-200"></div>
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse delay-500"></div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 text-white/80 hover:text-white text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div className="h-full bg-white/60 w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

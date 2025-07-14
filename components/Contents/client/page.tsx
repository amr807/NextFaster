"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function PaginationComponent({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center space-x-1">
      {/* Previous Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center space-x-1 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
      </motion.div>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <div key={`dots-${index}`} className="px-3 py-2">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </div>
            )
          }

          const pageNumber = page as number
          const isActive = pageNumber === currentPage

          return (
            <motion.div key={pageNumber} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                className={`min-w-[40px] h-10 rounded-xl font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg border-0 hover:from-blue-600 hover:to-purple-600"
                    : "border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 bg-white text-gray-700"
                }`}
              >
                {pageNumber}
              </Button>
            </motion.div>
          )
        })}
      </div>

      {/* Next Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-1 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Page Info */}
      <div className="hidden md:flex items-center ml-4 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/lib/types/product"
import { motion } from "framer-motion"
import { Badge, Heart, Star } from "lucide-react"
import type { ReactNode } from "react"
import Image from "next/image"
import { Link } from "@/components/ui/link"

type Props = {
  product: Product
  toggleWishlist: (id: number) => void
  index: number
  wishlist: number[]
  isLoading: string | null
  viewMode: string
  addToCart: (product: Product) => void
}

export default function Filterproduct({
  index,
  wishlist,
  product,
  toggleWishlist,
  isLoading,
  viewMode,
  addToCart,
}: Props): ReactNode {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() 
    e.stopPropagation() 
    addToCart(product)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault() 
    e.stopPropagation() 
    toggleWishlist(product.id)
  }

  return (
    <Link prefetch={true} onMouseDown={() => console.log("Ffff")} href={`product/${product.id}`}>
      <motion.div
        key={product.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: index * 0.03 }}
        whileHover={{ y: -8, scale: 1.02 }}
      >
        <Card
          className={`overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg rounded-2xl bg-white cursor-pointer group ${
            viewMode === "list" ? "flex" : ""
          }`}
        >
          <div className={`relative ${viewMode === "list" ? "w-48" : ""}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-t-2xl" />
            {product.image && product.image.trim() !== "" && (
              <Image
                decoding="sync"
                src={product.image}
                alt={product.name}
                width={300}
                priority={index < 4}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                height={300}
                className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                  viewMode === "list" ? "w-48 h-48" : "w-full h-64"
                }`}
              />
            )}
            <div className="absolute top-3 left-3 z-20">
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                -{product.discount}%
              </Badge>
            </div>
            <div className="absolute top-3 right-3 z-20">
              <Badge className="bg-white/90 backdrop-blur-sm shadow-lg border-0">{product.badge}</Badge>
            </div>
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 rounded-t-2xl">
                <Badge className="text-lg px-4 py-2 bg-red-600 text-white">Out of Stock</Badge>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className="absolute top-3 right-14 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20"
            >
              <Heart
                className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
              />
            </motion.button>
          </div>
          <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
            <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-800 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2 font-medium">
                {product.rating} ({product.reviews.toLocaleString()})
              </span>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ${product.price}
              </span>
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                key={product.id}
                onClick={handleAddToCart}
                disabled={!product.inStock || isLoading == product.id.toString()}
                className={`w-full font-semibold py-3 rounded-xl transition-all ${
                  product.inStock
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-400 text-gray-600"
                }`}
              >
                {isLoading == product.id.toString() ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </div>
                ) : product.inStock ? (
                  "Add to Cart"
                ) : (
                  "Out of Stock"
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}

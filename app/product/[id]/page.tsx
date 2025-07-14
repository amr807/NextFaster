"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  Plus,
  Minus,
  Check,
  MessageCircle,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  Zap,
  ArrowLeft,
  Home,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  image: string
  category: string
  badge: string
  discount: number
  inStock: boolean
  description?: string
  features?: string[]
  specifications?: { [key: string]: string }
  images?: string[]
  variants?: { color?: string[]; size?: string[] }
}

const products: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 1199.99,
    originalPrice: 1299.99,
    rating: 4.8,
    reviews: 15420,
    image: "/placeholder.svg?height=300&width=300",
    category: "electronics",
    badge: "New",
    discount: 8,
    inStock: true,
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    price: 1099.99,
    originalPrice: 1199.99,
    rating: 4.7,
    reviews: 12350,
    image: "/placeholder.svg?height=300&width=300",
    category: "electronics",
    badge: "Popular",
    discount: 8,
    inStock: true,
  },
  {
    id: 3,
    name: "Google Pixel 8 Pro",
    price: 899.99,
    originalPrice: 999.99,
    rating: 4.6,
    reviews: 8920,
    image: "/placeholder.svg?height=300&width=300",
    category: "electronics",
    badge: "Choice",
    discount: 10,
    inStock: true,
  },
  {
    id: 4,
    name: "OnePlus 12",
    price: 799.99,
    originalPrice: 899.99,
    rating: 4.5,
    reviews: 6540,
    image: "/placeholder.svg?height=300&width=300",
    category: "electronics",
    badge: "Deal",
    discount: 11,
    inStock: false,
  },
  {
    id: 5,
    name: 'MacBook Pro 16" M3',
    price: 2499.99,
    originalPrice: 2699.99,
    rating: 4.9,
    reviews: 8750,
    image: "/placeholder.svg?height=300&width=300",
    category: "computers",
    badge: "Premium",
    discount: 7,
    inStock: true,
  },
]

const mockProductDetails = {
  description:
    "Experience the pinnacle of smartphone technology with cutting-edge features, premium build quality, and exceptional performance that sets new standards in mobile innovation.",
  features: [
    "Advanced A17 Pro chip with 6-core CPU",
    "Pro camera system with 48MP main camera",
    "6.7-inch Super Retina XDR display",
    "All-day battery life with fast charging",
    "5G connectivity for ultra-fast speeds",
    "Face ID for secure authentication",
    "iOS 17 with latest features",
    "Premium titanium design",
  ],
  specifications: {
    Display: "6.7-inch Super Retina XDR",
    Processor: "A17 Pro chip",
    Storage: "256GB",
    Camera: "48MP + 12MP + 12MP",
    Battery: "4422 mAh",
    OS: "iOS 17",
    Connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
    Weight: "221g",
    Dimensions: "159.9 × 76.7 × 8.25 mm",
    "Water Resistance": "IP68",
  },
  images: [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ],
  variants: {
    color: ["Space Black", "White Titanium", "Blue Titanium", "Natural Titanium"],
    size: ["128GB", "256GB", "512GB", "1TB"],
  },
}

const mockReviews = [
  {
    id: 1,
    user: "John D.",
    rating: 5,
    date: "2 days ago",
    comment: "Absolutely amazing product! The quality exceeded my expectations and the performance is outstanding.",
    helpful: 24,
    verified: true,
  },
  {
    id: 2,
    user: "Sarah M.",
    rating: 4,
    date: "1 week ago",
    comment: "Great value for money. Fast shipping and excellent customer service. Highly recommended!",
    helpful: 18,
    verified: true,
  },
  {
    id: 3,
    user: "Mike R.",
    rating: 5,
    date: "2 weeks ago",
    comment: "Perfect! Works exactly as described. The build quality is premium and it feels very solid.",
    helpful: 31,
    verified: false,
  },
]

export default function ProductPage() {
  const params=useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [wishlist, setWishlist] = useState<number[]>([])
  const [notifications, setNotifications] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch product by ID
    const fetchProduct = async () => {
      setIsLoading(true)
      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const foundProduct = products.find((p) => p.id === Number.parseInt( String(params.id)))
      if (foundProduct) {
        setProduct(foundProduct)
        if (mockProductDetails.variants) {
          setSelectedColor(mockProductDetails.variants.color?.[0] || "")
          setSelectedSize(mockProductDetails.variants.size?.[0] || "")
        }
      }
      setIsLoading(false)
    }

    fetchProduct()
  }, [params.id])

  const addNotification = (message: string) => {
    setNotifications((prev) => [...prev, message])
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1))
    }, 3000)
  }

  const handleAddToCart = () => {
    if (product) {
      addNotification(`${product.name} added to cart!`)
    }
  }

  const toggleWishlist = () => {
    if (product) {
      if (wishlist.includes(product.id)) {
        setWishlist((prev) => prev.filter((id) => id !== product.id))
        addNotification(`${product.name} removed from wishlist`)
      } else {
        setWishlist((prev) => [...prev, product.id])
        addNotification(`${product.name} added to wishlist!`)
      }
    }
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % mockProductDetails.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + mockProductDetails.images.length) % mockProductDetails.images.length)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="h-16 w-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-xl">
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isInWishlist = wishlist.includes(product.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl max-w-xs text-sm font-medium backdrop-blur-sm border border-white/20"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>{notification}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Header Navigation */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600 transition-all">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Shop
                </Button>
              </Link>
              <div className="text-sm text-gray-500">
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Products
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-800 font-medium">{product.name}</span>
              </div>
            </div>
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ShopHub
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 p-8 lg:p-12">
            {/* Image Gallery */}
            <div className="space-y-6">
              <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden group shadow-xl">
                <Image
                  src={mockProductDetails.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 space-y-2">
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                    -{product.discount}%
                  </Badge>
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                    {product.badge}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {mockProductDetails.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-3 transition-all shadow-lg ${
                      selectedImage === index
                        ? "border-blue-500 shadow-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">{product.name}</h1>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-gray-100">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleWishlist}
                      className="rounded-full hover:bg-gray-100"
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {product.rating} ({product.reviews.toLocaleString()} reviews)
                  </span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    Verified Reviews
                  </Badge>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-6 py-4">
                <span className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ${product.price}
                </span>
                <span className="text-2xl text-gray-500 line-through">${product.originalPrice}</span>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg px-4 py-2">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {product.inStock ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-600 font-medium">In Stock - Ready to Ship</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Variants */}
              {mockProductDetails.variants?.color && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Color: {selectedColor}</h3>
                  <div className="flex flex-wrap gap-3">
                    {mockProductDetails.variants.color.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-3 rounded-xl border-2 transition-all font-medium ${
                          selectedColor === color
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                        }`}
                      >
                        {color}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {mockProductDetails.variants?.size && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Storage: {selectedSize}</h3>
                  <div className="flex flex-wrap gap-3">
                    {mockProductDetails.variants.size.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 rounded-xl border-2 transition-all font-medium ${
                          selectedSize === size
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 p-0 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center font-semibold text-xl">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12 p-0 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-6 rounded-2xl text-xl shadow-xl hover:shadow-2xl transition-all"
                    size="lg"
                  >
                    <ShoppingCart className="h-6 w-6 mr-3" />
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </Button>
                </motion.div>
                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-200 hover:bg-gray-50 py-6 rounded-2xl text-xl font-semibold bg-transparent shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  <Zap className="h-6 w-6 mr-3" />
                  Buy Now
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                <div className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
                  <Truck className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <div className="text-sm font-semibold text-gray-800">Free Shipping</div>
                  <div className="text-xs text-gray-500">On orders $50+</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-sm font-semibold text-gray-800">Secure Payment</div>
                  <div className="text-xs text-gray-500">100% Protected</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
                  <RotateCcw className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <div className="text-sm font-semibold text-gray-800">Easy Returns</div>
                  <div className="text-xs text-gray-500">30-day policy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="border-t border-gray-100 mt-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b border-gray-100 bg-transparent h-auto p-0 rounded-none">
                <TabsTrigger
                  value="overview"
                  className="px-8 py-6 border-b-3 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none text-lg font-semibold"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="px-8 py-6 border-b-3 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none text-lg font-semibold"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="px-8 py-6 border-b-3 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none text-lg font-semibold"
                >
                  Reviews ({product.reviews})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-8 lg:p-12 space-y-10">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{mockProductDetails.description}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-6">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockProductDetails.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                      >
                        <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 text-lg">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="p-8 lg:p-12">
                <h3 className="text-2xl font-bold mb-8">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(mockProductDetails.specifications).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex justify-between items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                    >
                      <span className="font-semibold text-gray-800 text-lg">{key}</span>
                      <span className="text-gray-600 text-lg">{value}</span>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-8 lg:p-12">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Customer Reviews</h3>
                    <Button variant="outline" className="rounded-xl bg-transparent px-6 py-3">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Write a Review
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 bg-gray-50 rounded-3xl">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-800 mb-2">{product.rating}</div>
                      <div className="flex justify-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Overall Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800 mb-2">{product.reviews.toLocaleString()}</div>
                      <div className="text-sm text-gray-600 font-medium">Total Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                      <div className="text-sm text-gray-600 font-medium">Recommended</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">4.2</div>
                      <div className="text-sm text-gray-600 font-medium">Avg. Rating</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {mockReviews.map((review, index) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-8 border border-gray-200 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                              {review.user.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-3 mb-1">
                                <span className="font-semibold text-lg">{review.user}</span>
                                {review.verified && (
                                  <Badge variant="outline" className="text-green-600 border-green-200">
                                    <Check className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">{review.comment}</p>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 px-4 py-2">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Helpful ({review.helpful})
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

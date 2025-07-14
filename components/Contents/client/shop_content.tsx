"use client"
import { useState, useEffect, useMemo, useCallback, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Search,
  ShoppingCart,
  UserIcon,
  Heart,
  Grid,
  List,
  Truck,
  Shield,
  RotateCcw,
  ShoppingBag,
  LogOut,
  Settings,
  Package,
  CreditCard,
  X,
  Plus,
  Minus,
  Menu,
  Filter,
  Bell,
  Gift,
  Zap,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import type { Product } from "@/lib/types/product"
import type { Category } from "@/components/apis/catgoiry"
import ProductCardSkeleton from "@/components/animation/cardskelton"
import dynamic from "next/dynamic"
import { Link } from "@/components/ui/link"
import { useQuery } from "@tanstack/react-query"
import { getProduct } from "@/components/apis/graphql"

const CategoriesIcon = dynamic(() => import("../server/catgory").then((mod) => mod.CategoriesIcon), {
  ssr: false,
})

const Filterproduct = dynamic(() => import("./peoductsui"), {
  ssr: false,
})

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

const featuredDeals = [
  {
    id: 1,
    title: "Flash Sale - Electronics",
    subtitle: "Up to 50% off smartphones & tablets",
    image: "/placeholder.svg?height=200&width=400",
    cta: "Shop Now",
    gradient: "from-purple-600 via-pink-600 to-red-600",
  },
  {
    id: 2,
    title: "Home Essentials",
    subtitle: "Transform your space with 30% off",
    image: "/placeholder.svg?height=200&width=400",
    cta: "Explore",
    gradient: "from-blue-600 via-cyan-600 to-teal-600",
  },
  {
    id: 3,
    title: "Fashion Week",
    subtitle: "Latest trends at unbeatable prices",
    image: "/placeholder.svg?height=200&width=400",
    cta: "Discover",
    gradient: "from-orange-600 via-red-600 to-pink-600",
  },
]

type User = {
  id: string
  email: string
  name: string
  avatar: string
  firstName?: string
  lastName?: string
}

type Props = {
  products: number
  categories: Category[]
}

export default function EnhancedEcommercePage({ products, categories }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Get values from URL params with defaults
  const selectedCategory = searchParams.get("category") || "all"
  const searchQuery = searchParams.get("search") || ""
  const sortBy = searchParams.get("sort") || "featured"
  const viewMode = searchParams.get("view") || "grid"
  const priceRange = searchParams.get("price") || "all"
  const currentPage = Number.parseInt(searchParams.get("page") || "1")

  // Local state for UI interactions
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [currentDeal, setCurrentDeal] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null)

  const itemsPerPage = 12
const { data, isLoading ,refetch} = useQuery({
    queryKey: ['product', currentPage, itemsPerPage],
    queryFn: () => getProduct(currentPage, itemsPerPage),
  });
const { data: session } = useSession()
  const auth = session?.user as User

  const user: User = {
    id: auth?.id,
    firstName: auth?.firstName,
    lastName: auth?.lastName,
    email: auth?.email,
    name: auth?.firstName + " " + auth?.lastName,
    avatar: auth?.avatar ?? "/placeholder.svg?height=40&width=40",
  }

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
refetch()
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || (key === "page" && value === "1")) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
    window.scrollTo({ top: 10, behavior: 'smooth' });
console.log("jj",performance.now)
      const newUrl = `${pathname}?${params.toString()}`
      router.replace(newUrl) 

    },
    [searchParams, refetch, pathname, router],
  )

  const setSelectedCategory = useCallback(
    (category: string) => {
      updateSearchParams({ category: category === "all" ? null : category, page: null })
    },
    [updateSearchParams],
  )

  const setSearchQuery = useCallback(
    (query: string) => {
      updateSearchParams({ search: query || null, page: null })
    },
    [updateSearchParams],
  )

  const setSortBy = useCallback(
    (sort: string) => {
      updateSearchParams({ sort: sort === "featured" ? null : sort, page: null })
    },
    [updateSearchParams],
  )

  const setViewMode = useCallback(
    (view: string) => {
      updateSearchParams({ view: view === "grid" ? null : view })
    },
    [updateSearchParams],
  )

  const setPriceRange = useCallback(
    (price: string) => {
      updateSearchParams({ price: price === "all" ? null : price, page: null })
    },
    [updateSearchParams],
  )

  const setCurrentPage = useCallback(
    (page: number) => {
      updateSearchParams({ page: page === 1 ? null : page.toString() })
    },
    [updateSearchParams],
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDeal((prev) => (prev + 1) % featuredDeals.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])
  
  const filteredProducts = useMemo(() => {
    const filtered = !isLoading  
      ? (data ?? []).filter((product) => {
          const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
          const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
          const matchesPrice =
            priceRange === "all" ||
            (priceRange === "under-100" && product.price < 100) ||
            (priceRange === "100-500" && product.price >= 100 && product.price <= 500) ||
            (priceRange === "500-1000" && product.price > 500 && product.price <= 1000) ||
            (priceRange === "over-1000" && product.price > 1000)
          return matchesCategory && matchesSearch && matchesPrice
        })
      : []

    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price)
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price)
      case "rating":
        return filtered.sort((a, b) => b.rating - a.rating)
      case "reviews":
        return filtered.sort((a, b) => b.reviews - a.reviews)
      case "discount":
        return filtered.sort((a, b) => b.discount - a.discount)
      default:
        return filtered
    }
  }, [isLoading, data, sortBy, selectedCategory, searchQuery, priceRange])

  const totalPages = Math.ceil(products / itemsPerPage)
  // const startIndex = (currentPage - 1) * itemsPerPage
  // const endIndex = startIndex + itemsPerPage
  // const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const addNotification = useCallback((message: string) => {
    setNotifications((prev) => [...prev, message])
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1))
    }, 3000)
  }, [])

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }
    return pages
  }

  const addToCart = useCallback(
    (product: Product) => {
      setLoadingProductId(product.id.toString())
      setTimeout(() => {
        const existingItem = cartItems.find((item) => item.id === product.id)
        if (existingItem) {
          setCartItems((prev) =>
            prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)),
          )
        } else {
          setCartItems((prev) => [
            ...prev,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image: product.image,
            },
          ])
        }
        addNotification(`${product.name} added to cart!`)
        setLoadingProductId(null)
      }, 300)
    },
    [addNotification, cartItems],
  )

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const updateCartQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId)
        return
      }
      setCartItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    },
    [removeFromCart],
  )

  const toggleWishlist = useCallback(
    (productId: number) => {
      const product = filteredProducts.find((p) => p.id === productId)
      if (wishlist.includes(productId)) {
        setWishlist((prev) => prev.filter((id) => id !== productId))
        addNotification(`${product?.name} removed from wishlist`)
      } else {
        setWishlist((prev) => [...prev, productId])
        addNotification(`${product?.name} added to wishlist!`)
      }
    },
    [filteredProducts, wishlist, addNotification],
  )

  const clearAllFilters = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
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
        </AnimatePresence>
      </div>

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50" : "bg-white shadow-lg"
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Enhanced Top bar */}
          <div className="hidden md:flex items-center justify-between py-2 text-sm border-b border-gray-100">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-6"
            >
              <div className="flex items-center space-x-2 text-gray-600">
                <Truck className="h-4 w-4 text-green-500" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Flash deals ending soon!</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <Bell className="h-4 w-4 mr-1" />
                Customer Service
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <Package className="h-4 w-4 mr-1" />
                Track Order
              </Button>
            </motion.div>
          </div>

          {/* Enhanced Main header */}
          <div className="flex items-center py-4 space-x-4 md:space-x-8">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-blue-50 hover:text-blue-600 transition-all"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 cursor-pointer flex-shrink-0"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ShopHub
                </div>
              </motion.div>
            </Link>

            {/* Enhanced Desktop Search bar */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <motion.div whileFocus={{ scale: 1.02 }} className="relative w-full group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-xl" />
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    type="text"
                    placeholder="Search for products, brands, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-gray-50 focus:bg-white transition-all shadow-sm hover:shadow-md focus:shadow-lg"
                  />
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-blue-50 hover:text-blue-600 transition-all"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-3 md:space-x-6">
              <Popover>
                <PopoverTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 md:h-10 md:w-10 ring-2 ring-blue-100 hover:ring-blue-200 transition-all">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-semibold text-gray-800">Hello, {user.name.split(" ")[0]}</div>
                      <div className="text-xs text-gray-500">Account & Lists</div>
                    </div>
                  </motion.div>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0 border-0 shadow-2xl" align="end">
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 ring-2 ring-white/30">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="bg-white/20 text-white font-semibold">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-white/80">{user.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 transition-all"
                        size="sm"
                      >
                        <UserIcon className="h-4 w-4 mr-3" />
                        Your Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 transition-all"
                        size="sm"
                      >
                        <Package className="h-4 w-4 mr-3" />
                        Your Orders
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 transition-all"
                        size="sm"
                      >
                        <Heart className="h-4 w-4 mr-3" />
                        Wishlist ({wishlist.length})
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 transition-all"
                        size="sm"
                      >
                        <CreditCard className="h-4 w-4 mr-3" />
                        Payment Methods
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 transition-all"
                        size="sm"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Button>
                      <Separator className="my-2" />
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-all"
                        size="sm"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Enhanced Cart */}
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 cursor-pointer relative p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
                  >
                    <div className="relative">
                      <ShoppingCart className="h-6 w-6 text-gray-700" />
                      {cartItemCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg"
                        >
                          {cartItemCount}
                        </motion.div>
                      )}
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-semibold text-gray-800">Cart</div>
                      <div className="text-xs text-gray-500">${cartTotal.toFixed(2)}</div>
                    </div>
                  </motion.div>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg p-0">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                    <SheetHeader>
                      <SheetTitle className="text-white text-xl font-bold">
                        Shopping Cart ({cartItemCount} items)
                      </SheetTitle>
                    </SheetHeader>
                  </div>
                  <div className="p-6 space-y-4">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                          <ShoppingCart className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 mb-6">Add some products to get started</p>
                        <Button
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                          onClick={() => setIsCartOpen(false)}
                        >
                          Continue Shopping
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {cartItems.map((item) => (
                            <motion.div
                              key={item.id}
                              layout
                              className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all bg-white"
                            >
                              <Image
                                decoding="sync"
                                loading="lazy"
                                src={item.image || "/placeholder.svg?height=60&width=60"}
                                alt={item.name}
                                width={60}
                                height={60}
                                className="rounded-lg flex-shrink-0 object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate text-gray-800">{item.name}</h4>
                                <p className="text-green-600 font-bold">${item.price}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  className="h-8 w-8 p-0 rounded-full"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="h-8 w-8 p-0 rounded-full"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                        <Separator />
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total: ${cartTotal.toFixed(2)}</span>
                          </div>
                          <Button
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl"
                            size="lg"
                          >
                            Proceed to Checkout
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border-2 border-gray-200 hover:bg-gray-50 rounded-xl bg-transparent"
                            onClick={() => setIsCartOpen(false)}
                          >
                            Continue Shopping
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Enhanced Mobile search bar */}
          <AnimatePresence>
            {isMobileSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden pb-4"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 py-3 w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-gray-50 focus:bg-white"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setIsMobileSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <section className="relative h-56 md:h-72 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDeal}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-r ${featuredDeals[currentDeal].gradient}`}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative container mx-auto px-4 h-full flex items-center">
              <div className="flex items-center justify-between w-full">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white max-w-lg"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">Limited Time Offer</span>
                  </motion.div>
                  <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                    {featuredDeals[currentDeal].title}
                  </h1>
                  <p className="text-lg md:text-xl mb-6 text-white/90">{featuredDeals[currentDeal].subtitle}</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-white text-gray-800 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      {featuredDeals[currentDeal].cta}
                      <Gift className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </motion.div>
                <div className="hidden lg:block">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" />
                    <Link href={""}>
                      <Image
                        loading="lazy"
                        decoding="sync"
                        src={featuredDeals[currentDeal].image || "/placeholder.svg?height=250&width=400"}
                        alt={featuredDeals[currentDeal].title}
                        width={400}
                        height={250}
                        className="relative rounded-2xl shadow-2xl"
                      />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Enhanced Deal indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {featuredDeals.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentDeal(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentDeal ? "bg-white shadow-lg" : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="bg-white py-4 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8 md:space-x-16">
            {[
              { icon: Truck, text: "Free Shipping", subtext: "On orders $50+", color: "text-green-600" },
              { icon: Shield, text: "Secure Payment", subtext: "100% Protected", color: "text-blue-600" },
              { icon: RotateCcw, text: "Easy Returns", subtext: "30-day policy", color: "text-orange-600" },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className={`p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-all`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-gray-800">{item.text}</div>
                  <div className="text-xs text-gray-500">{item.subtext}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
            <SheetHeader>
              <SheetTitle className="text-white text-xl font-bold">Filters & Categories</SheetTitle>
            </SheetHeader>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-4 text-gray-800">Categories</h3>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedCategory("all")
                    setIsMobileFiltersOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    selectedCategory === "all"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  All Products
                </motion.button>
                {categories.map((category) => {
                  return (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setSelectedCategory(category.id)
                        setIsMobileFiltersOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center space-x-3 cursor-pointer ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                          : "hover:bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <Suspense fallback={<ProductCardSkeleton />}>
                        <CategoriesIcon
                          color={category.color}
                          icon={category.icon}
                          name={category.name}
                          id={category.id}
                        />
                      </Suspense>
                    </motion.div>
                  )
                })}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-800">Price Range</h3>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="border-2 border-gray-200 rounded-xl">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-100">Under $100</SelectItem>
                  <SelectItem value="100-500">$100 - $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                  <SelectItem value="over-1000">Over $1,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Desktop Sidebar */}
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden lg:block lg:w-72 space-y-6"
          >
            {/* Categories */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                <h3 className="font-bold text-lg">Categories</h3>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      selectedCategory === "all"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "hover:bg-gray-50 border border-gray-100"
                    }`}
                  >
                    All Products
                  </motion.button>
                  {categories.map((category) => {
                    return (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center space-x-3 ${
                          selectedCategory === category.id
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : "hover:bg-gray-50 border border-gray-100"
                        }`}
                      >
                        <CategoriesIcon
                          icon={category.icon}
                          color={category.color}
                          id={category.id}
                          name={category.name}
                        />
                      </motion.button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Price Range */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 text-white">
                <h3 className="font-bold text-lg">Price Range</h3>
              </div>
              <CardContent className="p-4">
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="border-2 border-gray-200 rounded-xl">
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-100">Under $100</SelectItem>
                    <SelectItem value="100-500">$100 - $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                    <SelectItem value="over-1000">Over $1,000</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.aside>

          {/* Products Section */}
          <div className="flex-1">
            {/* Enhanced Filters and Sort */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0 bg-white p-4 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-300 rounded-xl bg-transparent"
                  onClick={() => setIsMobileFiltersOpen(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 text-sm font-medium">{products} products found</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-lg"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-lg"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48 border-2 border-gray-200 rounded-xl">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="discount">Biggest Discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            <motion.div
              layout
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
{isLoading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
    <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
)}


              {filteredProducts.map((e, index) => (
                <Filterproduct
                  key={e.id}
                  wishlist={wishlist}
                  isLoading={loadingProductId}
                  index={index}
                  product={e}
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center items-center space-x-2 mt-8 bg-white p-4 rounded-2xl shadow-lg border border-gray-100"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {getPageNumbers().map((page, index) => (
                  <div key={index}>
                    {page === "..." ? (
                      <span className="px-3 py-2 text-gray-500">...</span>
                    ) : (
                      <Link prefetch   href={`?page=${page}`}>
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                            onMouseEnter={() => router.prefetch(`?page=${page}`)}
onClick={()=>console.log(performance.now)}
                          className={`rounded-lg min-w-[40px] ${
                            currentPage === page
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                              : "hover:bg-blue-50 hover:border-blue-300"
                          }`}
                        >
                          {page}
                        </Button></Link>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {products === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Search className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No products found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  We couldn&apos;t find any products matching your criteria. Try adjusting your search or filter
                  settings.
                </p>
                <Button
                  onClick={clearAllFilters}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-xl"
                >
                  Clear All Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                title: "Customer Service",
                links: ["Contact Us", "FAQ", "Shipping Info", "Returns"],
              },
              {
                title: "About ShopHub",
                links: ["Our Story", "Careers", "Press", "Sustainability"],
              },
              {
                title: "Connect",
                links: ["Newsletter", "Social Media", "Blog", "Community"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Button
                        variant="ghost"
                        className="text-gray-300 hover:text-white hover:bg-white/10 p-0 h-auto text-sm transition-all"
                      >
                        {link}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ShopHub
              </span>
            </div>
            <p className="text-gray-400">
              &copy; 2024 ShopHub. All rights reserved. Made with ❤️ for amazing shopping experiences.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

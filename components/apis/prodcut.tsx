import { Product } from "@/lib/types/product"
import { fetchWithAuth } from "./api_token";


export async function getProducts(): Promise<Product[]> {
  return fetchWithAuth("/products",{
    method:"GET"

  });
}

// export async function getProductById(id: number): Promise<Product | undefined> {
//   // Simulate API call delay
//   await new Promise((resolve) => setTimeout(resolve, 100))
//   return products.find((product) => product.id === id)
// }

// export async function getProductsByCategory(category: string): Promise<Product[]> {
//   // Simulate API call delay
//   await new Promise((resolve) => setTimeout(resolve, 150))
//   if (category === "all") return products
//   return products.filter((product) => product.category === category)

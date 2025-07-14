
import api from "./axios"


export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export async function getCategories(): Promise<Category[]> {
//   // Simulate API call delay
// await sleep(9000);
const response = await api.get<Category[]>("/categories");
  return  response.data;
}





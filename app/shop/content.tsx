import { getCategories } from "@/components/apis/catgoiry";
import EnhancedEcommercePage from "@/components/Contents/client/shop_content";
export  async function Shopdata() {
const products= 100000

const catgroiesicon= await getCategories();
  return (

<EnhancedEcommercePage categories={catgroiesicon} products={products}/>
  );
}
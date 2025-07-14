import { Product } from "@/lib/types/product";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export async function getProduct(page:number,limit:number): Promise<Product[]> {
  const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/graphql/product`,
  cache: new InMemoryCache()
});

const { data } = await client.query({
  query: gql`
    query  {
      products(page:${page},limit:${limit}) {
        id
        name
        price
        originalPrice
        rating
        reviews
        image
        category
        badge
        discount
        inStock

       
      }
    }
  `} );

  return data.products;
}

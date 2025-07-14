import FullPageSkeleton from "@/components/animation/Loading_shop_page";
import { Suspense } from "react";
import { Shopdata } from "./content";


export default  function EcommercePage() {
  return (
    <Suspense  fallback={<FullPageSkeleton />}>
<Shopdata />
	</Suspense>
  );
}
import { Category } from "@/components/apis/catgoiry";
import { Smartphone, Laptop, Headphones, Camera, Watch, Gamepad2, Shirt, ShoppingBag, Gem, Home, Sofa, Utensils, Book, Dumbbell, Car, Baby, Palette, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
  

export  function CategoriesIcon({id,icon,name}:  Category) {
const icons=[Smartphone,
  Laptop,
  Headphones,
  Camera,
  Watch,
  Gamepad2,
  Shirt,
  ShoppingBag,
  Gem,
  Home,
  Sofa,
  Utensils,
  Book,
  Dumbbell,
  Car,
  Baby,
  Palette,]

                   const New:ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>=icons.map(e=>e.displayName==icon?e:false)!.find((e)=>e!=false)?? Smartphone;
     return (<>

                    <div key={id}>
<New className="h-5 w-5" />
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                  </>
      )
}
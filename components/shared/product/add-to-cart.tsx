'use client'

import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { addItemToCart, removeItemFormCart } from "@/lib/actions/cart.action";
import { useTransition } from "react";

interface AddToCartProps {
  item: CartItem
  cart?: Cart 
}

const AddToCart: React.FC<AddToCartProps> = ({item, cart}) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const {toast} = useToast()

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item)
      if(!res.success){
        toast({
          variant: 'destructive',
          description: res.message
        })
        return
      }
      toast({
        description: `${res.message}`,
        action: (
          <ToastAction className="bg-primary text-white hover:bg-gray-800" altText="Go To Cart" onClick={()=>router.push('/cart')}>
            Go To Cart
          </ToastAction>
        )
      })
    })
  }

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFormCart(item.productId)
      toast({
       variant: res?.success ? 'default' : 'destructive',
       description: res?.message
      })
 
      return
    })
  }

  const existItem = cart && cart.items.find((x) => x.productId === item.productId)

  if(existItem){
    return (
      <>
        <Button variant='ghost' disabled={isPending} className="rounded-full" type="button" onClick={handleRemoveFromCart}>
          {isPending ? (
            <Loader className="h-4 w-4 animate-spin"/>
          ) : (
            <Minus className="h-4 w-4" />
          )}
        </Button>
        <span className="px-2">{existItem.qty}</span>
        <Button variant='ghost' disabled={isPending} className="rounded-full" type="button" onClick={handleAddToCart}>
          {isPending ? (
            <Loader className="h-4 w-4 animate-spin"/>
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </>
    );
  } else {
    return (
      <Button className="w-full" type="button" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin"/>
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Add To Cart
      </Button>
    );
  }
}
 
export default AddToCart;
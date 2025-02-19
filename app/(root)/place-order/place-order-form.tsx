'use client'

import { createOrder } from "@/lib/actions/order.action";
import { useFormStatus } from "react-dom";
import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const PlaceOrderForm = () => {
  const router = useRouter()

  const PlaceOrderButton = () => {
    const {pending} = useFormStatus()
    return (
      <Button disabled={pending} className="w-full">
        {pending ? (
          <Loader className="w-4 h-4 animate-spin"/>
        ) : (
          <Check className="h-4 w-4"/>
        )}
        {" "}
        Place Order
      </Button>
    )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const res = await createOrder()
    if(res.redirectTo){
      router.push(res.redirectTo)
    }
  }

  return (
    <form action="" className="w-full" onSubmit={handleSubmit}>
      <PlaceOrderButton/>
    </form>
  );
}
 
export default PlaceOrderForm;
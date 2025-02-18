import { cn } from "@/lib/utils";
import React from "react";

interface CheckoutStepsProps{
  current: number
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({current = 0}) => {
  const steps = ['User Login', 'Shipping Address', 'Payment Method', 'Place Order']

  return (
    <div className="flex-between flex-col space-x-2 space-y-2 mb-10 md:flex-row">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div className={cn('p-2 w-56 rounded-full text-center text-sm', 
            idx === current && 'bg-secondary'
          )}>
            {step}
          </div>
          {step !== 'Place Order' && (
            <hr className="w-16 border-t border-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
 
export default CheckoutSteps;
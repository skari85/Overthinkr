"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const PaymentSuccessClient = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-600">Payment Successful - $5.99</CardTitle>
        <CardDescription>You're all set!</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          Thank you for your $5.99 one-time payment! You now have lifetime access to all premium features.
        </p>
      </CardContent>
    </Card>
  )
}

export default PaymentSuccessClient

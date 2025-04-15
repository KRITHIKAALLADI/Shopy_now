"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useStore from "@/store";
import Container from "@/components/Container";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetCart = useStore((state) => state.resetCart);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      resetCart(); // Clear the cart after successful payment
    }
  }, [sessionId, resetCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Thank you for your order!
      </h1>
      <p className="text-gray-600 mb-8">
        Your payment was successful and your order is confirmed.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => router.push("/")}>Continue Shopping</Button>
        <Button
          variant="outline"
          onClick={() => router.push("/orders")}
        >
          View Orders
        </Button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Container>
      <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </Container>
  );
}
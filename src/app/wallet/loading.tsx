import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function WalletLoading() {
  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-16">
      <div className="container py-8 max-w-4xl">
        {/* Header skeleton */}
        <Skeleton className="h-10 w-48 mb-8" />

        {/* Balance card skeleton */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-12 w-48 mb-6" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Tabs skeleton */}
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Transactions skeleton */}
        <Card>
          <CardContent className="p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b last:border-0">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

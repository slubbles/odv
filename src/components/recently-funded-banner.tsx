import { Badge } from "@/components/ui/badge"
import { PartyPopper } from "lucide-react"

interface RecentlyFundedBannerProps {
  projectName: string
  fundedAmount: number
}

export function RecentlyFundedBanner({ projectName, fundedAmount }: RecentlyFundedBannerProps) {
  return (
    <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
          <PartyPopper className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1">
          <Badge className="mb-2 bg-accent text-accent-foreground border-0">Just Funded</Badge>
          <h4 className="font-semibold mb-1">{projectName}</h4>
          <p className="text-sm text-muted-foreground">Raised ${fundedAmount.toLocaleString()} from the community</p>
        </div>
      </div>
    </div>
  )
}

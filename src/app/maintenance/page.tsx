import { Wrench } from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
          <Wrench className="h-10 w-10 text-accent" />
        </div>
        <h1 className="font-sans text-4xl font-semibold mb-4 text-balance">Under Maintenance</h1>
        <p className="text-muted-foreground mb-8">
          We're currently performing scheduled maintenance to improve your experience. We'll be back online shortly.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span>Expected downtime: 30 minutes</span>
        </div>
      </div>
    </div>
  )
}

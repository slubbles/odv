import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { Shield, CheckCircle2, XCircle, Clock } from "lucide-react"

async function getAdminLogs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/logs?limit=50`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.logs || []
  } catch (error) {
    return []
  }
}

export default async function AdminActivityPage() {
  const logs = await getAdminLogs()

  const getActionIcon = (action: string) => {
    if (action.includes("approve")) return <CheckCircle2 className="h-4 w-4 text-green-500" />
    if (action.includes("reject")) return <XCircle className="h-4 w-4 text-red-500" />
    return <Clock className="h-4 w-4 text-accent" />
  }

  const getActionBadge = (action: string) => {
    if (action.includes("approve")) {
      return (
        <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
          {action === "bulk_approve" ? "Bulk Approve" : "Approve"}
        </Badge>
      )
    }
    if (action.includes("reject")) {
      return (
        <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
          {action === "bulk_reject" ? "Bulk Reject" : "Reject"}
        </Badge>
      )
    }
    return <Badge variant="secondary">{action}</Badge>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto py-12 flex-1">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-accent" />
            <Badge className="bg-accent/20 text-accent-foreground border-accent/30">Admin Panel</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Activity Log</h1>
          <p className="text-xl text-muted-foreground">All admin actions and decisions</p>
        </div>

        {logs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No activity logs yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {logs.map((log: any) => (
              <Card key={log.id} className="hover:border-accent/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getActionIcon(log.action)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getActionBadge(log.action)}
                        <span className="text-sm font-semibold">
                          {log.profiles?.full_name || log.profiles?.username || "Admin"}
                        </span>
                      </div>
                      <p className="text-sm mb-1">
                        {log.action.includes("approve") && "Approved project: "}
                        {log.action.includes("reject") && "Rejected project: "}
                        <span className="font-semibold">{log.projects?.title || "Unknown project"}</span>
                      </p>
                      {log.details && (
                        <p className="text-sm text-muted-foreground">Reason: {log.details}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Send, MoreVertical } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CreatorMessagesPage() {
  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thanks for the update!",
      time: "10m ago",
      unread: 2,
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "When is the next milestone?",
      time: "1h ago",
      unread: 0,
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Great work on the project!",
      time: "3h ago",
      unread: 1,
    },
    {
      id: 4,
      name: "Alex Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Can I get a refund?",
      time: "1d ago",
      unread: 0,
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      text: "Hi! I backed your AI Recipe App project and I love it!",
      time: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      text: "Thank you so much for your support! Glad you are enjoying it.",
      time: "10:32 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      text: "Will there be more features coming soon?",
      time: "10:35 AM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "You",
      text: "Yes! Check out our roadmap in the milestones section. Next update coming in 2 weeks.",
      time: "10:38 AM",
      isOwn: true,
    },
    { id: 5, sender: "Sarah Johnson", text: "Thanks for the update!", time: "10:40 AM", isOwn: false },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="font-sans text-4xl font-semibold mb-8 text-balance">Your Backers</h1>

        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <Card className="md:col-span-1 p-4 overflow-hidden flex flex-col">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors border border-transparent hover:border-accent/50"
                >
                  <div className="flex items-start gap-3">
                    <img src={conv.avatar || "/placeholder.svg"} alt={conv.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold truncate">{conv.name}</p>
                        {conv.unread > 0 && <Badge className="bg-accent text-white">{conv.unread}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{conv.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="md:col-span-2 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/placeholder.svg?height=40&width=40" alt="Sarah Johnson" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] ${msg.isOwn ? "bg-accent text-white" : "bg-muted"} p-3 rounded-lg`}>
                    <p className="text-sm mb-1">{msg.text}</p>
                    <p className="text-xs opacity-70">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input placeholder="Type your message..." className="flex-1" />
                <Button className="bg-accent hover:bg-accent/90">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}

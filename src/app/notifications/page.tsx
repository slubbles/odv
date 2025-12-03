"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, TrendingUp, Vote, CheckCircle, Loader2, AlertCircle, Bell } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Notification {
  id: string
  type: 'milestone' | 'comment' | 'update'
  title: string
  description: string
  project_id: string | null
  action_url: string | null
  action_label: string | null
  read: boolean
  created_at: string
  projects?: {
    id: string
    title: string
    image_url: string | null
  } | null
}

const getIcon = (type: string) => {
  switch (type) {
    case 'milestone':
      return Vote
    case 'comment':
      return MessageCircle
    case 'update':
      return TrendingUp
    default:
      return Bell
  }
}

const getIconStyle = (type: string) => {
  switch (type) {
    case 'milestone':
      return { bg: 'bg-accent/20', text: 'text-accent' }
    case 'comment':
      return { bg: 'bg-chart-2/20', text: 'text-[oklch(0.6_0.15_190)]' }
    case 'update':
      return { bg: 'bg-chart-3/20', text: 'text-[oklch(0.65_0.18_150)]' }
    default:
      return { bg: 'bg-muted', text: 'text-muted-foreground' }
  }
}

const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

export default function NotificationsPage() {
  const { publicKey, connected } = useWallet()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (!connected || !publicKey) {
      setLoading(false)
      return
    }

    const fetchNotifications = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          wallet: publicKey.toString()
        })
        
        const response = await fetch(`/api/notifications?${params}`)
        
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
          setUnreadCount(data.unreadCount || 0)
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [connected, publicKey])

  const handleMarkAllRead = async () => {
    if (!connected || !publicKey) return
    
    setMarking(true)
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: publicKey.toString(),
          mark_all_read: true
        })
      })

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
        toast.success('All notifications marked as read')
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
      toast.error('Failed to mark as read')
    } finally {
      setMarking(false)
    }
  }

  const handleMarkOneRead = async (notificationId: string) => {
    if (!connected || !publicKey) return
    
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: publicKey.toString(),
          notification_ids: [notificationId]
        })
      })

      if (response.ok) {
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true
    if (activeTab === 'milestones') return n.type === 'milestone'
    if (activeTab === 'comments') return n.type === 'comment'
    if (activeTab === 'updates') return n.type === 'update'
    return true
  })

  if (!connected) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-12 max-w-4xl">
          <Card className="border-yellow-500/30 bg-yellow-500/10">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
              <p className="text-muted-foreground">
                Please connect your wallet to view your notifications.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container py-12 max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">What's Happening</h1>
            {unreadCount > 0 && <Badge className="bg-accent text-accent-foreground">{unreadCount} new</Badge>}
          </div>
          <p className="text-lg text-muted-foreground">Projects you backed. People who need you.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Back some projects to start receiving updates!
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <NotificationCard 
                  key={notification.id} 
                  notification={notification}
                  onRead={() => handleMarkOneRead(notification.id)}
                />
              ))
            )}
          </TabsContent>
        </Tabs>

        {notifications.length > 0 && unreadCount > 0 && (
          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              onClick={handleMarkAllRead}
              disabled={marking}
            >
              {marking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Marking...
                </>
              ) : (
                'Mark All as Read'
              )}
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

function NotificationCard({ 
  notification, 
  onRead 
}: { 
  notification: Notification
  onRead: () => void
}) {
  const Icon = getIcon(notification.type)
  const iconStyle = getIconStyle(notification.type)

  const handleActionClick = () => {
    if (!notification.read) {
      onRead()
    }
  }

  return (
    <Card
      className={`overflow-hidden transition-all hover:border-accent/50 ${
        !notification.read ? "border-accent/30 bg-accent/5" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconStyle.bg}`}
          >
            <Icon className={`h-6 w-6 ${iconStyle.text}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{notification.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{notification.description}</p>
              </div>
              {!notification.read && <div className="h-2 w-2 rounded-full bg-accent flex-shrink-0 mt-2" />}
            </div>

            <div className="flex items-center justify-between gap-4 mt-4">
              <span className="text-xs text-muted-foreground">{formatTimestamp(notification.created_at)}</span>
              {notification.action_url && (
                <Button size="sm" variant="outline" asChild onClick={handleActionClick}>
                  <Link href={notification.action_url}>
                    {notification.action_label || 'View'}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

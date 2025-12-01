"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Users, Award, Star, Trophy, Target, Loader2, AlertCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface UserProfile {
  wallet_address: string
  name: string | null
  username: string | null
  bio: string | null
  email: string | null
  avatar_url: string | null
  twitter_url: string | null
  website_url: string | null
  linkedin_url: string | null
  notification_email: boolean
  notification_milestone: boolean
  notification_updates: boolean
  notification_marketing: boolean
  privacy_public_profile: boolean
  privacy_show_backed: boolean
  privacy_show_nfts: boolean
  user_type: string
  created_at: string
}

const achievements = [
  { id: 1, name: "Early Adopter", icon: Star, earned: true },
  { id: 2, name: "Top Backer", icon: Trophy, earned: true },
  { id: 3, name: "Community Leader", icon: Users, earned: false },
  { id: 4, name: "Project Champion", icon: Target, earned: true },
  { id: 5, name: "NFT Collector", icon: Award, earned: true },
  { id: 6, name: "Milestone Voter", icon: Target, earned: false },
]

export default function ProfilePage() {
  const { publicKey, connected } = useWallet()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    email: "",
    avatar_url: "",
    twitter_url: "",
    website_url: "",
    linkedin_url: "",
    notification_email: true,
    notification_milestone: true,
    notification_updates: true,
    notification_marketing: false,
    privacy_public_profile: true,
    privacy_show_backed: true,
    privacy_show_nfts: true,
  })

  // Fetch profile on wallet connect
  useEffect(() => {
    if (!connected || !publicKey) {
      setLoading(false)
      setProfile(null)
      return
    }

    const fetchProfile = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/users/${publicKey.toString()}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setProfile(data.user)
            setFormData({
              name: data.user.name || "",
              username: data.user.username || "",
              bio: data.user.bio || "",
              email: data.user.email || "",
              avatar_url: data.user.avatar_url || "",
              twitter_url: data.user.twitter_url || "",
              website_url: data.user.website_url || "",
              linkedin_url: data.user.linkedin_url || "",
              notification_email: data.user.notification_email ?? true,
              notification_milestone: data.user.notification_milestone ?? true,
              notification_updates: data.user.notification_updates ?? true,
              notification_marketing: data.user.notification_marketing ?? false,
              privacy_public_profile: data.user.privacy_public_profile ?? true,
              privacy_show_backed: data.user.privacy_show_backed ?? true,
              privacy_show_nfts: data.user.privacy_show_nfts ?? true,
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [connected, publicKey])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet")
      return
    }

    setSaving(true)
    try {
      const method = profile ? 'PATCH' : 'POST'
      const response = await fetch(`/api/users/${publicKey.toString()}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile')
      }

      setProfile(data.user)
      toast.success("Profile saved successfully!")
    } catch (error: any) {
      console.error('Failed to save profile:', error)
      toast.error(error.message || "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        email: profile.email || "",
        avatar_url: profile.avatar_url || "",
        twitter_url: profile.twitter_url || "",
        website_url: profile.website_url || "",
        linkedin_url: profile.linkedin_url || "",
        notification_email: profile.notification_email ?? true,
        notification_milestone: profile.notification_milestone ?? true,
        notification_updates: profile.notification_updates ?? true,
        notification_marketing: profile.notification_marketing ?? false,
        privacy_public_profile: profile.privacy_public_profile ?? true,
        privacy_show_backed: profile.privacy_show_backed ?? true,
        privacy_show_nfts: profile.privacy_show_nfts ?? true,
      })
    }
  }

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
          <Card className="border-yellow-500/30 bg-yellow-500/10">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
              <p className="text-muted-foreground">
                Please connect your wallet to view and edit your profile.
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Profile</h1>
          <p className="text-lg text-muted-foreground">This is you. Own it.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-24 w-24 ring-2 ring-accent/20">
                    <AvatarImage src={formData.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{formData.name?.[0] || publicKey?.toString().slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="text-xl font-bold mb-1">{formData.name || "Anonymous"}</h3>
                <p className="text-sm text-muted-foreground mb-4">@{formData.username || publicKey?.toString().slice(0, 8)}</p>
                <Badge variant="secondary" className="mb-4">
                  <Award className="h-3 w-3 mr-1" />
                  {profile?.user_type === 'creator' ? 'Creator' : 'Backer'}
                </Badge>
              </CardContent>
            </Card>

            {/* Wallet Info */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Wallet</span>
                  <span className="font-mono text-xs">{publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-6)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="font-bold">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'New'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-3 gap-3">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon
                    return (
                      <div
                        key={achievement.id}
                        className={`aspect-square rounded-lg flex items-center justify-center ${
                          achievement.earned ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground opacity-50"
                        }`}
                        title={achievement.name}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input 
                    id="display-name" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell others about yourself..."
                  />
                  <p className="text-xs text-muted-foreground">Tell others about yourself in 250 characters or less</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar_url">Avatar URL</Label>
                  <Input 
                    id="avatar_url" 
                    value={formData.avatar_url}
                    onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-4">
                  <Label>Social Links</Label>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="text-sm font-normal">
                        Twitter
                      </Label>
                      <Input 
                        id="twitter" 
                        placeholder="https://twitter.com/username"
                        value={formData.twitter_url}
                        onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-normal">
                        Website
                      </Label>
                      <Input 
                        id="website" 
                        placeholder="https://yourwebsite.com"
                        value={formData.website_url}
                        onChange={(e) => handleInputChange('website_url', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="text-sm font-normal">
                        LinkedIn
                      </Label>
                      <Input 
                        id="linkedin" 
                        placeholder="https://linkedin.com/in/username"
                        value={formData.linkedin_url}
                        onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about your backed projects</p>
                  </div>
                  <Switch 
                    checked={formData.notification_email}
                    onCheckedChange={(checked) => handleInputChange('notification_email', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Milestone Voting</Label>
                    <p className="text-sm text-muted-foreground">Get notified when milestones need your vote</p>
                  </div>
                  <Switch 
                    checked={formData.notification_milestone}
                    onCheckedChange={(checked) => handleInputChange('notification_milestone', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Project Updates</Label>
                    <p className="text-sm text-muted-foreground">News and updates from creators you follow</p>
                  </div>
                  <Switch 
                    checked={formData.notification_updates}
                    onCheckedChange={(checked) => handleInputChange('notification_updates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Featured projects and platform updates</p>
                  </div>
                  <Switch 
                    checked={formData.notification_marketing}
                    onCheckedChange={(checked) => handleInputChange('notification_marketing', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                  </div>
                  <Switch 
                    checked={formData.privacy_public_profile}
                    onCheckedChange={(checked) => handleInputChange('privacy_public_profile', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Backed Projects</Label>
                    <p className="text-sm text-muted-foreground">Display projects you've backed on your profile</p>
                  </div>
                  <Switch 
                    checked={formData.privacy_show_backed}
                    onCheckedChange={(checked) => handleInputChange('privacy_show_backed', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show NFT Collection</Label>
                    <p className="text-sm text-muted-foreground">Make your NFT badges visible to others</p>
                  </div>
                  <Switch 
                    checked={formData.privacy_show_nfts}
                    onCheckedChange={(checked) => handleInputChange('privacy_show_nfts', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

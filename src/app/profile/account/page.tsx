"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface UserProfile {
  notification_email: boolean
  notification_milestone: boolean
  notification_updates: boolean
  notification_marketing: boolean
  privacy_public_profile: boolean
  privacy_show_backed: boolean
  privacy_show_nfts: boolean
}

export default function AccountSettingsPage() {
  const { publicKey, connected } = useWallet()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
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
        throw new Error(data.error || 'Failed to save settings')
      }

      setProfile(data.user)
      toast.success("Settings saved successfully!")
    } catch (error: any) {
      console.error('Failed to save settings:', error)
      toast.error(error.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
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
      <div className="flex-1 py-6">
        <Card className="border-yellow-500/30 bg-yellow-500/10">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
            <p className="text-muted-foreground">
              Please connect your wallet to manage your account settings.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 py-12 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your notification preferences and privacy settings.
        </p>
      </div>

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
  )
}

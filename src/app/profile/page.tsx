import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Users, Award, Star, Trophy, Target } from "lucide-react"
import { Switch } from "@/components/ui/switch"

const achievements = [
  { id: 1, name: "Early Adopter", icon: Star, earned: true },
  { id: 2, name: "Top Backer", icon: Trophy, earned: true },
  { id: 3, name: "Community Leader", icon: Users, earned: false },
  { id: 4, name: "Project Champion", icon: Target, earned: true },
  { id: 5, name: "NFT Collector", icon: Award, earned: true },
  { id: 6, name: "Milestone Voter", icon: Target, earned: false },
]

export default function ProfilePage() {
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
                    <AvatarImage src="/placeholder.svg?key=profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="text-xl font-bold mb-1">John Doe</h3>
                <p className="text-sm text-muted-foreground mb-4">@johndoe</p>
                <Badge variant="secondary" className="mb-4">
                  <Award className="h-3 w-3 mr-1" />
                  Pro Member
                </Badge>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Followers</span>
                  <span className="font-bold">342</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Following</span>
                  <span className="font-bold">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="font-bold">Jan 2024</span>
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
                  <Input id="display-name" defaultValue="John Doe" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="johndoe" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    defaultValue="Passionate about innovative tech and sustainable solutions. Early supporter of groundbreaking projects."
                  />
                  <p className="text-xs text-muted-foreground">Tell others about yourself in 250 characters or less</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2">
                    <Input id="email" type="email" defaultValue="john@example.com" />
                    <Badge variant="secondary" className="shrink-0">
                      Verified
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Social Links</Label>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="text-sm font-normal">
                        Twitter
                      </Label>
                      <Input id="twitter" placeholder="https://twitter.com/username" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-normal">
                        Website
                      </Label>
                      <Input id="website" placeholder="https://yourwebsite.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="text-sm font-normal">
                        LinkedIn
                      </Label>
                      <Input id="linkedin" placeholder="https://linkedin.com/in/username" />
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
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Milestone Voting</Label>
                    <p className="text-sm text-muted-foreground">Get notified when milestones need your vote</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Project Updates</Label>
                    <p className="text-sm text-muted-foreground">News and updates from creators you follow</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Featured projects and platform updates</p>
                  </div>
                  <Switch />
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
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Backed Projects</Label>
                    <p className="text-sm text-muted-foreground">Display projects you've backed on your profile</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show NFT Collection</Label>
                    <p className="text-sm text-muted-foreground">Make your NFT badges visible to others</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

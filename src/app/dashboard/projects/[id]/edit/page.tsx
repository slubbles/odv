"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Upload, Plus, Trash2 } from "lucide-react"

export default function EditProjectPage() {
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      title: "Initial Development",
      description: "Core features implementation",
      funding: 3000,
      completed: false,
    },
    { id: 2, title: "Beta Testing", description: "User testing and feedback", funding: 2000, completed: false },
    { id: 3, title: "Launch", description: "Public release", funding: 5000, completed: false },
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container py-12 max-w-5xl flex-1">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <Badge className="mb-4 bg-accent/20 text-accent-foreground border-accent/30">Edit Mode</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Fix Your Stuff</h1>
            <p className="text-xl text-muted-foreground">Made a mistake? Change it here.</p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input id="title" defaultValue="AI-Powered Recipe Discovery Platform" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input id="tagline" defaultValue="Transform how people discover and cook meals" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" rows={6} defaultValue="A comprehensive platform that uses AI..." />
                </div>

                <div className="space-y-2">
                  <Label>Project Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload new image</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="goal">Funding Goal</Label>
                    <Input id="goal" type="number" defaultValue="10000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Days Remaining</Label>
                    <Input id="duration" type="number" defaultValue="12" disabled />
                    <p className="text-xs text-muted-foreground">Campaign duration cannot be changed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones">
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Project Milestones</CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <Card key={milestone.id} className="bg-muted/50">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary">Milestone {index + 1}</Badge>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input defaultValue={milestone.title} />
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea defaultValue={milestone.description} rows={3} />
                          </div>

                          <div className="space-y-2">
                            <Label>Funding Amount</Label>
                            <Input type="number" defaultValue={milestone.funding} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-accent/10 border-accent/30">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">About Milestones</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Each milestone must be approved by backers before funds are released</li>
                    <li>• Set clear, achievable goals for each milestone</li>
                    <li>• Total milestone funding should equal your project goal</li>
                    <li>• Milestones cannot be deleted once voting has started</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="updates">
            <Card>
              <CardHeader>
                <CardTitle>Post an Update</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="update-title">Update Title</Label>
                  <Input id="update-title" placeholder="Share progress with your backers..." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="update-content">Content</Label>
                  <Textarea id="update-content" rows={8} placeholder="What's new with your project?" />
                </div>

                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Publish Update</Button>

                <div className="pt-6 border-t">
                  <h3 className="font-semibold mb-4">Previous Updates</h3>
                  <div className="space-y-4">
                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">Development Progress - Week 1</h4>
                          <span className="text-xs text-muted-foreground">3 days ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Great progress this week! We've completed the user authentication system...
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}

"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Project } from "@/lib/types/project"
import { TrendingUp, Users, Eye, Target, Calendar } from "lucide-react"

interface AnalyticsModalProps {
    isOpen: boolean
    onClose: () => void
    project: Project
}

export function AnalyticsModal({ isOpen, onClose, project }: AnalyticsModalProps) {
    // Calculate analytics
    const fundingProgress = (project.raised / project.goal) * 100
    const daysActive = project.created_at
        ? Math.floor((Date.now() - new Date(project.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0

    // Mock data for now - these would come from analytics tracking
    const analytics = {
        views: 1245,
        clicks: 342,
        conversionRate: (project.backers_count / 1245) * 100,
        avgContribution: project.raised / (project.backers_count || 1),
        dailyBackers: Math.floor(project.backers_count / Math.max(daysActive, 1)),
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{project.title} - Analytics</DialogTitle>
                    <DialogDescription>
                        Project performance metrics and insights
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                    Page Views
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics.views.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground mt-1">Total impressions</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    Backers
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{project.backers_count}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {analytics.dailyBackers.toFixed(1)}/day
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                    Conversion
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
                                <p className="text-xs text-muted-foreground mt-1">View to backer</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{fundingProgress.toFixed(0)}%</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    ${project.raised} / ${project.goal}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    Days Active
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{daysActive}</div>
                                <p className="text-xs text-muted-foreground mt-1">Since submission</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Avg. Contribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${analytics.avgContribution.toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground mt-1">Per backer</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Insights Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Insights</CardTitle>
                            <CardDescription>Key takeaways from your campaign</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                                <p className="text-sm">
                                    Your conversion rate of {analytics.conversionRate.toFixed(1)}% is{" "}
                                    {analytics.conversionRate > 5 ? "above" : "below"} average for the platform
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                                <p className="text-sm">
                                    You&apos;re gaining an average of {analytics.dailyBackers.toFixed(1)} backers per day
                                </p>
                            </div>
                            {fundingProgress >= 80 && (
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                                    <p className="text-sm">
                                        You&apos;re close to your goal! Share on social media to reach the finish line
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}

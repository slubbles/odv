import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

export default function CreatorDashboardPage() {
    const myProjects = [
        {
            id: "1",
            title: "Solar Powered Backpack",
            status: "Active",
            raised: 12500,
            goal: 20000,
            backers: 450,
            daysLeft: 12
        },
        {
            id: "2",
            title: "Minimalist Water Bottle",
            status: "Draft",
            raised: 0,
            goal: 5000,
            backers: 0,
            daysLeft: 30
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
                    <p className="text-muted-foreground">Manage your campaigns and updates.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Project
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>A list of your projects and their current status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Raised</TableHead>
                                <TableHead>Backers</TableHead>
                                <TableHead className="text-right">Days Left</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myProjects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell className="font-medium">{project.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={project.status === "Active" ? "default" : "secondary"}>
                                            {project.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${project.raised.toLocaleString()} / ${project.goal.toLocaleString()}</TableCell>
                                    <TableCell>{project.backers}</TableCell>
                                    <TableCell className="text-right">{project.daysLeft}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

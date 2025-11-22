import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

// Mock data for queue
const queueProjects = [
    {
        id: 1,
        title: "PixelVault",
        tagline: "Decentralized cloud storage for photographers.",
        category: "Web3",
        creator: "Alex M.",
        position: 1,
        estimatedDate: "Tomorrow",
    },
    {
        id: 2,
        title: "FitQuest",
        tagline: "Gamified fitness tracker RPG.",
        category: "Mobile",
        creator: "Studio 42",
        position: 2,
        estimatedDate: "Nov 25",
    },
    {
        id: 3,
        title: "GreenPlate",
        tagline: "Sustainable meal planning AI.",
        category: "SaaS",
        creator: "EcoLabs",
        position: 3,
        estimatedDate: "Nov 26",
    },
    {
        id: 4,
        title: "CodeWhisper",
        tagline: "VS Code extension for voice coding.",
        category: "DevTools",
        creator: "Sarah J.",
        position: 4,
        estimatedDate: "Nov 27",
    },
];

export function QueueList() {
    return (
        <div className="grid gap-4">
            {queueProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0 flex items-center">
                        <div className="bg-muted w-16 h-full min-h-[80px] flex items-center justify-center text-xl font-bold text-muted-foreground border-r">
                            #{project.position}
                        </div>
                        <div className="p-4 flex-1 flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg">{project.title}</h3>
                                    <Badge variant="secondary" className="text-xs">
                                        {project.category}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{project.tagline}</p>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{project.estimatedDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Est. Wait: {project.position} days</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

import { ProjectCard } from "@/components/dashboard/project-card"
import { StatsOverview } from "@/components/dashboard/stats-overview"

export default function DashboardPage() {
    // Mock data
    const stats = {
        totalBacked: 12,
        totalInvested: 150,
        portfolioValue: 185
    }

    const projects = [
        {
            title: "Eco-Friendly Smart Home Hub",
            description: "A central hub for all your smart devices, focused on energy efficiency and sustainability.",
            status: "In Progress" as const,
            raised: 15000,
            goal: 50000,
            backedAmount: 25,
            imageUrl: "https://images.unsplash.com/photo-1558002038-1091a166111c?w=800&auto=format&fit=crop&q=60",
            creatorName: "Sarah Green",
        },
        {
            title: "Urban Vertical Garden Kit",
            description: "Grow your own vegetables in small apartments with our modular vertical garden system.",
            status: "Funding" as const,
            raised: 8500,
            goal: 10000,
            backedAmount: 10,
            imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&auto=format&fit=crop&q=60",
            creatorName: "Urban Roots",
        },
        {
            title: "NextGen Gaming Mouse",
            description: "Ultra-lightweight, high-precision gaming mouse with customizable haptic feedback.",
            status: "Launched" as const,
            raised: 120000,
            goal: 100000,
            backedAmount: 50,
            imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=60",
            creatorName: "TechGear Pro",
        }
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Portfolio</h1>
                <p className="text-muted-foreground">Track your investments and backed projects.</p>
            </div>

            <StatsOverview {...stats} />

            <div>
                <h2 className="text-xl font-semibold mb-4">Backed Projects</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, i) => (
                        <ProjectCard key={i} {...project} />
                    ))}
                </div>
            </div>
        </div>
    )
}

import { Header } from "@/components/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { ProjectCard } from "@/components/project-card"

export default function SearchResultsPage() {
  const results = [
    {
      id: 1,
      title: "AI Recipe App",
      category: "Technology",
      image: "/ai-recipe-app-interface.jpg",
      creator: "Sarah Johnson",
      creatorAvatar: "/the-creator.png",
      raised: 12450,
      goal: 15000,
      backers: 567,
      daysLeft: 15,
    },
    {
      id: 2,
      title: "Pixel Art Game",
      category: "Gaming",
      image: "/pixel-art-game.jpg",
      creator: "Mike Chen",
      creatorAvatar: "/creator2.png",
      raised: 8920,
      goal: 10000,
      backers: 423,
      daysLeft: 22,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search projects..." className="pl-12 h-14 text-lg" defaultValue="AI" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Found 24 projects matching "AI"</p>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <Badge className="cursor-pointer bg-accent text-white border-accent">All Results</Badge>
          <Badge className="cursor-pointer bg-muted text-foreground border-border hover:border-accent/50">
            Technology
          </Badge>
          <Badge className="cursor-pointer bg-muted text-foreground border-border hover:border-accent/50">Active</Badge>
          <Badge className="cursor-pointer bg-muted text-foreground border-border hover:border-accent/50">
            Featured
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((project) => (
            <ProjectCard 
              key={project.id} 
              id={project.id.toString()}
              title={project.title}
              description=""
              creator={{ name: project.creator, avatar: project.creatorAvatar }}
              category={project.category}
              image={project.image}
              raised={project.raised}
              goal={project.goal}
              backers={project.backers}
              daysLeft={project.daysLeft}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

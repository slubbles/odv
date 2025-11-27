import { Header } from "@/components/header"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ProjectComparisonModal } from "@/components/project-comparison-modal"
import { Footer } from "@/components/footer"

const projects = [
  {
    id: "1",
    title: "AI-Powered Recipe Discovery Platform",
    description: "Transform how people discover and cook meals with personalized AI recommendations.",
    creator: { name: "Sarah Chen", avatar: "/placeholder.svg?key=4jpts" },
    category: "Technology",
    image: "/placeholder.svg?key=594bv",
    raised: 8450,
    goal: 10000,
    backers: 423,
    daysLeft: 12,
  },
  {
    id: "2",
    title: "Sustainable Fashion Marketplace",
    description: "Connect eco-conscious consumers with ethical fashion brands. Every purchase plants a tree.",
    creator: { name: "Maya Rodriguez", avatar: "/placeholder.svg?key=b51i6" },
    category: "Social Impact",
    image: "/placeholder.svg?key=2and1",
    raised: 5200,
    goal: 8000,
    backers: 156,
    daysLeft: 8,
  },
  {
    id: "3",
    title: "Indie Game Studio: Pixel Quest",
    description: "A retro-inspired RPG with modern mechanics. Join us in creating an unforgettable gaming experience.",
    creator: { name: "Alex Turner", avatar: "/placeholder.svg?key=kycxb" },
    category: "Gaming",
    image: "/placeholder.svg?key=c8ykx",
    raised: 12500,
    goal: 15000,
    backers: 892,
    daysLeft: 15,
  },
  {
    id: "4",
    title: "Community Coffee Roastery",
    description: "Bringing specialty coffee to local neighborhoods while supporting small farmers worldwide.",
    creator: { name: "Jordan Lee", avatar: "/placeholder.svg?key=vfqmb" },
    category: "Food & Beverage",
    image: "/placeholder.svg?key=ey7ew",
    raised: 3400,
    goal: 6000,
    backers: 78,
    daysLeft: 21,
  },
  {
    id: "5",
    title: "Mental Health Journaling App",
    description: "AI-assisted journaling with mood tracking, meditation guides, and therapeutic exercises.",
    creator: { name: "Dr. Emily Watson", avatar: "/placeholder.svg?key=wzjll" },
    category: "Health & Wellness",
    image: "/placeholder.svg?key=cd0g1",
    raised: 7800,
    goal: 12000,
    backers: 234,
    daysLeft: 18,
  },
  {
    id: "6",
    title: "Urban Vertical Garden System",
    description: "Modular indoor gardening solution for apartments. Grow fresh herbs and vegetables year-round.",
    creator: { name: "Marcus Green", avatar: "/placeholder.svg?key=oy9jb" },
    category: "Innovation",
    image: "/placeholder.svg?key=qzjjj",
    raised: 4300,
    goal: 7500,
    backers: 142,
    daysLeft: 10,
  },
  {
    id: "7",
    title: "Local Artist Collaboration Platform",
    description: "Connect artists for collaborative projects, exhibitions, and creative partnerships.",
    creator: { name: "Aria Santos", avatar: "/placeholder.svg?key=hq26r" },
    category: "Art & Design",
    image: "/placeholder.svg?key=08l79",
    raised: 2100,
    goal: 5000,
    backers: 67,
    daysLeft: 25,
  },
  {
    id: "8",
    title: "EdTech Platform for Rural Schools",
    description: "Providing quality education resources to underserved communities through technology.",
    creator: { name: "Priya Sharma", avatar: "/placeholder.svg?key=1mqza" },
    category: "Education",
    image: "/placeholder.svg?key=y8zlr",
    raised: 6700,
    goal: 9000,
    backers: 289,
    daysLeft: 14,
  },
  {
    id: "9",
    title: "Eco-Friendly Packaging Solutions",
    description: "Biodegradable packaging alternatives for e-commerce businesses.",
    creator: { name: "Tom Williams", avatar: "/placeholder.svg?key=f9pv1" },
    category: "Social Impact",
    image: "/placeholder.svg?key=m6n4k",
    raised: 4900,
    goal: 7000,
    backers: 178,
    daysLeft: 19,
  },
]

const categories = [
  "All",
  "Technology",
  "Art & Design",
  "Social Impact",
  "Gaming",
  "Food & Beverage",
  "Health & Wellness",
  "Innovation",
  "Education",
]

export default function ProjectsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto py-12 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Projects</h1>
          <p className="text-lg text-muted-foreground">
            1,247 projects backed. Some will be huge. Most will be useful.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-12">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="pl-10" />
            </div>
            <ProjectComparisonModal projects={projects} />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={category === "All" ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Show me more
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

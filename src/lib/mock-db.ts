
export interface MockProject {
    id: string
    title: string
    creator: string
    creator_id: string
    creator_wallet?: string
    category: string
    votes: number
    submittedDate: string
    status: "pending" | "approved" | "rejected"
    description: string
    goal: number
    raised: number
    deadline: string | null
    image_url: string | null
    approvedDate?: string
    rejectedDate?: string
    rejectionReason?: string
    created_at: string
    updated_at: string
    milestones?: Array<{ title: string; percentage: number }>
}

const INITIAL_PROJECTS: MockProject[] = [
    {
        id: "mock-1",
        title: "Eco-Friendly Urban Garden Kit",
        creator: "GreenThumb Solutions",
        creator_id: "user-1",
        creator_wallet: "4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw",
        category: "Social Impact",
        votes: 156,
        submittedDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        status: "pending",
        description: "A complete kit for growing your own vegetables in small urban spaces.",
        goal: 5000,
        raised: 0,
        deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
        image_url: "/placeholder.svg?key=eco",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
        id: "mock-2",
        title: "Neon Cyberpunk RPG",
        creator: "PixelForge Games",
        creator_id: "user-2",
        creator_wallet: "Bp7Dz5mVr7dLNEVTJGXvQTi8LY7djRUYvMZv7dMwCMnN",
        category: "Gaming",
        votes: 892,
        submittedDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        status: "pending",
        description: "An immersive open-world RPG set in a dystopian future.",
        goal: 25000,
        raised: 0,
        deadline: new Date(Date.now() + 86400000 * 45).toISOString(),
        image_url: "/placeholder.svg?key=rpg",
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
        id: "mock-3",
        title: "AI-Powered Music Composer",
        creator: "AudioTech Labs",
        creator_id: "user-3",
        creator_wallet: "Cz8Dw4nMr6cJMEVTJGXvQTi8LY7djRUYvMZv7dMwCMnP",
        category: "Technology",
        votes: 430,
        submittedDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
        status: "pending",
        description: "Generate royalty-free music for your videos using advanced AI.",
        goal: 10000,
        raised: 0,
        deadline: new Date(Date.now() + 86400000 * 60).toISOString(),
        image_url: "/placeholder.svg?key=music",
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
        id: "mock-4",
        title: "Handcrafted Leather Wallets",
        creator: "Artisan Crafts",
        creator_id: "user-4",
        category: "Art",
        votes: 85,
        submittedDate: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
        status: "pending",
        description: "Premium leather wallets made by hand using traditional techniques.",
        goal: 2000,
        raised: 0,
        deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
        image_url: "/placeholder.svg?key=wallet",
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
        id: "mock-5",
        title: "Community Clean-Up Drone",
        creator: "EcoTech Innovations",
        creator_id: "user-5",
        category: "Technology",
        votes: 210,
        submittedDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        status: "pending",
        description: "Autonomous drones designed to clean up litter in public parks.",
        goal: 15000,
        raised: 0,
        deadline: new Date(Date.now() + 86400000 * 90).toISOString(),
        image_url: "/placeholder.svg?key=drone",
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    }
]

// Global variable to hold state across hot reloads (in dev)
const globalForMockDb = globalThis as unknown as {
    mockProjects: MockProject[] | undefined
}

if (!globalForMockDb.mockProjects) {
    globalForMockDb.mockProjects = [...INITIAL_PROJECTS]
}

export const mockDb = {
    getProjects: (filters: { status?: string; category?: string; sort?: string } = {}) => {
        // Always read from global to get latest state
        let filtered = [...globalForMockDb.mockProjects!]

        if (filters.status) {
            filtered = filtered.filter(p => p.status === filters.status)
        }

        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(p => p.category === filters.category)
        }

        if (filters.sort) {
            filtered.sort((a, b) => {
                switch (filters.sort) {
                    case 'newest':
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    case 'oldest':
                        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    case 'most_voted':
                        return b.votes - a.votes
                    case 'least_voted':
                        return a.votes - b.votes
                    default:
                        return 0
                }
            })
        }

        return filtered
    },

    getProject: (id: string) => {
        return globalForMockDb.mockProjects!.find(p => p.id === id)
    },

    updateStatus: (id: string, status: "approved" | "rejected", reason?: string) => {
        const projects = globalForMockDb.mockProjects!
        const projectIndex = projects.findIndex(p => p.id === id)
        if (projectIndex === -1) return null

        const updatedProject = {
            ...projects[projectIndex],
            status,
            updated_at: new Date().toISOString(),
            ...(status === 'approved' ? { approvedDate: new Date().toISOString() } : {}),
            ...(status === 'rejected' ? { rejectedDate: new Date().toISOString(), rejectionReason: reason } : {})
        }

        projects[projectIndex] = updatedProject
        return updatedProject
    },

    bulkUpdateStatus: (ids: string[], status: "approved" | "rejected", reason?: string) => {
        const projects = globalForMockDb.mockProjects!
        const updatedProjects: MockProject[] = []

        ids.forEach(id => {
            const projectIndex = projects.findIndex(p => p.id === id)
            if (projectIndex !== -1) {
                const updatedProject = {
                    ...projects[projectIndex],
                    status,
                    updated_at: new Date().toISOString(),
                    ...(status === 'approved' ? { approvedDate: new Date().toISOString() } : {}),
                    ...(status === 'rejected' ? { rejectedDate: new Date().toISOString(), rejectionReason: reason } : {})
                }
                projects[projectIndex] = updatedProject
                updatedProjects.push(updatedProject)
            }
        })

        return updatedProjects
    },

    // Helper to reset DB if needed
    reset: () => {
        globalForMockDb.mockProjects = [...INITIAL_PROJECTS]
    }
}

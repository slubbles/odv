export type MilestoneStatus = 'locked' | 'active' | 'in_review' | 'completed' | 'disputed';
export type ProjectStatus = 'draft' | 'queue' | 'active' | 'completed';

export interface Milestone {
    id: string;
    project_id: string;
    title: string;
    description?: string;
    percentage: number;
    amount?: number;
    deadline: string;
    status: MilestoneStatus;
    proof?: {
        description: string;
        links: string[];
        files: string[];
        submittedAt: string;
    };
}

export interface Project {
    id: string;
    created_at: string;
    title: string;
    tagline: string;
    description: string;
    category: string;
    goal: number;
    raised: number;
    backers_count: number;
    video_url?: string;
    image_url?: string;
    creator_wallet: string;
    status: ProjectStatus;
    deadline?: string;

    // Social Links (Flat)
    twitter_link?: string;
    github_link?: string;
    website_link?: string;

    // Creator Profile (Flat)
    creator_name?: string;
    creator_avatar?: string;
    creator_bio?: string;

    milestones?: Milestone[];
}


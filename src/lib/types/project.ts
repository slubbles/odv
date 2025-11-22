export type MilestoneStatus = 'locked' | 'active' | 'in_review' | 'completed' | 'disputed';

export interface Milestone {
    id: string;
    title: string;
    description: string;
    percentage: number;
    amount: number;
    deadline: string; // ISO date string
    status: MilestoneStatus;
    proof?: {
        description: string;
        links: string[];
        files: string[];
        submittedAt: string;
    };
    votes?: {
        approve: number;
        dispute: number;
    };
}

export interface Project {
    id: string;
    title: string;
    tagline: string;
    description: string;
    category: string;
    creator: {
        name: string;
        avatarUrl?: string;
        walletAddress: string;
    };
    stats: {
        backers: number;
        raised: number;
        goal: number;
        daysLeft: number;
    };
    milestones: Milestone[];
    videoUrl?: string;
}

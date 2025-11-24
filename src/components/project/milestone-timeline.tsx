import { Milestone } from "@/lib/types/project";
import { MilestoneCard } from "./milestone-card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface MilestoneTimelineProps {
    milestones: Milestone[];
    isCreator?: boolean;
    isBacker?: boolean;
}

export function MilestoneTimeline({ milestones, isCreator, isBacker }: MilestoneTimelineProps) {
    return (
        <div className="relative space-y-8 pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
            {milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative">
                    {/* Timeline Dot */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className={`absolute -left-[29px] top-4 w-6 h-6 rounded-full border-4 border-background cursor-help ${milestone.status === 'completed' ? 'bg-green-500' :
                                    milestone.status === 'active' || milestone.status === 'in_review' ? 'bg-primary animate-pulse' :
                                        'bg-muted'
                                    }`} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="capitalize">{milestone.status.replace('_', ' ')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <MilestoneCard
                        milestone={milestone}
                        isCreator={isCreator}
                        isBacker={isBacker}
                    />
                </div>
            ))}
        </div>
    );
}

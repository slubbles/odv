'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Milestone } from "@/lib/types/project";
import { CheckCircle2, AlertCircle, Clock, Upload, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { ProofUploadModal } from "./proof-upload-modal";

interface MilestoneCardProps {
    milestone: Milestone;
    isCreator?: boolean;
    isBacker?: boolean;
}

export function MilestoneCard({ milestone, isCreator, isBacker }: MilestoneCardProps) {
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const statusColors = {
        locked: "bg-muted text-muted-foreground",
        active: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        in_review: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        completed: "bg-green-500/10 text-green-500 border-green-500/20",
        disputed: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    const statusIcons = {
        locked: Clock,
        active: Clock,
        in_review: AlertCircle,
        completed: CheckCircle2,
        disputed: AlertCircle,
    };

    const StatusIcon = statusIcons[milestone.status];

    return (
        <Card className={`relative ${milestone.status === 'locked' ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{milestone.title}</CardTitle>
                            <Badge variant="outline" className={statusColors[milestone.status]}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {milestone.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Releases {milestone.percentage}% (${milestone.amount})
                        </p>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                        Due: {new Date(milestone.deadline).toLocaleDateString()}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    {milestone.description}
                </p>

                {/* Actions Area */}
                <div className="flex items-center justify-between pt-4 border-t">
                    {/* Creator Actions */}
                    {isCreator && milestone.status === 'active' && (
                        <Button size="sm" onClick={() => setIsUploadOpen(true)}>
                            <Upload className="w-4 h-4 mr-2" />
                            Submit Proof
                        </Button>
                    )}

                    {/* Backer Actions */}
                    {isBacker && milestone.status === 'in_review' && (
                        <div className="flex gap-2 w-full">
                            <Button size="sm" variant="outline" className="flex-1 hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/50">
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                Approve
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/50">
                                <ThumbsDown className="w-4 h-4 mr-2" />
                                Dispute
                            </Button>
                        </div>
                    )}

                    {/* Proof View (for everyone if submitted) */}
                    {milestone.proof && (
                        <Button variant="link" size="sm" className="px-0">
                            View Submitted Proof
                        </Button>
                    )}
                </div>
            </CardContent>

            <ProofUploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                milestoneTitle={milestone.title}
            />
        </Card>
    );
}

'use client';

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { ClientOnlyWalletButton } from "@/components/wallet/client-only-wallet-button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface Comment {
    id: string;
    created_at: string;
    user_wallet: string;
    content: string;
}

interface CommentSectionProps {
    projectId: string;
}

export function CommentSection({ projectId }: CommentSectionProps) {
    const { publicKey, connected } = useWallet();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [projectId]);

    async function fetchComments() {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setComments(data || []);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmitComment() {
        if (!connected || !publicKey) {
            toast.error("Please connect your wallet to comment");
            return;
        }

        if (!newComment.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        setSubmitting(true);

        try {
            const { error } = await supabase
                .from('comments')
                .insert({
                    project_id: projectId,
                    user_wallet: publicKey.toBase58(),
                    content: newComment.trim()
                });

            if (error) throw error;

            toast.success("Comment posted!");
            setNewComment("");
            fetchComments(); // Refresh comments
        } catch (error) {
            console.error("Error posting comment:", error);
            toast.error("Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Comments
                </CardTitle>
                <CardDescription>
                    {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Comment Input */}
                <div className="space-y-3">
                    {connected ? (
                        <>
                            <Textarea
                                placeholder="Share your thoughts..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[100px]"
                            />
                            <Button
                                onClick={handleSubmitComment}
                                disabled={submitting || !newComment.trim()}
                                className="w-full sm:w-auto"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    'Post Comment'
                                )}
                            </Button>
                        </>
                    ) : (
                        <div className="text-center p-6 border rounded-lg bg-muted/30">
                            <p className="text-sm text-muted-foreground mb-3">
                                Connect your wallet to leave a comment
                            </p>
                            <ClientOnlyWalletButton />
                        </div>
                    )}
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3 p-4 border rounded-lg">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-[80%]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : comments.length === 0 ? (
                        <EmptyState
                            icon={MessageSquare}
                            title="No comments yet"
                            description="Be the first to share your thoughts on this project!"
                        />
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 p-4 border rounded-lg">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>
                                        {comment.user_wallet.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="font-mono text-sm font-medium cursor-help">
                                                        {comment.user_wallet.slice(0, 4)}...{comment.user_wallet.slice(-4)}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{comment.user_wallet}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(comment.created_at).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

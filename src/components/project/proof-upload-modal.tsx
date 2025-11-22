'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ProofUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    milestoneTitle: string;
}

export function ProofUploadModal({ isOpen, onClose, milestoneTitle }: ProofUploadModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Proof submitted");
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Submit Proof for "{milestoneTitle}"</DialogTitle>
                    <DialogDescription>
                        Provide evidence that you've completed this milestone. Backers will review this before funds are released.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="description">Description of Work</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe what you've built..."
                            className="min-h-[100px]"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="demo-url">Demo URL</Label>
                        <Input id="demo-url" placeholder="https://..." type="url" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="github-url">GitHub Commit/PR</Label>
                        <Input id="github-url" placeholder="https://github.com/..." type="url" />
                    </div>

                    <div className="space-y-2">
                        <Label>Screenshots / Files</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                            Click to upload or drag and drop
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit for Review
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

'use client';

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "@/lib/supabase/client";
import { Project } from "@/lib/types/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { ClientOnlyWalletButton } from "@/components/wallet/client-only-wallet-button";

// Mock Admin Wallet - Replace with your actual wallet address for testing
const ADMIN_WALLET = "7Xw... (Replace with your wallet)";

export default function AdminPage() {
    const { publicKey, connected } = useWallet();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (connected && publicKey) {
            // In a real app, you'd check this against an env var or database
            // For now, we'll just allow access if connected (for demo purposes) 
            // OR you can uncomment the line below to enforce a specific wallet
            // setIsAdmin(publicKey.toBase58() === ADMIN_WALLET);
            setIsAdmin(true);
            fetchQueue();
        } else {
            setIsAdmin(false);
            setLoading(false);
        }
    }, [connected, publicKey]);

    async function fetchQueue() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('status', 'queue')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error("Error fetching queue:", error);
            toast.error("Failed to fetch queue");
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove(projectId: string) {
        try {
            const { error } = await supabase
                .from('projects')
                .update({ status: 'active' })
                .eq('id', projectId);

            if (error) throw error;

            toast.success("Project approved!");
            fetchQueue(); // Refresh list
        } catch (error) {
            console.error("Error approving project:", error);
            toast.error("Failed to approve project");
        }
    }

    async function handleReject(projectId: string) {
        if (!confirm("Are you sure you want to reject this project?")) return;

        try {
            const { error } = await supabase
                .from('projects')
                .update({ status: 'rejected' }) // Ensure 'rejected' is handled in your app logic
                .eq('id', projectId);

            if (error) throw error;

            toast.success("Project rejected");
            fetchQueue(); // Refresh list
        } catch (error) {
            console.error("Error rejecting project:", error);
            toast.error("Failed to reject project");
        }
    }

    if (!connected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <ShieldAlert className="w-16 h-16 text-muted-foreground" />
                <h1 className="text-2xl font-bold">Admin Access Required</h1>
                <p className="text-muted-foreground">Please connect an admin wallet to continue.</p>
                <ClientOnlyWalletButton />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <XCircle className="w-16 h-16 text-destructive" />
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">Your wallet is not authorized to view this page.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage project submissions and platform settings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Submission Queue</CardTitle>
                    <CardDescription>Projects waiting for approval.</CardDescription>
                </CardHeader>
                <CardContent>
                    {projects.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No projects in the queue.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Creator</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell>
                                            <div className="font-medium">{project.title}</div>
                                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                {project.tagline}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{project.category}</Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {project.creator_wallet.slice(0, 4)}...{project.creator_wallet.slice(-4)}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-destructive hover:bg-destructive/10"
                                                onClick={() => handleReject(project.id)}
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => handleApprove(project.id)}
                                            >
                                                Approve
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

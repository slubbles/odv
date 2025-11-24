"use client"

import { useParams, useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Project } from "@/lib/types/project"
import { EditProjectForm } from "@/components/dashboard/edit-project-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function EditProjectPage() {
    const params = useParams()
    const router = useRouter()
    const { publicKey, connected } = useWallet()
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProject() {
            if (!connected || !publicKey) {
                setError("Please connect your wallet")
                setLoading(false)
                return
            }

            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', params.id)
                    .eq('creator_wallet', publicKey.toBase58())
                    .single()

                if (error) throw error

                if (!data) {
                    setError("Project not found or you don't have permission to edit it")
                    setLoading(false)
                    return
                }

                // Check if project can be edited
                if (data.status !== 'draft' && data.status !== 'queue') {
                    setError("Only draft and queue projects can be edited")
                    setLoading(false)
                    return
                }

                setProject(data)
            } catch (err) {
                console.error("Error fetching project:", err)
                setError("Failed to load project")
            } finally {
                setLoading(false)
            }
        }

        fetchProject()
    }, [connected, publicKey, params.id])

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="container max-w-2xl py-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Unable to Edit Project</CardTitle>
                        <CardDescription>{error || "Project not found"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard/creator">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container max-w-4xl py-12">
            <div className="mb-8">
                <Link href="/dashboard/creator">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>
            </div>

            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
                <p className="text-muted-foreground mt-2">
                    Update your project details. Changes to queue projects may require re-approval.
                </p>
            </div>

            {project.status === 'queue' && (
                <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Editing a project in queue will reset its position. Your project will need to be re-approved.
                    </AlertDescription>
                </Alert>
            )}

            {/* Editable Form */}
            <EditProjectForm project={project} />
        </div>
    )
}

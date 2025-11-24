"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { projectSchema, type ProjectFormValues } from "@/lib/validations/project"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, Github, Twitter, Globe, Info } from "lucide-react"
import { useState } from "react"
import { Project } from "@/lib/types/project"
import { useRouter } from "next/navigation"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface EditProjectFormProps {
    project: Project
}

export function EditProjectForm({ project }: EditProjectFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: project.title,
            tagline: project.tagline,
            description: project.description,
            category: project.category,
            goal: project.goal,
            videoUrl: project.video_url || "",
            imageUrl: project.image_url || "",
            links: {
                github: project.github_link || "",
                twitter: project.twitter_link || "",
                website: project.website_link || "",
            },
            milestones: project.milestones?.map(m => ({
                title: m.title,
                percentage: m.percentage,
                deadline: m.deadline,
            })) || [],
        },
    })

    const { fields, append, remove } = useFieldArray({
        name: "milestones",
        control: form.control,
    })

    async function onSubmit(data: ProjectFormValues) {
        setIsSubmitting(true)

        try {
            // Update project
            const { error: projectError } = await supabase
                .from('projects')
                .update({
                    title: data.title,
                    tagline: data.tagline,
                    description: data.description,
                    category: data.category,
                    goal: data.goal,
                    video_url: data.videoUrl || null,
                    image_url: data.imageUrl || null,
                    twitter_link: data.links?.twitter || null,
                    github_link: data.links?.github || null,
                    website_link: data.links?.website || null,
                    // Reset to queue if it was in queue (requires re-approval)
                    status: project.status === 'queue' ? 'queue' : project.status,
                })
                .eq('id', project.id)

            if (projectError) throw projectError

            // Delete existing milestones and recreate
            await supabase
                .from('milestones')
                .delete()
                .eq('project_id', project.id)

            if (data.milestones.length > 0) {
                const milestonesData = data.milestones.map(m => ({
                    project_id: project.id,
                    title: m.title,
                    percentage: m.percentage,
                    amount: (data.goal * m.percentage) / 100,
                    deadline: m.deadline,
                    status: 'locked'
                }))

                const { error: milestonesError } = await supabase
                    .from('milestones')
                    .insert(milestonesData)

                if (milestonesError) throw milestonesError
            }

            toast.success("Project updated successfully!")
            router.push('/dashboard/creator')
        } catch (error: unknown) {
            console.error("Update error:", error)
            const message = error instanceof Error ? error.message : "Unknown error"
            toast.error("Failed to update project: " + message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <TooltipProvider>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                            <CardDescription>
                                Update your project information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. EchoNotes" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tagline"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>One-Line Tagline</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. AI-powered voice memos" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This will appear on the project card.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="SaaS">SaaS</SelectItem>
                                                <SelectItem value="Mobile">Mobile App</SelectItem>
                                                <SelectItem value="Web3">Web3 / Crypto</SelectItem>
                                                <SelectItem value="Game">Game</SelectItem>
                                                <SelectItem value="Hardware">Hardware</SelectItem>
                                                <SelectItem value="Community">Community</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Detailed Pitch</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your project in detail..."
                                                className="min-h-[200px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="goal"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Funding Goal ($)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                1 backer = $1
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="videoUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Demo Video URL (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://youtube.com/..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Links</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="links.github"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Github className="w-4 h-4" /> GitHub
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://github.com/..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="links.twitter"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Twitter className="w-4 h-4" /> Twitter
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://x.com/..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="links.website"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4" /> Website
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CardTitle>Milestones</CardTitle>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="w-4 h-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Break down your project into key deliverables.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <CardDescription>
                                Break down your roadmap
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-start p-4 border rounded-lg bg-muted/20">
                                    <div className="grid gap-4 flex-1 md:grid-cols-3">
                                        <FormField
                                            control={form.control}
                                            name={`milestones.${index}.title`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Milestone Title" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`milestones.${index}.percentage`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Payout %</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="%" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`milestones.${index}.deadline`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Deadline</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. 30 days" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="mt-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => append({ title: "", percentage: 0, deadline: "" })}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Milestone
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" size="lg" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Project
                        </Button>
                    </div>
                </form>
            </Form>
        </TooltipProvider>
    )
}

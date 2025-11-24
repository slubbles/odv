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
import { useWallet } from "@solana/wallet-adapter-react"
import { ClientOnlyWalletButton } from "@/components/wallet/client-only-wallet-button"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, CheckCircle2, Github, Twitter, Globe, UploadCloud, Info } from "lucide-react"
import { useState } from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function SubmissionForm() {
    const { connected, publicKey } = useWallet()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: "",
            tagline: "",
            description: "",
            goal: 1000,
            videoUrl: "",
            imageUrl: "",
            links: {
                github: "",
                twitter: "",
                website: "",
            },
            milestones: [
                { title: "Prototype", percentage: 20, deadline: "30 days" },
                { title: "Beta Launch", percentage: 30, deadline: "60 days" },
                { title: "Public Launch", percentage: 50, deadline: "90 days" },
            ],
        },
    })

    const { fields, append, remove } = useFieldArray({
        name: "milestones",
        control: form.control,
    })

    const [isSuccess, setIsSuccess] = useState(false)

    async function onSubmit(data: ProjectFormValues) {
        if (!connected || !publicKey) {
            toast.error("Please connect your wallet first")
            return
        }

        setIsSubmitting(true)

        try {
            // 1. Insert Project
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .insert({
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
                    creator_wallet: publicKey.toBase58(),
                    status: 'queue'
                })
                .select()
                .single()

            if (projectError) throw projectError

            // 2. Insert Milestones
            if (data.milestones.length > 0) {
                const milestonesData = data.milestones.map(m => ({
                    project_id: projectData.id,
                    title: m.title,
                    percentage: m.percentage,
                    amount: (data.goal * m.percentage) / 100, // Calculate amount from percentage
                    deadline: m.deadline,
                    status: 'locked'
                }))

                const { error: milestonesError } = await supabase
                    .from('milestones')
                    .insert(milestonesData)

                if (milestonesError) throw milestonesError
            }

            console.log("Project submitted:", projectData)
            setIsSuccess(true)
            toast.success("Project submitted successfully!")
        } catch (error: unknown) {
            console.error("Submission error:", error)
            const message = error instanceof Error ? error.message : "Unknown error"
            toast.error("Failed to submit project: " + message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <Card className="w-full max-w-2xl mx-auto text-center p-12 border-green-500/20 bg-green-500/5">
                <CardContent className="flex flex-col items-center space-y-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Submission Received!</h2>
                        <p className="text-muted-foreground text-lg max-w-md mx-auto">
                            Your project <span className="font-semibold text-foreground">&ldquo;{form.getValues("title")}&rdquo;</span> has been added to the queue.
                        </p>
                    </div>
                    <div className="p-4 bg-background rounded-lg border w-full max-w-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Queue Position</span>
                            <span className="font-bold text-primary">#7</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Estimated Spotlight</span>
                            <span className="font-medium">Nov 28, 2025</span>
                        </div>
                    </div>
                    <Button onClick={() => window.location.href = '/dashboard'} className="w-full max-w-sm">
                        Go to Dashboard
                    </Button>
                </CardContent>
            </Card>
        )
    }

    if (!connected) {
        return (
            <Card className="w-full max-w-2xl mx-auto text-center p-12">
                <CardHeader>
                    <CardTitle className="text-2xl">Connect Wallet to Submit</CardTitle>
                    <CardDescription>
                        You need to connect your Solana wallet to submit a project.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <ClientOnlyWalletButton />
                </CardContent>
            </Card>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                        <CardDescription>
                            Tell us about your project. Make it compelling!
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
                                        <Input placeholder="e.g. AI-powered voice memos that organize themselves." {...field} />
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
                                            placeholder="Describe your project in detail. What problem does it solve? Who is it for?"
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
                                            1 backer = $1. Goal of 1000 = 1000 backers.
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Image URL (Mock Upload)</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Input placeholder="https://..." {...field} />
                                                <Button type="button" variant="outline" size="icon">
                                                    <UploadCloud className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Use a direct image link for now.
                                        </FormDescription>
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
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="w-4 h-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Break down your project into key deliverables.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <CardDescription>
                            Break down your roadmap. Funds are released as you complete these.
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

                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Project
                    </Button>
                </div>
            </form>
        </Form>
    )
}

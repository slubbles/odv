import * as z from "zod"

export const projectSchema = z.object({
    title: z.string().min(2, {
        message: "Project title must be at least 2 characters.",
    }),
    tagline: z.string().min(10, {
        message: "Tagline must be at least 10 characters.",
    }).max(100, {
        message: "Tagline must not exceed 100 characters.",
    }),
    description: z.string().min(50, {
        message: "Pitch must be at least 50 characters.",
    }),
    category: z.string({
        required_error: "Please select a category.",
    }),
    goal: z.coerce.number().min(100, {
        message: "Minimum funding goal is $100.",
    }),
    videoUrl: z.string().url({
        message: "Please enter a valid URL.",
    }).optional().or(z.literal("")),
    imageUrl: z.string().optional(),
    links: z.object({
        github: z.string().url({ message: "Invalid GitHub URL" }).optional().or(z.literal("")),
        twitter: z.string().url({ message: "Invalid Twitter URL" }).optional().or(z.literal("")),
        website: z.string().url({ message: "Invalid Website URL" }).optional().or(z.literal("")),
    }).optional(),
    milestones: z.array(z.object({
        title: z.string().min(2, "Milestone title required"),
        percentage: z.coerce.number().min(1).max(100),
        deadline: z.string().min(1, "Deadline required"),
    })).min(1, "At least one milestone is required"),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

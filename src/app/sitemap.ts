import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://onedollarventures.com' // Update with real URL

    let projectUrls: MetadataRoute.Sitemap = []

    // Only fetch projects if Supabase credentials are available
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        )

        // Fetch all active projects
        const { data: projects } = await supabase
            .from('projects')
            .select('id, updated_at')
            .eq('status', 'active')

        projectUrls = (projects || []).map((project) => ({
            url: `${baseUrl}/projects/${project.id}`,
            lastModified: new Date(project.updated_at),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        }))
    }

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/projects/archive`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/submit`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        ...projectUrls,
    ]
}

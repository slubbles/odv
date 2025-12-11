import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// GET /api/projects - List all projects with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status') // active, funded, completed, all
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') // trending, newest, ending, funded
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const creator = searchParams.get('creator') // filter by creator wallet

    let projects: any[] = []
    let count = 0
    let isMockMode = false

    // Comprehensive mock data for development/fallback
    const mockProjects = [
      {
        id: '1',
        title: 'Decentralized Social Network',
        tagline: 'Web3 social media without the drama',
        description: 'Building the next generation of social networking on Solana. Connect with your community without intermediaries.',
        category: 'Technology',
        goal: 10000,
        raised: 3500,
        backers_count: 45,
        status: 'active',
        creator_wallet: '4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw',
        creator_name: 'Alice Builder',
        creator_avatar: '/default-avatar.png',
        image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        title: 'NFT Marketplace for Artists',
        tagline: 'Empowering creators worldwide',
        description: 'A commission-free NFT marketplace built for artists. Mint, sell, and collect digital art with zero fees.',
        category: 'Art & Design',
        goal: 15000,
        raised: 8200,
        backers_count: 89,
        status: 'active',
        creator_wallet: '4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw',
        creator_name: 'Bob Creator',
        creator_avatar: '/default-avatar.png',
        image_url: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=800',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        title: 'Eco-Friendly Smart Gardens',
        tagline: 'Grow organic food at home',
        description: 'IoT-powered indoor garden system for urban dwellers. Fresh vegetables and herbs year-round.',
        category: 'Social Impact',
        goal: 8000,
        raised: 4200,
        backers_count: 67,
        status: 'active',
        creator_wallet: '4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw',
        creator_name: 'Charlie Green',
        creator_avatar: '/default-avatar.png',
        image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        title: 'DeFi Education Platform',
        tagline: 'Learn crypto, earn rewards',
        description: 'Interactive courses teaching DeFi, blockchain, and Web3 development. Learn-to-earn model.',
        category: 'Innovation',
        goal: 12000,
        raised: 12000,
        backers_count: 156,
        status: 'funded',
        creator_wallet: '4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw',
        creator_name: 'Diana Teacher',
        creator_avatar: '/default-avatar.png',
        image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        title: 'Community Health Initiative',
        tagline: 'Healthcare for everyone',
        description: 'Mobile health clinics serving underserved communities. Providing free checkups and medicine.',
        category: 'Health & Wellness',
        goal: 20000,
        raised: 22500,
        backers_count: 234,
        status: 'completed',
        creator_wallet: '4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw',
        creator_name: 'Dr. Evan Health',
        creator_avatar: '/default-avatar.png',
        image_url: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800',
        deadline: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        title: 'Indie Game: Space Quest',
        tagline: 'Explore the cosmos',
        description: 'Open-world space exploration game with NFT collectibles. Build your spaceship, discover new worlds.',
        category: 'Gaming',
        goal: 25000,
        raised: 5600,
        backers_count: 78,
        status: 'active',
        creator_wallet: '4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw',
        creator_name: 'Frank Developer',
        creator_avatar: '/default-avatar.png',
        image_url: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    // Helper function to filter and sort mock data
    const filterMockProjects = (data: typeof mockProjects) => {
      let filtered = [...data]

      // Status filter
      if (status && status !== 'all') {
        filtered = filtered.filter(p => p.status === status)
      }

      // Category filter
      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase())
      }

      // Creator filter
      if (creator) {
        filtered = filtered.filter(p => p.creator_wallet === creator)
      }

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tagline.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          p.creator_name.toLowerCase().includes(searchLower)
        )
      }

      // Sorting
      switch (sort) {
        case 'trending':
          filtered.sort((a, b) => b.backers_count - a.backers_count)
          break
        case 'newest':
          filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          break
        case 'ending':
          filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
          break
        case 'funded':
          filtered.sort((a, b) => b.raised - a.raised)
          break
        default:
          filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }

      // Pagination
      const from = (page - 1) * limit
      const to = from + limit
      const paginated = filtered.slice(from, to)

      return { paginated, total: filtered.length }
    }

    // Use mock data if Supabase is not available
    if (!supabase) {
      isMockMode = true
      const { paginated, total } = filterMockProjects(mockProjects)
      projects = paginated
      count = total
    } else {
      // Start query
      let query = supabase
        .from('projects')
        .select('*', { count: 'exact' })

      // Apply filters
      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      if (creator) {
        query = query.eq('creator_wallet', creator)
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      }

      // Apply sorting
      switch (sort) {
        case 'trending':
          // Sort by backers count and recent activity
          query = query.order('backers_count', { ascending: false })
          break
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'ending':
          query = query.order('deadline', { ascending: true })
          break
        case 'funded':
          query = query.order('raised', { ascending: false })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      // Pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      try {
        const result = await query
        projects = result.data || []
        count = result.count || 0
        if (result.error) throw result.error
      } catch (error: any) {
        console.warn('Supabase query failed, using mock data:', error.message)
        isMockMode = true

        // Use the shared filter function with mock data
        const { paginated, total } = filterMockProjects(mockProjects)
        projects = paginated
        count = total
      }
    }

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      },
      _mock: isMockMode // Indicator that mock data is being used
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()

    const {
      title,
      tagline,
      description,
      category,
      goal,
      deadline,
      creator_wallet,
      campaign_id,
      campaign_pda,
      image_url,
      video_url,
      milestones
    } = body

    // Validation
    if (!title || !description || !goal || !creator_wallet) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, goal, creator_wallet' },
        { status: 400 }
      )
    }

    if (!supabase) {
      console.error('[API] Supabase client not available - check environment variables')
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: 'Supabase environment variables are not configured. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
        },
        { status: 500 }
      )
    }

    console.log('[API] Creating project:', { title, creator_wallet, campaign_id })

    // Insert project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        title,
        tagline: tagline || null,
        description,
        category,
        goal,
        deadline,
        creator_wallet,
        campaign_id: campaign_id || null,
        campaign_pda: campaign_pda || null,
        image_url,
        video_url,
        status: 'queue', // New projects go to queue for admin approval
        raised: 0,
        backers_count: 0
      })
      .select()
      .single()

    if (projectError) {
      console.error('[API] Failed to create project:', projectError)
      return NextResponse.json(
        { 
          error: 'Failed to create project',
          details: projectError.message,
          hint: projectError.hint,
          code: projectError.code
        },
        { status: 500 }
      )
    }

    // Insert milestones if provided
    if (milestones && milestones.length > 0) {
      console.log('[API] Creating milestones:', milestones.length)
      const milestonesWithProjectId = milestones.map((m: any) => ({
        ...m,
        project_id: project.id,
        status: 'pending'
      }))

      const { error: milestonesError } = await supabase
        .from('milestones')
        .insert(milestonesWithProjectId)

      if (milestonesError) {
        console.error('[API] Failed to create milestones:', milestonesError)
        // Don't fail the request, just log it
      } else {
        console.log('[API] Milestones created successfully')
      }
    }

    console.log('[API] Project created successfully:', project.id)
    return NextResponse.json({
      success: true,
      project,
      message: 'Project created successfully! It will be reviewed by admins.'
    }, { status: 201 })

  } catch (error: any) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message || 'An unexpected error occurred',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

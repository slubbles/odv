import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

// GET /api/projects - List all projects with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const status = searchParams.get('status') // active, funded, completed, all
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') // trending, newest, ending, funded
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const creator = searchParams.get('creator') // filter by creator wallet

    // Start query
    let query = supabase
      .from('projects')
      .select('*', { count: 'exact' })
    
    // Fallback to mock data if Supabase fails (for development)
    let isMockMode = false

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (category) {
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

    let projects: any[] = []
    let count = 0

    try {
      const result = await query
      projects = result.data || []
      count = result.count || 0
      if (result.error) throw result.error
    } catch (error: any) {
      console.warn('Supabase unavailable, using mock data:', error.message)
      isMockMode = true
      
      // Mock data for development
      const mockProjects = [
        {
          id: '1',
          title: 'Decentralized Social Network',
          tagline: 'Web3 social media without the drama',
          description: 'Building the next generation of social networking on Solana',
          category: 'Technology',
          goal: 10000,
          raised: 3500,
          backers_count: 45,
          status: 'active',
          creator_wallet: 'ABC123',
          creator_name: 'Alice Builder',
          creator_avatar: '/default-avatar.png',
          image_url: '/placeholder-project.png',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'NFT Marketplace for Artists',
          tagline: 'Empowering creators worldwide',
          description: 'A commission-free NFT marketplace built for artists',
          category: 'Art',
          goal: 15000,
          raised: 8200,
          backers_count: 89,
          status: 'active',
          creator_wallet: 'DEF456',
          creator_name: 'Bob Creator',
          creator_avatar: '/default-avatar.png',
          image_url: '/placeholder-project.png',
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        },
      ]
      
      projects = mockProjects.filter(p => !status || p.status === status)
      count = projects.length
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
    const body = await request.json()
    
    const {
      title,
      description,
      category,
      goal,
      deadline,
      creator_wallet,
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

    // Insert project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        category,
        goal,
        deadline,
        creator_wallet,
        image_url,
        video_url,
        status: 'queue', // New projects go to queue for admin approval
        raised: 0,
        backers_count: 0
      })
      .select()
      .single()

    if (projectError) {
      console.error('Failed to create project:', projectError)
      return NextResponse.json(
        { error: 'Failed to create project', details: projectError.message },
        { status: 500 }
      )
    }

    // Insert milestones if provided
    if (milestones && milestones.length > 0) {
      const milestonesWithProjectId = milestones.map((m: any) => ({
        ...m,
        project_id: project.id,
        status: 'pending'
      }))

      const { error: milestonesError } = await supabase
        .from('milestones')
        .insert(milestonesWithProjectId)

      if (milestonesError) {
        console.error('Failed to create milestones:', milestonesError)
        // Don't fail the request, just log it
      }
    }

    return NextResponse.json({
      success: true,
      project,
      message: 'Project created successfully! It will be reviewed by admins.'
    }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
      .select('*, users!projects_creator_wallet_fkey(name, avatar_url)', { count: 'exact' })

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

    const { data: projects, error, count } = await query

    if (error) {
      console.error('Failed to fetch projects:', error)
      return NextResponse.json(
        { error: 'Failed to fetch projects', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      projects: projects || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
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

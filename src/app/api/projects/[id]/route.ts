import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// Mock projects for development (must match IDs from /api/projects)
const mockProjects: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Decentralized Social Network',
    tagline: 'Web3 social media without the drama',
    description: 'Building the next generation of social networking on Solana. We\'re creating a platform where users truly own their content, connections, and data. No algorithms manipulating your feed, no selling your information to advertisers. Just pure, decentralized social interaction.\n\nOur platform leverages Solana\'s high-speed, low-cost transactions to enable seamless tipping, NFT sharing, and token-gated communities. Join us in building the future of social media.',
    problem: 'Current social media platforms exploit user data, manipulate feeds with algorithms, and give creators a tiny fraction of the value they generate.',
    solution: 'A fully decentralized social network where users own their data, creators keep 95% of earnings, and communities govern themselves through DAOs.',
    category: 'Technology',
    goal: 10000,
    raised: 3500,
    backers_count: 45,
    status: 'active',
    creator_wallet: '4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw',
    creator_name: 'Alice Builder',
    creator_avatar: null,
    image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    video_url: null,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    views_count: 1250,
    milestones: [
      { id: 'm1', title: 'MVP Launch', description: 'Launch basic social features', percentage: 30, status: 'active', deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'm2', title: 'Token Integration', description: 'Add native token for tipping', percentage: 40, status: 'locked', deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'm3', title: 'Mobile Apps', description: 'iOS and Android apps', percentage: 30, status: 'locked', deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    updates: [
      { id: 'u1', title: 'Development Update', content: 'We\'ve completed the smart contract audit!', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    backers: [],
  },
  '2': {
    id: '2',
    title: 'NFT Marketplace for Artists',
    tagline: 'Empowering creators worldwide',
    description: 'A commission-free NFT marketplace built specifically for artists. We believe creators deserve to keep what they earn. Our platform charges 0% commission on primary sales and only 1% on secondary sales - the lowest in the industry.\n\nFeatures include collaborative collections, royalty splits, and built-in portfolio tools. We\'re building the home for digital art.',
    problem: 'Existing NFT marketplaces charge 5-15% fees, making it hard for emerging artists to profit from their work.',
    solution: 'Zero-fee primary sales, 1% secondary fees, and tools designed by artists for artists.',
    category: 'Art & Design',
    goal: 15000,
    raised: 8200,
    backers_count: 89,
    status: 'active',
    creator_wallet: 'DEF456xyz',
    creator_name: 'Bob Creator',
    creator_avatar: null,
    image_url: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=800',
    video_url: null,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    views_count: 2100,
    milestones: [
      { id: 'm1', title: 'Platform Beta', description: 'Launch invite-only beta', percentage: 50, status: 'completed', deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'm2', title: 'Public Launch', description: 'Open to all creators', percentage: 50, status: 'active', deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    updates: [],
    backers: [],
  },
  '3': {
    id: '3',
    title: 'Eco-Friendly Smart Gardens',
    tagline: 'Grow organic food at home',
    description: 'IoT-powered indoor garden system for urban dwellers. Our smart garden uses 90% less water than traditional gardening and can grow fresh vegetables year-round, regardless of weather or living space.\n\nThe companion app tracks plant health, automates watering and lighting, and even suggests recipes based on what\'s ready to harvest.',
    problem: 'Urban dwellers lack space and knowledge to grow fresh, organic produce at home.',
    solution: 'Compact, automated indoor gardens with AI-powered plant care and community recipe sharing.',
    category: 'Social Impact',
    goal: 8000,
    raised: 4200,
    backers_count: 67,
    status: 'active',
    creator_wallet: 'GHI789abc',
    creator_name: 'Charlie Green',
    creator_avatar: null,
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    video_url: null,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    views_count: 890,
    milestones: [
      { id: 'm1', title: 'Prototype', description: 'Working hardware prototype', percentage: 40, status: 'active', deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'm2', title: 'App Development', description: 'Companion mobile app', percentage: 30, status: 'locked', deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'm3', title: 'Production', description: 'First production run', percentage: 30, status: 'locked', deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    updates: [],
    backers: [],
  },
  '4': {
    id: '4',
    title: 'DeFi Education Platform',
    tagline: 'Learn crypto, earn rewards',
    description: 'Interactive courses teaching DeFi, blockchain, and Web3 development. Our learn-to-earn model rewards students for completing courses and passing assessments.\n\nCurriculum designed by industry experts covers everything from basics to advanced smart contract development.',
    problem: 'Crypto education is fragmented, outdated, and doesn\'t incentivize completion.',
    solution: 'Comprehensive, up-to-date courses with token rewards for learning milestones.',
    category: 'Innovation',
    goal: 12000,
    raised: 12000,
    backers_count: 156,
    status: 'funded',
    creator_wallet: 'JKL012def',
    creator_name: 'Diana Teacher',
    creator_avatar: null,
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    video_url: null,
    deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    views_count: 3200,
    milestones: [
      { id: 'm1', title: 'Course Content', description: 'Create first 10 courses', percentage: 50, status: 'completed', deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'm2', title: 'Platform Launch', description: 'Deploy learning platform', percentage: 50, status: 'active', deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    updates: [
      { id: 'u1', title: 'Fully Funded!', content: 'We reached our goal! Thank you to all backers.', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    backers: [],
  },
  '5': {
    id: '5',
    title: 'Community Health Initiative',
    tagline: 'Healthcare for everyone',
    description: 'Mobile health clinics serving underserved communities. We bring free checkups, basic medicine, and health education to areas that need it most.\n\nOur fleet of solar-powered mobile clinics can reach remote areas and provide essential healthcare services.',
    problem: 'Millions lack access to basic healthcare, especially in rural and underserved areas.',
    solution: 'Mobile clinics with telehealth capabilities, bringing doctors to patients who can\'t reach hospitals.',
    category: 'Health & Wellness',
    goal: 20000,
    raised: 22500,
    backers_count: 234,
    status: 'completed',
    creator_wallet: 'MNO345ghi',
    creator_name: 'Dr. Evan Health',
    creator_avatar: null,
    image_url: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800',
    video_url: null,
    deadline: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    views_count: 4500,
    milestones: [
      { id: 'm1', title: 'First Clinic', description: 'Purchase and outfit first mobile clinic', percentage: 50, status: 'completed', deadline: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'm2', title: 'Launch Services', description: 'Begin community health services', percentage: 50, status: 'completed', deadline: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    updates: [
      { id: 'u1', title: 'Mission Accomplished', content: 'First clinic now serving 500+ patients monthly!', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    backers: [],
  },
  '6': {
    id: '6',
    title: 'Indie Game: Space Quest',
    tagline: 'Explore the cosmos',
    description: 'Open-world space exploration game with NFT collectibles. Build your spaceship, discover new worlds, and trade rare artifacts.\n\nFeaturing procedurally generated galaxies, multiplayer trading hubs, and player-owned space stations.',
    problem: 'Space games are either too complex or too shallow, with no true ownership of in-game assets.',
    solution: 'Accessible yet deep space exploration with real NFT ownership of ships, planets, and artifacts.',
    category: 'Gaming',
    goal: 25000,
    raised: 5600,
    backers_count: 78,
    status: 'active',
    creator_wallet: 'PQR678jkl',
    creator_name: 'Frank Developer',
    creator_avatar: null,
    image_url: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800',
    video_url: null,
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    views_count: 1800,
    milestones: [
      { id: 'm1', title: 'Alpha Demo', description: 'Playable alpha with core mechanics', percentage: 30, status: 'active', deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'm2', title: 'NFT Integration', description: 'Ship and artifact NFTs', percentage: 30, status: 'locked', deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'm3', title: 'Full Release', description: 'Complete game launch', percentage: 40, status: 'locked', deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    updates: [],
    backers: [],
  },
}

// GET /api/projects/[id] - Get single project with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient()
    const { id } = await params

    // Use mock data if Supabase is not available
    if (!supabase) {
      console.log('Using mock data for project:', id)
      const mockProject = mockProjects[id]
      
      if (!mockProject) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(mockProject)
    }

    // Fetch project (without join - schema may not have the foreign key)
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (projectError || !project) {
      console.error('Project fetch error:', projectError)
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Fetch milestones
    const { data: milestones } = await supabase
      .from('milestones')
      .select('*')
      .eq('project_id', id)
      .order('order', { ascending: true })

    // Fetch project updates
    const { data: updates } = await supabase
      .from('project_updates')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Fetch backers count and recent backers
    const { data: backers } = await supabase
      .from('backers')
      .select('wallet_address, amount, created_at')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Increment view count (async, don't wait)
    void supabase
      .from('projects')
      .update({ views_count: (project.views_count || 0) + 1 })
      .eq('id', id)

    return NextResponse.json({
      ...project,
      milestones: milestones || [],
      updates: updates || [],
      backers: backers || [],
      creator: project.users || null
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/[id] - Update project (for creators)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient()
    const { id } = await params
    const body = await request.json()
    
    const {
      title,
      description,
      category,
      goal,
      deadline,
      image_url,
      video_url,
      wallet_address // For authorization
    } = body

    if (!wallet_address) {
      return NextResponse.json(
        { error: 'Wallet address required for authorization' },
        { status: 401 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Verify ownership
    const { data: project } = await supabase
      .from('projects')
      .select('creator_wallet, status')
      .eq('id', id)
      .single()

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.creator_wallet !== wallet_address) {
      return NextResponse.json(
        { error: 'Unauthorized: You are not the creator of this project' },
        { status: 403 }
      )
    }

    // Only allow editing if status is draft or queue
    if (!['draft', 'queue'].includes(project.status)) {
      return NextResponse.json(
        { error: 'Cannot edit project after it has been published' },
        { status: 400 }
      )
    }

    // Update project
    const updates: any = {}
    if (title) updates.title = title
    if (description) updates.description = description
    if (category) updates.category = category
    if (goal) updates.goal = goal
    if (deadline) updates.deadline = deadline
    if (image_url) updates.image_url = image_url
    if (video_url) updates.video_url = video_url

    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update project:', updateError)
      return NextResponse.json(
        { error: 'Failed to update project', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      project: updatedProject,
      message: 'Project updated successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project (for creators/admins)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient()
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const wallet_address = searchParams.get('wallet')

    if (!wallet_address) {
      return NextResponse.json(
        { error: 'Wallet address required for authorization' },
        { status: 401 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Verify ownership
    const { data: project } = await supabase
      .from('projects')
      .select('creator_wallet, status')
      .eq('id', id)
      .single()

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.creator_wallet !== wallet_address) {
      return NextResponse.json(
        { error: 'Unauthorized: You are not the creator of this project' },
        { status: 403 }
      )
    }

    // Only allow deletion if status is draft or queue
    if (!['draft', 'queue'].includes(project.status)) {
      return NextResponse.json(
        { error: 'Cannot delete project after it has been published' },
        { status: 400 }
      )
    }

    // Delete project (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Failed to delete project:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete project', details: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

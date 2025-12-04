import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/creator/milestones - Fetch all milestones for creator's projects
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const walletAddress = searchParams.get("wallet")
  const status = searchParams.get("status")

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    // First, get all projects owned by this creator
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("id, title")
      .eq("creator_wallet", walletAddress)

    if (projectsError) {
      console.error("Error fetching projects:", projectsError)
      return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }

    if (!projects || projects.length === 0) {
      return NextResponse.json({
        milestones: [],
        stats: {
          total: 0,
          completed: 0,
          in_review: 0,
          active: 0,
          upcoming: 0,
        },
      })
    }

    const projectIds = projects.map((p) => p.id)
    const projectMap = new Map(projects.map((p) => [p.id, p.title]))

    // Fetch milestones for these projects
    let query = supabase
      .from("milestones")
      .select("*")
      .in("project_id", projectIds)
      .order("deadline", { ascending: true })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data: milestones, error: milestonesError } = await query

    if (milestonesError) {
      console.error("Error fetching milestones:", milestonesError)
      return NextResponse.json({ error: "Failed to fetch milestones" }, { status: 500 })
    }

    // Calculate stats
    const stats = {
      total: milestones?.length || 0,
      completed: milestones?.filter((m) => m.status === "completed" || m.status === "approved").length || 0,
      in_review: milestones?.filter((m) => m.status === "in_review" || m.status === "pending_review").length || 0,
      active: milestones?.filter((m) => m.status === "active").length || 0,
      upcoming: milestones?.filter((m) => m.status === "pending" || m.status === "not_started").length || 0,
    }

    // Transform milestones for response
    const transformedMilestones = (milestones || []).map((milestone) => ({
      id: milestone.id,
      project_id: milestone.project_id,
      project_title: projectMap.get(milestone.project_id) || "Unknown Project",
      title: milestone.title,
      description: milestone.description,
      deadline: milestone.deadline,
      percentage: milestone.percentage,
      amount: milestone.amount,
      status: milestone.status,
      proof_url: milestone.proof_url,
      proof_description: milestone.proof_description,
      submitted_at: milestone.submitted_at,
      reviewed_at: milestone.reviewed_at,
      created_at: milestone.created_at,
    }))

    return NextResponse.json({
      milestones: transformedMilestones,
      stats,
    })
  } catch (error) {
    console.error("Error in creator milestones API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

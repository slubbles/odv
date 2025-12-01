import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/admin/milestones - Fetch all milestones with stats
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") // pending-review, overdue, on-track, approved, rejected
  const limit = parseInt(searchParams.get("limit") || "50")
  const offset = parseInt(searchParams.get("offset") || "0")

  try {
    const supabase = await createClient()

    // Build query for milestones
    let query = supabase
      .from("milestones")
      .select(
        `
        id,
        project_id,
        title,
        description,
        due_date,
        status,
        evidence_url,
        evidence_submitted,
        votes_approve,
        votes_reject,
        created_at,
        updated_at,
        projects (
          id,
          title,
          creator_id,
          creator_name
        )
      `,
        { count: "exact" }
      )
      .order("due_date", { ascending: true })
      .range(offset, offset + limit - 1)

    // Apply status filter if provided
    if (status) {
      query = query.eq("status", status)
    }

    const { data: milestones, error, count } = await query

    if (error) {
      console.error("Error fetching milestones:", error)
      return NextResponse.json({ error: "Failed to fetch milestones" }, { status: 500 })
    }

    // Fetch stats
    const { data: stats } = await supabase.rpc("get_milestone_stats")

    // If no RPC function, calculate stats manually
    let milestoneStats = stats
    if (!stats) {
      const { data: allMilestones } = await supabase.from("milestones").select("status")

      milestoneStats = {
        pending_review: allMilestones?.filter((m) => m.status === "pending-review").length || 0,
        overdue: allMilestones?.filter((m) => m.status === "overdue").length || 0,
        on_track: allMilestones?.filter((m) => m.status === "on-track").length || 0,
        approved: allMilestones?.filter((m) => m.status === "approved").length || 0,
        rejected: allMilestones?.filter((m) => m.status === "rejected").length || 0,
      }
    }

    // Transform milestones for response
    const transformedMilestones = (milestones || []).map((milestone: any) => ({
      id: milestone.id,
      project_id: milestone.project_id,
      project_title: milestone.projects?.title || "Unknown Project",
      title: milestone.title,
      description: milestone.description,
      due_date: milestone.due_date,
      status: milestone.status,
      evidence_url: milestone.evidence_url,
      evidence_submitted: milestone.evidence_submitted,
      votes: {
        approve: milestone.votes_approve || 0,
        reject: milestone.votes_reject || 0,
      },
      created_at: milestone.created_at,
      updated_at: milestone.updated_at,
    }))

    return NextResponse.json({
      milestones: transformedMilestones,
      stats: milestoneStats,
      total: count || 0,
    })
  } catch (error) {
    console.error("Error in milestones API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/admin/milestones - Update milestone status (approve/reject)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { milestone_id, action, admin_wallet } = body

    if (!milestone_id || !action || !admin_wallet) {
      return NextResponse.json({ error: "Missing required fields: milestone_id, action, admin_wallet" }, { status: 400 })
    }

    if (!["approve", "reject", "reset"].includes(action)) {
      return NextResponse.json({ error: "Invalid action. Must be approve, reject, or reset" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify admin status (in production, check against admin list)
    // For now, we'll allow any connected wallet

    // Get current milestone
    const { data: milestone, error: fetchError } = await supabase
      .from("milestones")
      .select("*")
      .eq("id", milestone_id)
      .single()

    if (fetchError || !milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 })
    }

    // Determine new status
    let newStatus = milestone.status
    let updateData: any = {}

    if (action === "approve") {
      updateData = {
        status: "approved",
        votes_approve: (milestone.votes_approve || 0) + 1,
        updated_at: new Date().toISOString(),
      }
    } else if (action === "reject") {
      updateData = {
        status: "rejected",
        votes_reject: (milestone.votes_reject || 0) + 1,
        updated_at: new Date().toISOString(),
      }
    } else if (action === "reset") {
      updateData = {
        status: "pending-review",
        votes_approve: 0,
        votes_reject: 0,
        updated_at: new Date().toISOString(),
      }
    }

    // Update milestone
    const { data: updatedMilestone, error: updateError } = await supabase
      .from("milestones")
      .update(updateData)
      .eq("id", milestone_id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating milestone:", updateError)
      return NextResponse.json({ error: "Failed to update milestone" }, { status: 500 })
    }

    // Log admin action
    await supabase.from("admin_actions").insert({
      admin_wallet,
      action_type: `milestone_${action}`,
      target_id: milestone_id,
      target_type: "milestone",
      metadata: { previous_status: milestone.status, new_status: updateData.status },
    })

    return NextResponse.json({
      success: true,
      milestone: updatedMilestone,
    })
  } catch (error) {
    console.error("Error in milestone PATCH:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

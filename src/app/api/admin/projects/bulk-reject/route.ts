import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { projectIds, reason } = await request.json()

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json({ error: "Invalid project IDs" }, { status: 400 })
    }

    if (!reason || typeof reason !== "string") {
      return NextResponse.json({ error: "Rejection reason required" }, { status: 400 })
    }

    // Check if Supabase is configured (mock check)
    const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

    if (isMockMode) {
      const { mockDb } = await import("@/lib/mock-db")
      const projects = mockDb.bulkUpdateStatus(projectIds, 'rejected', reason)
      return NextResponse.json({ success: true, count: projects.length })
    }

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update all projects to rejected status
    const { error } = await supabase
      .from("projects")
      .update({
        status: "rejected",
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .in("id", projectIds)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log admin action
    await supabase.from("admin_logs").insert(
      projectIds.map((id) => ({
        admin_id: user.id,
        action: "bulk_reject",
        project_id: id,
        details: reason,
        created_at: new Date().toISOString(),
      }))
    )

    return NextResponse.json({ success: true, count: projectIds.length })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

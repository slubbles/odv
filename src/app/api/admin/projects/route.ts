import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const statusParam = searchParams.get("status") || "pending"
    const category = searchParams.get("category")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const sort = searchParams.get("sort") || "newest"

    // Map UI status names to database status values
    // UI uses "pending" but database uses "queue" for pending projects
    const statusMap: Record<string, string> = {
      pending: "queue",
      approved: "active",
      rejected: "rejected",
    }
    const dbStatus = statusMap[statusParam] || statusParam

    let query = supabase
      .from("projects")
      .select("id, title, creator_wallet, category, backers_count, raised, status, goal, deadline, created_at, updated_at")
      .eq("status", dbStatus)

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (dateFrom) {
      query = query.gte("created_at", dateFrom)
    }

    if (dateTo) {
      query = query.lte("created_at", dateTo)
    }

    // Apply sorting
    switch (sort) {
      case "oldest":
        query = query.order("created_at", { ascending: true })
        break
      case "most_voted":
      case "most_backers":
        query = query.order("backers_count", { ascending: false })
        break
      case "least_voted":
      case "least_backers":
        query = query.order("backers_count", { ascending: true })
        break
      case "newest":
      default:
        query = query.order("created_at", { ascending: false })
        break
    }

    const { data: projects, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map database fields to UI expected format
    // UI expects: votes, creator, submittedDate, status (pending/approved/rejected)
    const reverseStatusMap: Record<string, string> = {
      queue: "pending",
      active: "approved",
      rejected: "rejected",
    }

    const mappedProjects = (projects || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      creator: p.creator_wallet,
      creator_wallet: p.creator_wallet,
      category: p.category,
      votes: p.backers_count || 0,
      goal: p.goal,
      deadline: p.deadline,
      submittedDate: p.created_at,
      status: reverseStatusMap[p.status] || p.status,
    }))

    return NextResponse.json({ projects: mappedProjects })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

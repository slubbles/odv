import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const status = searchParams.get("status") || "pending"
    const category = searchParams.get("category")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const sort = searchParams.get("sort") || "newest"

    let query = supabase
      .from("projects")
      .select("id, title, creator_id, category, community_votes, status, created_at, updated_at")
      .eq("status", status)

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
        query = query.order("community_votes", { ascending: false })
        break
      case "least_voted":
        query = query.order("community_votes", { ascending: true })
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

    return NextResponse.json({ projects })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

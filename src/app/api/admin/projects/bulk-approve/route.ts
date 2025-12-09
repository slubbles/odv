import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdminRequest } from '@/lib/auth/admin-api'

export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const walletAddress = request.headers.get('x-wallet-address')
    if (!isAdminRequest(walletAddress)) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    const supabase = await createClient()
    const { projectIds } = await request.json()

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json({ error: "Invalid project IDs" }, { status: 400 })
    }

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Update all projects to active status
    const { error } = await supabase
      .from("projects")
      .update({ status: "active", updated_at: new Date().toISOString() })
      .in("id", projectIds)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: projectIds.length })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

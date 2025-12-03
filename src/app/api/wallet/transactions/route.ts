import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Mock transactions for development
const getMockTransactions = (wallet: string) => {
  // Return empty transactions in mock mode
  return {
    transactions: [],
    stats: {
      total_backed: 0,
      projects_backed: 0,
      transaction_count: 0,
    },
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get("wallet")

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
  }

  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured - returning mock wallet transactions")
    return NextResponse.json(getMockTransactions(wallet))
  }

  try {
    const supabase = await createClient()

    // Fetch all backings for this wallet
    const { data: backings, error } = await supabase
      .from("backers")
      .select(
        `
        id,
        project_id,
        amount,
        transaction_signature,
        created_at,
        projects (
          id,
          title
        )
      `
      )
      .eq("wallet_address", wallet)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching transactions:", error)
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }

    // Transform data for response
    const transactions = (backings || []).map((backing: any) => ({
      id: backing.id,
      project_id: backing.project_id,
      project_title: backing.projects?.title || "Unknown Project",
      amount: backing.amount,
      transaction_signature: backing.transaction_signature,
      created_at: backing.created_at,
    }))

    // Calculate stats
    const totalBacked = transactions.reduce((sum: number, tx: any) => sum + tx.amount, 0)
    const projectsBacked = new Set(transactions.map((tx: any) => tx.project_id)).size

    return NextResponse.json({
      transactions,
      stats: {
        total_backed: totalBacked,
        projects_backed: projectsBacked,
        transaction_count: transactions.length,
      },
    })
  } catch (error) {
    console.error("Error fetching wallet transactions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

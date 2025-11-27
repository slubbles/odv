"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wallet, ArrowDownToLine, CheckCircle, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"

interface WithdrawalHistory {
  id: string
  amount: number
  transaction_signature: string
  status: "pending" | "completed" | "failed"
  created_at: string
}

interface WithdrawFundsModalProps {
  projectId?: string
  projectTitle?: string
  availableBalance: number
  pendingWithdrawals?: WithdrawalHistory[]
  onSuccess?: () => void
  children?: React.ReactNode
}

export function WithdrawFundsModal({
  projectId,
  projectTitle,
  availableBalance,
  pendingWithdrawals = [],
  onSuccess,
  children,
}: WithdrawFundsModalProps) {
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()
  const [isOpen, setIsOpen] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [txSignature, setTxSignature] = useState<string | null>(null)

  const mockWithdrawals: WithdrawalHistory[] = [
    {
      id: "1",
      amount: 5000,
      transaction_signature: "3z9vL8E...6xPqF",
      status: "completed",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      amount: 3200,
      transaction_signature: "5mKp2Y...8qNwT",
      status: "completed",
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const displayWithdrawals = pendingWithdrawals.length > 0 ? pendingWithdrawals : mockWithdrawals

  const handleWithdraw = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet")
      return
    }

    if (availableBalance <= 0) {
      toast.error("No funds available to withdraw")
      return
    }

    setIsWithdrawing(true)

    try {
      // TODO: Replace with actual Solana withdrawal transaction
      // 1. Create withdrawal transaction
      // 2. Sign transaction
      // 3. Send and confirm
      // 4. Record in database
      
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockSignature = `${Math.random().toString(36).substring(7)}...${Math.random().toString(36).substring(7)}`
      setTxSignature(mockSignature)
      setShowSuccess(true)
      toast.success("Withdrawal successful!")

      setTimeout(() => {
        setIsOpen(false)
        setShowSuccess(false)
        setTxSignature(null)
        onSuccess?.()
      }, 3000)
    } catch (error) {
      console.error("Withdrawal failed:", error)
      toast.error("Withdrawal failed. Please try again.")
    } finally {
      setIsWithdrawing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Wallet className="h-4 w-4 mr-2" />
            Withdraw Funds
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Withdraw Earnings</DialogTitle>
          <DialogDescription>
            Transfer your earned funds to your connected wallet
            {projectTitle && ` (${projectTitle})`}
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Withdrawal Successful!</h3>
                  <p className="text-muted-foreground mb-4">
                    ${availableBalance.toLocaleString()} has been transferred to your wallet
                  </p>
                  {txSignature && (
                    <a
                      href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline inline-flex items-center gap-1"
                    >
                      View on Solana Explorer <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Available Balance */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Available to Withdraw</p>
                  <p className="text-4xl font-bold mb-4">${availableBalance.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    Funds will be sent to: {publicKey?.toString().slice(0, 8)}...
                    {publicKey?.toString().slice(-6)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Info */}
            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-sm">Important Information</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Withdrawals are processed instantly on the Solana blockchain</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>A small network fee (~$0.000005 SOL) will be deducted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Funds can only be withdrawn to your connected wallet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Completed milestones must be approved before funds are available</span>
                </li>
              </ul>
            </div>

            {/* Withdrawal History */}
            {displayWithdrawals.length > 0 && (
              <>
                <div className="border-t my-4" />
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Recent Withdrawals</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {displayWithdrawals.slice(0, 5).map((withdrawal) => (
                      <div key={withdrawal.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex-1">
                          <p className="font-semibold">${withdrawal.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(withdrawal.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          className={
                            withdrawal.status === "completed"
                              ? "bg-green-500/20 text-green-500 border-green-500/30"
                              : withdrawal.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                                : "bg-red-500/20 text-red-500 border-red-500/30"
                          }
                        >
                          {withdrawal.status}
                        </Badge>
                        {withdrawal.status === "completed" && (
                          <a
                            href={`https://explorer.solana.com/tx/${withdrawal.transaction_signature}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-accent hover:text-accent/80"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Action Button */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                onClick={handleWithdraw}
                disabled={isWithdrawing || availableBalance <= 0}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isWithdrawing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowDownToLine className="h-4 w-4 mr-2" />
                    Withdraw ${availableBalance.toLocaleString()}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isWithdrawing}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

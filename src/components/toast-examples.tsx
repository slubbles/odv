"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toastSuccess, toastError, toastWarning, toastInfo, toastSpecial } from "@/lib/toast-notifications"

export function ToastExamples() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Success Toasts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => toastSuccess.projectBacked("AI Recipe App", 1)} variant="outline">
            Project Backed
          </Button>
          <Button onClick={() => toastSuccess.projectCreated("My Cool App")} variant="outline">
            Project Created
          </Button>
          <Button onClick={() => toastSuccess.projectApproved("My Cool App")} variant="outline">
            Project Approved
          </Button>
          <Button onClick={() => toastSuccess.milestoneCompleted("MVP Launch")} variant="outline">
            Milestone Complete
          </Button>
          <Button onClick={() => toastSuccess.profileUpdated()} variant="outline">
            Profile Updated
          </Button>
          <Button onClick={() => toastSuccess.walletConnected("0x1234...5678")} variant="outline">
            Wallet Connected
          </Button>
          <Button onClick={() => toastSuccess.fundingGoalReached("My Project", 10000)} variant="outline">
            Funding Goal
          </Button>
          <Button onClick={() => toastSuccess.voteSubmitted()} variant="outline">
            Vote Submitted
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Toasts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => toastError.backingFailed()} variant="outline">
            Backing Failed
          </Button>
          <Button onClick={() => toastError.walletConnectionFailed()} variant="outline">
            Wallet Failed
          </Button>
          <Button onClick={() => toastError.insufficientFunds()} variant="outline">
            Insufficient Funds
          </Button>
          <Button onClick={() => toastError.validationFailed("Title is too short")} variant="outline">
            Validation Error
          </Button>
          <Button onClick={() => toastError.uploadFailed()} variant="outline">
            Upload Failed
          </Button>
          <Button onClick={() => toastError.unauthorized()} variant="outline">
            Unauthorized
          </Button>
          <Button onClick={() => toastError.networkError()} variant="outline">
            Network Error
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Warning Toasts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => toastWarning.projectPending()} variant="outline">
            Pending Review
          </Button>
          <Button onClick={() => toastWarning.milestoneOverdue("Beta Release", 5)} variant="outline">
            Milestone Overdue
          </Button>
          <Button onClick={() => toastWarning.lowBalance()} variant="outline">
            Low Balance
          </Button>
          <Button onClick={() => toastWarning.unsavedChanges()} variant="outline">
            Unsaved Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Info Toasts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => toastInfo.copied()} variant="outline">
            Copied
          </Button>
          <Button onClick={() => toastInfo.projectShared("Twitter")} variant="outline">
            Shared
          </Button>
          <Button onClick={() => toastInfo.loading()} variant="outline">
            Loading
          </Button>
          <Button onClick={() => toastInfo.queued(12)} variant="outline">
            Queued
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Special Toasts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => toastSpecial.welcomeBack("Alex")} variant="outline">
            Welcome Back
          </Button>
          <Button onClick={() => toastSpecial.firstBacking()} variant="outline">
            First Backing
          </Button>
          <Button onClick={() => toastSpecial.achievementUnlocked("10 Projects Backed")} variant="outline">
            Achievement
          </Button>
          <Button onClick={() => toastSpecial.streakMaintained(7)} variant="outline">
            Streak
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

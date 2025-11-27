import { toast } from "@/components/ui/use-toast"

// Success toast patterns
export const toastSuccess = {
  projectBacked: (projectName: string, amount: number) => {
    toast({
      title: "Backed!",
      description: `You just backed "${projectName}" with $${amount}. You're a legend.`,
      variant: "default",
      className: "border-green-500",
    })
  },

  projectCreated: (projectName: string) => {
    toast({
      title: "Project Submitted",
      description: `"${projectName}" is in the queue. Now we review it.`,
      variant: "default",
    })
  },

  projectApproved: (projectName: string) => {
    toast({
      title: "Approved!",
      description: `"${projectName}" is live. Go get those backers.`,
      variant: "default",
      className: "border-green-500",
    })
  },

  milestoneCompleted: (milestoneName: string) => {
    toast({
      title: "Milestone Shipped",
      description: `"${milestoneName}" marked complete. Keep building.`,
      variant: "default",
      className: "border-green-500",
    })
  },

  profileUpdated: () => {
    toast({
      title: "Saved",
      description: "Your profile is updated.",
      variant: "default",
    })
  },

  walletConnected: (address: string) => {
    toast({
      title: "Wallet Connected",
      description: `${address.slice(0, 6)}...${address.slice(-4)} is ready to go.`,
      variant: "default",
      className: "border-green-500",
    })
  },

  fundingGoalReached: (projectName: string, amount: number) => {
    toast({
      title: "Funding Complete!",
      description: `"${projectName}" hit $${amount}. Time to ship.`,
      variant: "default",
      className: "border-green-500",
      duration: 5000,
    })
  },

  voteSubmitted: () => {
    toast({
      title: "Vote Counted",
      description: "Your vote matters. Thanks for participating.",
      variant: "default",
    })
  },
}

// Error toast patterns
export const toastError = {
  backingFailed: (reason?: string) => {
    toast({
      title: "Backing Failed",
      description: reason || "Something went wrong. Try again.",
      variant: "destructive",
    })
  },

  walletConnectionFailed: () => {
    toast({
      title: "Connection Failed",
      description: "Could not connect wallet. Check your extension.",
      variant: "destructive",
    })
  },

  insufficientFunds: () => {
    toast({
      title: "Not Enough Funds",
      description: "Your wallet needs more for this transaction.",
      variant: "destructive",
    })
  },

  validationFailed: (message: string) => {
    toast({
      title: "Hold Up",
      description: message,
      variant: "destructive",
    })
  },

  uploadFailed: () => {
    toast({
      title: "Upload Failed",
      description: "Could not upload file. Try a smaller one.",
      variant: "destructive",
    })
  },

  unauthorized: () => {
    toast({
      title: "Not Allowed",
      description: "You don't have permission for that.",
      variant: "destructive",
    })
  },

  networkError: () => {
    toast({
      title: "Network Error",
      description: "Connection lost. Check your internet.",
      variant: "destructive",
    })
  },
}

// Warning toast patterns
export const toastWarning = {
  projectPending: () => {
    toast({
      title: "Still in Review",
      description: "Your project is being reviewed. Hang tight.",
      className: "border-amber-500",
    })
  },

  milestoneOverdue: (milestoneName: string, daysOverdue: number) => {
    toast({
      title: "Milestone Overdue",
      description: `"${milestoneName}" is ${daysOverdue} days late. Backers are watching.`,
      className: "border-amber-500",
      duration: 5000,
    })
  },

  lowBalance: () => {
    toast({
      title: "Low Balance",
      description: "You might not have enough for fees. Top up your wallet.",
      className: "border-amber-500",
    })
  },

  unsavedChanges: () => {
    toast({
      title: "Unsaved Changes",
      description: "You have unsaved changes. Save before leaving.",
      className: "border-amber-500",
    })
  },
}

// Info toast patterns
export const toastInfo = {
  copied: (text = "Link") => {
    toast({
      title: "Copied",
      description: `${text} copied to clipboard.`,
      duration: 2000,
    })
  },

  projectShared: (platform: string) => {
    toast({
      title: "Shared",
      description: `Project shared to ${platform}.`,
      duration: 2000,
    })
  },

  loading: (message = "Processing...") => {
    toast({
      title: message,
      description: "This might take a moment.",
    })
  },

  queued: (position: number) => {
    toast({
      title: "In Queue",
      description: `You're #${position}. We'll get to you soon.`,
      duration: 4000,
    })
  },
}

// Special toast patterns
export const toastSpecial = {
  welcomeBack: (username: string) => {
    toast({
      title: `Welcome back, ${username}`,
      description: "Ready to back some projects?",
      duration: 3000,
    })
  },

  firstBacking: () => {
    toast({
      title: "First Backing!",
      description: "You just made someone's day. Keep going.",
      duration: 4000,
      className: "border-accent",
    })
  },

  achievementUnlocked: (achievement: string) => {
    toast({
      title: "Achievement Unlocked",
      description: achievement,
      duration: 5000,
      className: "border-accent",
    })
  },

  streakMaintained: (days: number) => {
    toast({
      title: `${days} Day Streak!`,
      description: "You're on fire. Keep backing builders.",
      duration: 4000,
      className: "border-accent",
    })
  },
}

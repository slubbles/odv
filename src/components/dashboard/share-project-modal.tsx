"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Copy, Share2, Twitter, MessageCircle } from "lucide-react"
import { useState } from "react"
import QRCode from "react-qr-code"

interface ShareProjectModalProps {
    isOpen: boolean
    onClose: () => void
    projectId: string
    projectTitle: string
}

export function ShareProjectModal({ isOpen, onClose, projectId, projectTitle }: ShareProjectModalProps) {
    const projectUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/projects/${projectId}`
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(projectUrl)
            setCopied(true)
            toast.success("Link copied to clipboard!")
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error("Failed to copy link")
        }
    }

    const shareToTwitter = () => {
        const text = `Check out "${projectTitle}" on OneDollarVentures! Back for just $1 USDC 🚀`
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(projectUrl)}`
        window.open(url, '_blank')
    }

    const shareToTelegram = () => {
        const text = `Check out "${projectTitle}" on OneDollarVentures!`
        const url = `https://t.me/share/url?url=${encodeURIComponent(projectUrl)}&text=${encodeURIComponent(text)}`
        window.open(url, '_blank')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Project</DialogTitle>
                    <DialogDescription>
                        Share {projectTitle} with your network
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Link Copy */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Project Link</label>
                        <div className="flex gap-2">
                            <Input
                                value={projectUrl}
                                readOnly
                                className="flex-1"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={copyToClipboard}
                            >
                                {copied ? (
                                    <span className="text-green-600">✓</span>
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Social Share Buttons */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Share on Social</label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={shareToTwitter}
                            >
                                <Twitter className="mr-2 h-4 w-4" />
                                Twitter
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={shareToTelegram}
                            >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Telegram
                            </Button>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">QR Code</label>
                        <div className="flex justify-center p-4 bg-white rounded-lg">
                            <QRCode value={projectUrl} size={200} />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                            Scan to view project on mobile
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

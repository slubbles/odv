"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CheckCircle2, XCircle, Clock, TrendingUp, Users, Shield, Filter } from "lucide-react"
import { Footer } from "@/components/footer"
import { useAdminQueue } from "@/lib/hooks/use-admin-queue"
import { LoadingSpinner } from "@/components/loading-spinner"
import { RejectProjectDialog } from "@/components/reject-project-dialog"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function AdminPage() {
  const {
    projects,
    loading,
    selectedIds,
    filters,
    sortBy,
    fetchProjects,
    approveProject,
    bulkApprove,
    bulkReject,
    toggleSelection,
    selectAll,
    clearSelection,
    setFilters,
    setSortBy,
  } = useAdminQueue()

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [bulkRejectDialogOpen, setBulkRejectDialogOpen] = useState(false)
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [filters, sortBy, fetchProjects])

  const handleApprove = async (projectId: string) => {
    await approveProject(projectId)
  }

  const handleReject = (projectId: string) => {
    setCurrentProjectId(projectId)
    setRejectDialogOpen(true)
  }

  const handleBulkApprove = async () => {
    await bulkApprove(Array.from(selectedIds))
  }

  const handleBulkReject = () => {
    setBulkRejectDialogOpen(true)
  }

  const pendingCount = projects.filter((p) => p.status === "pending").length
  const approvedCount = projects.filter((p) => p.status === "approved").length
  const rejectedCount = projects.filter((p) => p.status === "rejected").length
  const approvalRate = projects.length > 0 ? Math.round((approvedCount / (approvedCount + rejectedCount || 1)) * 100) : 0

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto py-12 flex-1">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-accent" />
            <Badge className="bg-accent/20 text-accent-foreground border-accent/30">Admin Panel</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gatekeeper</h1>
          <p className="text-xl text-muted-foreground">The community votes. You decide who ships.</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Waiting</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                  <p className="text-sm text-muted-foreground">Let Through</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{rejectedCount}</p>
                  <p className="text-sm text-muted-foreground">Blocked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvalRate}%</p>
                  <p className="text-sm text-muted-foreground">Approval Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Bulk Actions */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({ ...filters, category: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Gaming">Gaming</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Art">Art</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Social Impact">Social Impact</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most_voted">Most Voted</SelectItem>
                <SelectItem value="least_voted">Least Voted</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="From"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-[150px]"
              />
              <Input
                type="date"
                placeholder="To"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-[150px]"
              />
            </div>

            <div className="ml-auto flex gap-2">
              {selectedIds.size > 0 && (
                <>
                  <Badge variant="secondary" className="px-3 py-1">
                    {selectedIds.size} selected
                  </Badge>
                  <Button size="sm" variant="outline" onClick={clearSelection}>
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                    onClick={handleBulkReject}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject All
                  </Button>
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleBulkApprove}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve All
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs
          value={filters.status}
          onValueChange={(value: any) => {
            setFilters({ ...filters, status: value })
            clearSelection()
          }}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={filters.status} className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No projects found</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {filters.status === "pending" && projects.length > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <Checkbox
                      checked={selectedIds.size === projects.length && projects.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          selectAll()
                        } else {
                          clearSelection()
                        }
                      }}
                    />
                    <span className="text-sm text-muted-foreground">Select all</span>
                  </div>
                )}

                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className={cn(
                      "hover:border-accent/50 transition-all",
                      selectedIds.has(project.id) && "border-accent/70 bg-accent/5"
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {filters.status === "pending" && (
                          <div className="pt-1">
                            <Checkbox
                              checked={selectedIds.has(project.id)}
                              onCheckedChange={() => toggleSelection(project.id)}
                            />
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{project.title}</h3>
                            <Badge variant="secondary">{project.category}</Badge>
                            <Badge
                              className={cn(
                                project.status === "pending" &&
                                  "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
                                project.status === "approved" && "bg-green-500/20 text-green-500 border-green-500/30",
                                project.status === "rejected" && "bg-red-500/20 text-red-500 border-red-500/30"
                              )}
                            >
                              {project.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                              {project.status === "approved" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {project.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">by {project.creator}</p>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-accent" />
                              <span className="font-semibold">{project.votes} community votes</span>
                            </div>
                            <span className="text-muted-foreground">
                              {new Date(project.submittedDate).toLocaleDateString()}
                            </span>
                          </div>

                          {project.rejectionReason && (
                            <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                              <p className="text-sm font-semibold text-red-500 mb-1">Rejection Reason:</p>
                              <p className="text-sm text-muted-foreground">{project.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {filters.status === "pending" && (
                        <div className="flex gap-3 pt-4 mt-4 border-t">
                          <Button variant="outline" className="flex-1 bg-transparent">
                            View Full Details
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-500/50 text-red-500 hover:bg-red-500/10 bg-transparent"
                            onClick={() => handleReject(project.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            className="bg-accent text-accent-foreground hover:bg-accent/90"
                            onClick={() => handleApprove(project.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <RejectProjectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        projectId={currentProjectId}
        onConfirm={fetchProjects}
      />

      <RejectProjectDialog
        open={bulkRejectDialogOpen}
        onOpenChange={setBulkRejectDialogOpen}
        projectIds={Array.from(selectedIds)}
        onConfirm={async (reason) => {
          await bulkReject(Array.from(selectedIds), reason)
          setBulkRejectDialogOpen(false)
        }}
      />

      <Footer />
    </div>
  )
}

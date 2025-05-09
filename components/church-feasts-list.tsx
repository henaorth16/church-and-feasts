"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, PencilLine } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Feast {
  id: string
  saintName: string
  commemorationDate: Date
  description?: string | null
}

interface ChurchFeast {
  id: string
  churchId: string
  feastId: string
  specialNotes?: string | null
  feast: Feast
}

interface ChurchFeastsListProps {
  churchFeasts: ChurchFeast[]
  allFeasts: Feast[]
  userId: string
}

export function ChurchFeastsList({ churchFeasts, allFeasts, userId }: ChurchFeastsListProps) {
  const router = useRouter()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedFeastId, setSelectedFeastId] = useState("")
  const [specialNotes, setSpecialNotes] = useState("")
  const [currentChurchFeast, setCurrentChurchFeast] = useState<ChurchFeast | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isCreateFeastDialogOpen, setIsCreateFeastDialogOpen] = useState(false)
  const [newFeastName, setNewFeastName] = useState("")
  const [newFeastDate, setNewFeastDate] = useState("")
  const [newFeastDescription, setNewFeastDescription] = useState("")

  // Filter out feasts that are already associated with the church
  const availableFeasts = allFeasts.filter((feast) => !churchFeasts.some((cf) => cf.feastId === feast.id))

  // Group feasts by upcoming and past
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingFeasts = churchFeasts.filter((cf) => new Date(cf.feast.commemorationDate) >= today)

  const pastFeasts = churchFeasts.filter((cf) => new Date(cf.feast.commemorationDate) < today).reverse()

  async function handleAddFeast() {
    if (!selectedFeastId) {
      setError("Please select a feast")
      return
    }

    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/church/feasts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feastId: selectedFeastId,
          specialNotes: specialNotes.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to add feast")
      }

      setSuccess("Feast added successfully")
      setSelectedFeastId("")
      setSpecialNotes("")
      setIsAddDialogOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleEditFeast() {
    if (!currentChurchFeast) return

    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/church/feasts/${currentChurchFeast.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          specialNotes: specialNotes.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update feast")
      }

      setSuccess("Feast updated successfully")
      setCurrentChurchFeast(null)
      setSpecialNotes("")
      setIsEditDialogOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteFeast(id: string) {
    setIsDeleting(id)

    try {
      const response = await fetch(`/api/church/feasts/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to delete feast")
      }

      router.refresh()
    } catch (err) {
      console.error("Delete feast error:", err)
    } finally {
      setIsDeleting(null)
    }
  }

  function openEditDialog(churchFeast: ChurchFeast) {
    setCurrentChurchFeast(churchFeast)
    setSpecialNotes(churchFeast.specialNotes || "")
    setIsEditDialogOpen(true)
  }

  async function handleCreateFeast() {
    if (!newFeastName || !newFeastDate) {
      setError("Feast name and date are required")
      return
    }

    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/church/create-feast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          saintName: newFeastName,
          commemorationDate: newFeastDate,
          description: newFeastDescription.trim() || null,
          specialNotes: specialNotes.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create feast")
      }

      setSuccess("Feast created and added to your church successfully")
      setNewFeastName("")
      setNewFeastDate("")
      setNewFeastDescription("")
      setSpecialNotes("")
      setIsCreateFeastDialogOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Feast Days</h2>
        <div className="flex gap-2">
          <Dialog open={isCreateFeastDialogOpen} onOpenChange={setIsCreateFeastDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Feast
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Feast</DialogTitle>
                <DialogDescription>Create a new feast specific to your church's traditions.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="newFeastName">Feast Name / Saint Name</Label>
                  <Input
                    id="newFeastName"
                    value={newFeastName}
                    onChange={(e) => setNewFeastName(e.target.value)}
                    placeholder="Enter the name of the feast or saint"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newFeastDate">Commemoration Date</Label>
                  <Input
                    id="newFeastDate"
                    type="date"
                    value={newFeastDate}
                    onChange={(e) => setNewFeastDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newFeastDescription">Description (Optional)</Label>
                  <Textarea
                    id="newFeastDescription"
                    placeholder="Add a description about this feast or saint"
                    value={newFeastDescription}
                    onChange={(e) => setNewFeastDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialNotes">Special Notes for Your Church (Optional)</Label>
                  <Textarea
                    id="specialNotes"
                    placeholder="Add any special notes about how your church celebrates this feast"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateFeastDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFeast} disabled={isSubmitting || !newFeastName || !newFeastDate}>
                  {isSubmitting ? "Creating..." : "Create Feast"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Existing Feast
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Feast Day</DialogTitle>
                <DialogDescription>Select a feast day to add to your church's calendar.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="feast">Feast</Label>
                  <Select value={selectedFeastId} onValueChange={setSelectedFeastId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a feast" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFeasts.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No available feasts
                        </SelectItem>
                      ) : (
                        availableFeasts.map((feast) => (
                          <SelectItem key={feast.id} value={feast.id}>
                            {feast.saintName} ({formatDate(feast.commemorationDate)})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Special Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any special notes about how your church celebrates this feast"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleAddFeast} disabled={isSubmitting || !selectedFeastId}>
                  {isSubmitting ? "Adding..." : "Add Feast"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Feast Days</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingFeasts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No upcoming feast days.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Saint Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Special Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingFeasts.map((churchFeast) => (
                  <TableRow key={churchFeast.id}>
                    <TableCell className="font-medium">{churchFeast.feast.saintName}</TableCell>
                    <TableCell>{formatDate(churchFeast.feast.commemorationDate)}</TableCell>
                    <TableCell>{churchFeast.specialNotes || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(churchFeast)}>
                          <PencilLine className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Feast Day</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove this feast day from your church's calendar?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteFeast(churchFeast.id)}
                                disabled={isDeleting === churchFeast.id}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                {isDeleting === churchFeast.id ? "Removing..." : "Remove"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Past Feast Days</CardTitle>
        </CardHeader>
        <CardContent>
          {pastFeasts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No past feast days.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Saint Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Special Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastFeasts.map((churchFeast) => (
                  <TableRow key={churchFeast.id}>
                    <TableCell className="font-medium">{churchFeast.feast.saintName}</TableCell>
                    <TableCell>{formatDate(churchFeast.feast.commemorationDate)}</TableCell>
                    <TableCell>{churchFeast.specialNotes || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(churchFeast)}>
                          <PencilLine className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Feast Day</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove this feast day from your church's calendar?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteFeast(churchFeast.id)}
                                disabled={isDeleting === churchFeast.id}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                {isDeleting === churchFeast.id ? "Removing..." : "Remove"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Feast Day</DialogTitle>
            <DialogDescription>Update the special notes for this feast day.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {currentChurchFeast && (
              <div>
                <p className="font-medium">{currentChurchFeast.feast.saintName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(currentChurchFeast.feast.commemorationDate)}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Special Notes (Optional)</Label>
              <Textarea
                id="edit-notes"
                placeholder="Add any special notes about how your church celebrates this feast"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditFeast} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

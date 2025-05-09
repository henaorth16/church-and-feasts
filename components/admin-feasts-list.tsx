"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { Plus, Trash2, PencilLine, Church } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface ChurchType {
  id: string
  name: string
}

interface ChurchFeast {
  id: string
  churchId: string
  feastId: string
  church: ChurchType
}

interface Feast {
  id: string
  saintName: string
  commemorationDate: Date
  description?: string | null
  churchFeasts: ChurchFeast[]
}

interface AdminFeastsListProps {
  feasts: Feast[]
}

export function AdminFeastsList({ feasts }: AdminFeastsListProps) {
  const router = useRouter()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [saintName, setSaintName] = useState("")
  const [commemorationDate, setCommemorationDate] = useState("")
  const [description, setDescription] = useState("")
  const [currentFeast, setCurrentFeast] = useState<Feast | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  async function handleAddFeast() {
    if (!saintName || !commemorationDate) {
      setError("Saint name and commemoration date are required")
      return
    }

    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/feasts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          saintName,
          commemorationDate,
          description: description.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to add feast")
      }

      setSuccess("Feast added successfully")
      setSaintName("")
      setCommemorationDate("")
      setDescription("")
      setIsAddDialogOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleEditFeast() {
    if (!currentFeast || !saintName || !commemorationDate) {
      setError("Saint name and commemoration date are required")
      return
    }

    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/feasts/${currentFeast.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          saintName,
          commemorationDate,
          description: description.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update feast")
      }

      setSuccess("Feast updated successfully")
      setCurrentFeast(null)
      setSaintName("")
      setCommemorationDate("")
      setDescription("")
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
      const response = await fetch(`/api/admin/feasts/${id}`, {
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

  function openEditDialog(feast: Feast) {
    setCurrentFeast(feast)
    setSaintName(feast.saintName)
    setCommemorationDate(new Date(feast.commemorationDate).toISOString().split("T")[0])
    setDescription(feast.description || "")
    setIsEditDialogOpen(true)
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
        <h2 className="text-xl font-semibold">All Feasts</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Feast
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Feast</DialogTitle>
              <DialogDescription>Add a new feast to the directory.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="saintName">Saint Name</Label>
                <Input id="saintName" value={saintName} onChange={(e) => setSaintName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commemorationDate">Commemoration Date</Label>
                <Input
                  id="commemorationDate"
                  type="date"
                  value={commemorationDate}
                  onChange={(e) => setCommemorationDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description about this saint and feast"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleAddFeast} disabled={isSubmitting || !saintName || !commemorationDate}>
                {isSubmitting ? "Adding..." : "Add Feast"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Saint Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Churches</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feasts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No feasts found
                  </TableCell>
                </TableRow>
              ) : (
                feasts.map((feast) => (
                  <TableRow key={feast.id}>
                    <TableCell className="font-medium">{feast.saintName}</TableCell>
                    <TableCell>{formatDate(feast.commemorationDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Church className="h-4 w-4 text-muted-foreground" />
                        <span>{feast.churchFeasts.length}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(feast)}>
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
                              <AlertDialogTitle>Delete Feast</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this feast? This will remove it from all churches that
                                celebrate it.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteFeast(feast.id)}
                                disabled={isDeleting === feast.id}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                {isDeleting === feast.id ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Feast</DialogTitle>
            <DialogDescription>Update the feast details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-saintName">Saint Name</Label>
              <Input id="edit-saintName" value={saintName} onChange={(e) => setSaintName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-commemorationDate">Commemoration Date</Label>
              <Input
                id="edit-commemorationDate"
                type="date"
                value={commemorationDate}
                onChange={(e) => setCommemorationDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Add a description about this saint and feast"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditFeast} disabled={isSubmitting || !saintName || !commemorationDate}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

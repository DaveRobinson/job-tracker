'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { ApiClient, Position } from '@/lib/api';
import { useRouter } from 'next/navigation';
import PositionsTable from '@/components/PositionsTable';
import PositionForm from '@/components/PositionForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [deletingPositionId, setDeletingPositionId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadPositions();
    }
  }, [user, authLoading, router]);

  const loadPositions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiClient.getPositions();
      setPositions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load positions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPosition(null);
    setDialogOpen(true);
  };

  const handleEdit = (position: Position) => {
    setEditingPosition(position);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingPositionId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingPositionId === null) return;

    try {
      await ApiClient.deletePosition(deletingPositionId);
      await loadPositions();
      setDeleteDialogOpen(false);
      setDeletingPositionId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete position');
    }
  };

  const handleSubmit = async (data: Partial<Position>) => {
    if (editingPosition) {
      await ApiClient.updatePosition(editingPosition.id, data);
    } else {
      await ApiClient.createPosition(data);
    }
    setDialogOpen(false);
    setEditingPosition(null);
    await loadPositions();
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingPosition(null);
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600">Error: {error}</div>
          <button
            onClick={loadPositions}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
            <p className="text-gray-600 mt-1">
              Tracking {positions.length} position{positions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <Button onClick={handleCreate}>
              Add Position
            </Button>
            <span className="text-sm text-gray-600">
              {user?.name}
            </span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        <PositionsTable
          positions={positions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPosition ? 'Edit Position' : 'Add New Position'}
              </DialogTitle>
            </DialogHeader>
            <PositionForm
              position={editingPosition || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitLabel={editingPosition ? 'Update' : 'Create'}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the position
                from your tracking list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={confirmDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}

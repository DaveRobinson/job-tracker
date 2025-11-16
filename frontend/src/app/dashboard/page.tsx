'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { api, Position, User } from '@/lib/api';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [deletingPositionId, setDeletingPositionId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      // Load users list if admin
      if (user.is_admin) {
        loadUsers();
      }

      // Set default filter to user's own ID if not already set
      if (selectedFilter === '' && user.id) {
        setSelectedFilter(user.id.toString());
        return; // Return early as setSelectedFilter will trigger loadPositions via the other useEffect
      }

      loadPositions();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && selectedFilter !== '') {
      loadPositions();
    }
  }, [selectedFilter]);

  const loadUsers = async () => {
    try {
      const data = await api.users.list();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const loadPositions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build filter based on selected option
      let filters = undefined;
      if (user?.is_admin && selectedFilter) {
        if (selectedFilter === 'all') {
          filters = { all_users: true };
        } else {
          // selectedFilter is a user ID
          filters = { user_id: parseInt(selectedFilter) };
        }
      }
      // Non-admin users always see their own positions (no filter needed)

      const data = await api.positions.list(filters);
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
      await api.positions.delete(deletingPositionId);
      await loadPositions();
      setDeleteDialogOpen(false);
      setDeletingPositionId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete position');
    }
  };

  const handleSubmit = async (data: Partial<Position>) => {
    if (editingPosition) {
      await api.positions.update(editingPosition.id, data);
    } else {
      await api.positions.create(data);
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

        {user?.is_admin && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="user-filter" className="text-sm font-medium text-gray-700">
                View positions for:
              </Label>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger id="user-filter" className="w-64">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All users</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>
                      {u.name}{u.id === user?.id ? ' (you)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <PositionsTable
          positions={positions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isAdmin={user?.is_admin}
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

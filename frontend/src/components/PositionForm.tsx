import { Position } from '@/lib/api';
import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PositionFormProps {
  position?: Position;
  onSubmit: (data: Partial<Position>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const STATUSES = [
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

export default function PositionForm({
  position,
  onSubmit,
  onCancel,
  submitLabel = 'Save'
}: PositionFormProps) {
  const [formData, setFormData] = useState<Partial<Position>>({
    company: position?.company || '',
    recruiter_company: position?.recruiter_company || '',
    title: position?.title || '',
    description: position?.description || '',
    status: position?.status || 'saved',
    location: position?.location || '',
    salary: position?.salary || '',
    url: position?.url || '',
    notes: position?.notes || '',
    applied_at: position?.applied_at || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.company && !formData.recruiter_company) {
      setError('Please provide either a company name or recruiter company');
      return;
    }

    if (!formData.title) {
      setError('Please provide a job title');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save position');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof Position, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value || null }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company || ''}
            onChange={(e) => updateField('company', e.target.value)}
          />
        </div>

        {/* Recruiter Company */}
        <div className="space-y-2">
          <Label htmlFor="recruiter_company">Recruiter Company</Label>
          <Input
            id="recruiter_company"
            value={formData.recruiter_company || ''}
            onChange={(e) => updateField('recruiter_company', e.target.value)}
          />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Job Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          required
          value={formData.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={formData.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status || 'saved'}
            onValueChange={(value) => updateField('status', value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
          />
        </div>

        {/* Salary */}
        <div className="space-y-2">
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            placeholder="e.g., £70,000-£90,000"
            value={formData.salary || ''}
            onChange={(e) => updateField('salary', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* URL */}
        <div className="space-y-2">
          <Label htmlFor="url">Job Posting URL</Label>
          <Input
            type="url"
            id="url"
            value={formData.url || ''}
            onChange={(e) => updateField('url', e.target.value)}
          />
        </div>

        {/* Applied At */}
        <div className="space-y-2">
          <Label htmlFor="applied_at">Applied Date</Label>
          <Input
            type="date"
            id="applied_at"
            value={formData.applied_at || ''}
            onChange={(e) => updateField('applied_at', e.target.value)}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={3}
          value={formData.notes || ''}
          onChange={(e) => updateField('notes', e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}

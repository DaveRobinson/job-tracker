import { Position } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PositionsTableProps {
  positions: Position[];
  onEdit?: (position: Position) => void;
  onDelete?: (id: number) => void;
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'offered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'interviewing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'applied':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'withdrawn':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-purple-100 text-purple-800 border-purple-200';
  }
};

export default function PositionsTable({ positions, onEdit, onDelete }: PositionsTableProps) {
  if (positions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">No positions tracked yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied
              </th>
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {positions.map((position) => (
              <tr key={position.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {position.company || position.recruiter_company}
                  </div>
                  {position.recruiter_company && position.company && (
                    <div className="text-xs text-gray-500">
                      via {position.recruiter_company}
                    </div>
                  )}
                  {position.recruiter_company && !position.company && (
                    <div className="text-xs text-gray-500">
                      (via agency)
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{position.title}</div>
                  {position.url && (
                    <a
                      href={position.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      View posting →
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {position.location || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {position.salary || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getStatusBadgeClass(position.status)}>
                    {position.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {position.applied_at
                    ? new Date(position.applied_at).toLocaleDateString()
                    : '-'
                  }
                </td>
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onEdit(position)}
                        >
                          Edit
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(position.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

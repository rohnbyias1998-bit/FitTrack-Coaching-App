import { useState } from 'react';
import { mockClients } from '@/types/client';
import ClientDetailPage from '@/pages/ClientDetailPage';

interface ClientManagementProps {
  viewingClientId?: string | null;
  onViewClient?: (clientId: string) => void;
  onBackToList?: () => void;
}

export default function ClientManagement({ 
  viewingClientId, 
  onViewClient, 
  onBackToList 
}: ClientManagementProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // If viewing a specific client, show the detail view
  if (viewingClientId) {
    return (
      <div>
        <button
          onClick={onBackToList}
          className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back to Client List
        </button>
        <ClientDetailPage clientId={viewingClientId} embedded={true} />
      </div>
    );
  }

  // Filter clients based on search and filters
  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Client Management ({filteredClients.length} clients)</h2>
        <p className="text-gray-600 mt-1">Manage and track all your clients</p>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="needs-attention">Needs Attention</option>
        </select>
      </div>

      {/* Client Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Goal</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Workout</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Compliance</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={client.profilePhoto} 
                      alt={client.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <button
                        onClick={() => onViewClient && onViewClient(client.id)}
                        className="font-semibold hover:text-blue-600 text-left"
                      >
                        {client.name}
                      </button>
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                    {client.goal.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {client.lastWorkoutDate ? new Date(client.lastWorkoutDate).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${client.complianceRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{client.complianceRate}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    client.status === 'active' ? 'bg-green-100 text-green-800' :
                    client.status === 'needs-attention' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onViewClient && onViewClient(client.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No clients found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
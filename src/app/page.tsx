'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { Loader2 } from 'lucide-react';

type User = Database['public']['Tables']['users']['Row'];

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Impossible de charger les utilisateurs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function reloadWithFaker() {
    try {
      setReloading(true);
      
      // Appel à votre API pour générer de nouvelles données avec Faker
      const response = await fetch('/api/generate-users', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Échec de la génération des utilisateurs');
      }
      
      // Recharger les utilisateurs après la génération
      await fetchUsers();
    } catch (error) {
      setError('Impossible de générer de nouveaux utilisateurs');
      console.error(error);
    } finally {
      setReloading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading && !reloading) {
    return <div suppressHydrationWarning className="flex justify-center p-12">Chargement des utilisateurs...</div>;
  }
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Liste des Utilisateurs</h1>
        <Button 
          onClick={reloadWithFaker} 
          disabled={reloading}
          className="flex items-center gap-2"
        >
          {reloading && <Loader2 className="h-4 w-4 animate-spin" />}
          {reloading ? 'Génération en cours...' : 'Générer de nouveaux utilisateurs'}
        </Button>
      </div>
      
      {error && <div className="text-red-500 p-4 mb-4">{error}</div>}
      
      {/* Tableau des utilisateurs */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de création
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Avatar>
                        <AvatarImage src={user.avatar || ''} alt={user.name || ''} />
                        <AvatarFallback>
                          {user.name ? user.name.substring(0, 2).toUpperCase() : '??'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name || 'Sans nom'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email || 'Pas d\'email'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Message si aucun utilisateur */}
      {users.length === 0 && !loading && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">Aucun utilisateur trouvé</p>
          <Button 
            onClick={reloadWithFaker} 
            className="mt-4"
          >
            Générer des utilisateurs
          </Button>
        </div>
      )}
    </div>
  );
}
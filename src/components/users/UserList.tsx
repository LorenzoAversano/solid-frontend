'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

type User = Database['public']['Tables']['users']['Row'];

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setUsers(data || []);
      } catch (error) {
        setError('Impossible de charger les utilisateurs');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-12">Chargement des utilisateurs...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={user.avatar || ''} alt={user.name || ''} />
              <AvatarFallback>
                {user.name ? user.name.substring(0, 2).toUpperCase() : '??'}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{user.name || 'Sans nom'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">{user.email || 'Pas d\'email'}</p>
            <p className="text-sm text-gray-400 mt-2">
              Créé le {new Date(user.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
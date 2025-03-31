// app/api/generate-users/route.ts
import { NextResponse } from 'next/server';
import { faker } from '@faker-js/faker';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('L\'email doit être valide'),
  avatar: z.string().url('L\'avatar doit être une URL valide'),
  created_at: z.string().refine((val) => !isNaN(Date.parse(val)), 'La date de création doit être valide'),
});

export async function POST() {
  try {
    const newUsers = Array.from({ length: 10 }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      created_at: new Date().toISOString(),
    }));

    // Valider les données avec Zod
    const validationResults = newUsers.map((user, index) => {
      try {
        UserSchema.parse(user);
        return null;
      } catch (error) {
        return { index, error };
      }
    }).filter(Boolean); 

    if (validationResults.length > 0) {
      console.error('Erreurs de validation :', validationResults);
      return NextResponse.json(
        { error: 'Certains utilisateurs ne sont pas valides', details: validationResults },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('users').insert(newUsers);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, count: newUsers.length });
  } catch (error) {
    console.error('Erreur lors de la génération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue lors de la génération des utilisateurs', details: error },
      { status: 500 }
    );
  }
}

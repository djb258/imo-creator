import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { dbHelpers } from '../db';

export function useEnsureUser() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Ensure user exists in our database
      const ensureDbUser = async () => {
        try {
          const existingUser = await dbHelpers.findUserByClerkId(user.id);
          
          if (!existingUser) {
            await dbHelpers.createUser({
              clerkId: user.id,
              email: user.emailAddresses[0]?.emailAddress || '',
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl,
            });
          }
        } catch (error) {
          console.error('Error ensuring user in database:', error);
        }
      };

      ensureDbUser();
    }
  }, [user, isLoaded]);

  return { user, isLoaded };
}

export function useAuth() {
  const { user, isLoaded } = useUser();
  
  return {
    user,
    isLoaded,
    isSignedIn: !!user,
    userId: user?.id,
  };
}
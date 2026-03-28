'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';
import { resolveUserFriendlyMessage } from '@/lib/error-mapping';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * It displays user-friendly toast notifications for received errors.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    // The callback now expects a strongly-typed error, matching the event payload.
    const handleError = (error: FirestorePermissionError) => {
      const msg = resolveUserFriendlyMessage(error);
      if (msg) {
        toast({
          title: msg.title,
          description: msg.description,
          variant: msg.variant,
        });
      }
    };

    // The typed emitter will enforce that the callback for 'permission-error'
    // matches the expected payload type (FirestorePermissionError).
    errorEmitter.on('permission-error', handleError);

    // Unsubscribe on unmount to prevent memory leaks.
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  // This component renders nothing.
  return null;
}

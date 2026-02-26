import React from 'react';
import { AlertDialog, Button, XStack, YStack } from 'tamagui';
import { useRouter } from 'expo-router';
import { useAuthModalStore } from '@/store/useAuthModalStore';
import { useAuth } from '@/context/supabase-provider';

export function AuthRequiredModal() {
  const { isVisible, message, hideModal } = useAuthModalStore();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogin = () => {
    hideModal();
    // Drop the anonymous session first
    signOut().then(() => {
      // The AuthProvider will automatically redirect to /welcome, but we force it to be safe
      router.replace('/welcome');
    }).catch(console.error);
  };

  return (
    <AlertDialog open={isVisible} onOpenChange={(open) => !open && hideModal()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack gap="$4">
            <AlertDialog.Title>Login Required</AlertDialog.Title>
            <AlertDialog.Description>
              {message}
            </AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end" marginTop="$4">
              <AlertDialog.Cancel asChild>
                <Button variant="outlined" onPress={hideModal} flex={1}>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button onPress={handleLogin} flex={1}>Log In / Sign Up</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}

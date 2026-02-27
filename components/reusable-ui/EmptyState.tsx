import React from 'react';
import { YStack, Text, View } from 'tamagui';

type EmptyStateProps = {
  icon?: any;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <YStack 
      padding="$8" 
      alignItems="center" 
      justifyContent="center" 
      gap="$4"
      width="100%"
    >
      {Icon && (
        <View 
          padding="$5" 
          borderRadius={100} 
          bg="$muted" 
          opacity={0.8}
        >
          <Icon size={40} color="$mutedForeground" />
        </View>
      )}
      
      <YStack alignItems="center" gap="$2">
        <Text 
          fontSize="$6" 
          fontWeight="bold" 
          color="$color" 
          textAlign="center"
        >
          {title}
        </Text>
        {description && (
          <Text 
            fontSize="$4" 
            color="$mutedForeground" 
            textAlign="center"
            paddingHorizontal="$4"
          >
            {description}
          </Text>
        )}
      </YStack>

      {action && (
        <View marginTop="$2">
          {action}
        </View>
      )}
    </YStack>
  );
}

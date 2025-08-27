import { useMutation } from "@apollo/client";
import { Switch, Text, Group, Box } from "@mantine/core";
import { useAuth } from "@/hooks";
import ToggleDebugMode from "@/graphql/mutations/debug/toggleDebugMode";
import { useEffect, useState } from "react";

export function DebugModeToggle() {
  const { user, setUser } = useAuth();
  const [enabled, setEnabled] = useState(false);

  // Initialize the switch state based on user's debugModeEnabled
  useEffect(() => {
    if (user?.debugModeEnabled !== undefined && user?.debugModeEnabled !== null) {
      setEnabled(user.debugModeEnabled);
    }
  }, [user?.debugModeEnabled]);

  const [toggleDebugMode] = useMutation(ToggleDebugMode, {
    onCompleted: (data) => {
      // Update the user context with the new debug mode status
      if (setUser && user) {
        setUser({
          ...user,
          debugModeEnabled: data.toggleDebugMode.debugModeEnabled,
        });
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleChange = (checked: boolean) => {
    setEnabled(checked);
    toggleDebugMode({
      variables: {
        toggleDebugModeInput: {
          enabled: checked,
        },
      },
    }).catch((error) => {
      // Revert the switch state if the mutation fails
      setEnabled(!checked);
      console.error(error);
    });
  };

  // Only show the toggle if the user is an admin
  if (user?.role !== "admin") {
    return null;
  }

  return (
    <Box 
      sx={(theme) => ({
        position: 'fixed',
        bottom: theme.spacing.md,
        right: theme.spacing.md,
        zIndex: 1000,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        padding: theme.spacing.xs,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadows.sm,
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
      })}
    >
      <Group spacing="xs">
        <Text size="xs" color="dimmed">Debug</Text>
        <Switch
          checked={enabled}
          onChange={(event) => handleChange(event.currentTarget.checked)}
          size="md"
          onLabel="ON"
          offLabel="OFF"
        />
      </Group>
    </Box>
  );
}
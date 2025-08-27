import { useMutation } from "@apollo/client";
import { Switch, Text, Group } from "@mantine/core";
import { useSnackbar } from "@/hooks";
import { useAuth } from "@/hooks";
import ToggleDebugMode from "@/graphql/mutations/debug/toggleDebugMode";
import { useEffect, useState } from "react";

export function DebugModeToggle() {
  const snackbar = useSnackbar();
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
      snackbar.success("Debug mode updated successfully");
    },
    onError: (error) => {
      snackbar.error("Failed to update debug mode");
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
    <Group position="center" mt="md">
      <Text>Debug Mode</Text>
      <Switch
        checked={enabled}
        onChange={(event) => handleChange(event.currentTarget.checked)}
      />
    </Group>
  );
}
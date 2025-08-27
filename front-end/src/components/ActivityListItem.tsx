import { ActivityFragment } from "@/graphql/generated/types";
import { useGlobalStyles } from "@/utils";
import { Box, Button, Flex, Image, Text } from "@mantine/core";
import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";
import { useAuth } from "@/hooks";

interface ActivityListItemProps {
  activity: ActivityFragment;
  showFavoriteButton?: boolean;
  mb?: string;
}

export function ActivityListItem({ activity, showFavoriteButton = true, mb }: ActivityListItemProps) {
  const { classes } = useGlobalStyles();
  const { user } = useAuth();

  // Format the date for display
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Flex align="center" justify="space-between" mb={mb}>
      <Flex gap="md" align="center">
        <Image
          src="https://dummyimage.com/125"
          radius="md"
          alt="random image of city"
          height="125"
          width="125"
        />
        <Box sx={{ maxWidth: "300px" }}>
          <Text className={classes.ellipsis}>{activity.city}</Text>
          <Text className={classes.ellipsis}>{activity.name}</Text>
          <Text className={classes.ellipsis}>{activity.description}</Text>
          <Text
            weight="bold"
            className={classes.ellipsis}
          >{`${activity.price}€/j`}</Text>
          {/* Display createdAt only if user is admin and debug mode is enabled */}
          {user?.role === "admin" && user?.debugModeEnabled && activity.createdAt && (
            <Text size="xs" color="dimmed" mt="xs">
              Created: {formatDate(activity.createdAt)}
            </Text>
          )}
        </Box>
      </Flex>
      <Flex gap="sm" align="center">
        {showFavoriteButton && (
          <FavoriteButton
            activityId={activity.id}
            size="sm"
          />
        )}
        <Link href={`/activities/${activity.id}`} className={classes.link}>
          <Button 
            variant="outline" 
            color="dark"
            size="sm"
            sx={{
              '@media (max-width: 768px)': {
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
              }
            }}
          >
            Voir plus
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
}
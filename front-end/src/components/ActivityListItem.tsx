import { ActivityFragment } from "@/graphql/generated/types";
import { useGlobalStyles } from "@/utils";
import { Box, Button, Flex, Image, Text } from "@mantine/core";
import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";

interface ActivityListItemProps {
  activity: ActivityFragment;
  showFavoriteButton?: boolean;
  mb?: string;
}

export function ActivityListItem({ activity, showFavoriteButton = true, mb }: ActivityListItemProps) {
  const { classes } = useGlobalStyles();

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

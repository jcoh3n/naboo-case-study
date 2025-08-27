import { ActivityFragment } from "@/graphql/generated/types";
import { useGlobalStyles } from "@/utils";
import { Badge, Button, Card, Grid, Group, Image, Text } from "@mantine/core";
import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";
import { useAuth } from "@/hooks";

interface ActivityProps {
  activity: ActivityFragment;
}

export function Activity({ activity }: ActivityProps) {
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
    <Grid.Col 
      span={4}
      sx={{
        '@media (max-width: 768px)': {
          marginBottom: '1rem',
        }
      }}
    >
      <Card 
        shadow="sm" 
        padding="lg"
        radius="md" 
        withBorder
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Card.Section>
          <Image
            src="https://dummyimage.com/480x4:3"
            height={160}
            alt="random image of city"
          />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500} className={classes.ellipsis}>
            {activity.name}
          </Text>
        </Group>

        <Group mt="md" mb="xs">
          <Badge color="pink" variant="light">
            {activity.city}
          </Badge>
          <Badge color="yellow" variant="light">
            {`${activity.price}€/j`}
          </Badge>
        </Group>

        <Text size="sm" color="dimmed" className={classes.ellipsis}>
          {activity.description}
        </Text>

        {/* Display createdAt only if user is admin and debug mode is enabled */}
        {user?.role === "admin" && user?.debugModeEnabled && activity.createdAt && (
          <Text 
            size="xs" 
            color="dimmed" 
            mt="xs"
            sx={(theme) => ({
              fontStyle: 'italic',
              padding: theme.spacing.xs,
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
              borderRadius: theme.radius.sm,
              border: `1px dashed ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4]}`,
            })}
          >
            Created: {formatDate(activity.createdAt)}
          </Text>
        )}

        <Group position="apart" mt="md" align="center" sx={{ marginTop: 'auto' }}>
          <FavoriteButton
            activityId={activity.id}
            size="md"
          />
          <Link href={`/activities/${activity.id}`} className={classes.link} style={{ flex: 1 }}>
            <Button 
              variant="light" 
              color="blue" 
              radius="md"
              size="sm"
              fullWidth
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
        </Group>
      </Card>
    </Grid.Col>
  );
}
import { PageTitle, DebugModeToggle } from "@/components";
import { graphqlClient } from "@/graphql/apollo";
import {
  GetActivityQuery,
  GetActivityQueryVariables,
} from "@/graphql/generated/types";
import GetActivity from "@/graphql/queries/activity/getActivity";
import { Badge, Flex, Grid, Group, Image, Text } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks";

interface ActivityDetailsProps {
  activity: GetActivityQuery["getActivity"];
}

export const getServerSideProps: GetServerSideProps<
  ActivityDetailsProps
> = async ({ params, req }) => {
  if (!params?.id || Array.isArray(params.id)) return { notFound: true };
  const response = await graphqlClient.query<
    GetActivityQuery,
    GetActivityQueryVariables
  >({
    query: GetActivity,
    variables: { id: params.id },
    context: { headers: { Cookie: req.headers.cookie } },
  });
  return { props: { activity: response.data.getActivity } };
};

export default function ActivityDetails({ activity }: ActivityDetailsProps) {
  const router = useRouter();
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
    <>
      <Head>
        <title>{activity.name} | CDTR</title>
      </Head>
      <PageTitle title={activity.name} prevPath={router.back} />
      {/* Debug Mode Toggle - only visible for admins */}
      {user?.role === "admin" && <DebugModeToggle />}
      <Grid>
        <Grid.Col span={7}>
          <Image
            src="https://dummyimage.com/640x4:3"
            radius="md"
            alt="random image of city"
            width="100%"
            height="400"
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <Flex direction="column" gap="md">
            <Group mt="md" mb="xs">
              <Badge color="pink" variant="light">
                {activity.city}
              </Badge>
              <Badge color="yellow" variant="light">
                {`${activity.price}€/j`}
              </Badge>
            </Group>
            <Text size="sm">{activity.description}</Text>
            <Text size="sm" color="dimmed">
              Ajouté par {activity.owner.firstName} {activity.owner.lastName}
            </Text>
            {/* Display createdAt only if user is admin and debug mode is enabled */}
            {user?.role === "admin" && user?.debugModeEnabled && activity.createdAt && (
              <Text size="xs" color="dimmed">
                Created: {formatDate(activity.createdAt)}
              </Text>
            )}
          </Flex>
        </Grid.Col>
      </Grid>
    </>
  );
}

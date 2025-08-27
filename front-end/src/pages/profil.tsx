import { PageTitle } from "@/components";
import { graphqlClient } from "@/graphql/apollo";
import { withAuth } from "@/hocs";
import { useAuth } from "@/hooks";
import { Avatar, Text, Stack, Card, Group, Box } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { FavoritesList } from "@/components/FavoritesList";

interface ProfileProps {
  favoriteActivities: {
    id: string;
    name: string;
  }[];
}

const Profile = (props: ProfileProps) => {
  const { user } = useAuth();

  return (
    <>
      <Head>
        <title>Mon profil | CDTR</title>
      </Head>
      <PageTitle title="Mon profil" />
      <Stack spacing="lg">
        {/* Section Informations utilisateur */}
        <Card withBorder p="lg" radius="md" shadow="xs">
          <Group align="center" spacing="md">
            <Avatar 
              color="cyan" 
              radius="xl" 
              size={60}
              sx={{
                fontWeight: 600,
              }}
            >
              {user?.firstName[0]}{user?.lastName[0]}
            </Avatar>
            <Box>
              <Text size="lg" weight={600} mb={4}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text size="sm" color="dimmed">
                {user?.email}
              </Text>
            </Box>
          </Group>
        </Card>
        
        {/* Section Favoris */}
        <FavoritesList />
      </Stack>
    </>
  );
};

export default withAuth(Profile);

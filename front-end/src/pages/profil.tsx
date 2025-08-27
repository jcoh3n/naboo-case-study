import { PageTitle } from "@/components";
import { graphqlClient } from "@/graphql/apollo";
import { withAuth } from "@/hocs";
import { useAuth } from "@/hooks";
import { Avatar, Flex, Text, Stack, Divider, Card, Group, Badge, Box } from "@mantine/core";
import { IconMail, IconUser, IconHeart } from "@tabler/icons-react";
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
      <Stack spacing="xl">
        {/* Section Informations utilisateur */}
        <Card withBorder p="xl" radius="lg" shadow="sm">
          <Group position="apart" align="flex-start">
            <Group align="center" spacing="lg">
              <Avatar 
                color="cyan" 
                radius="xl" 
                size={80}
                sx={{
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                {user?.firstName[0]}
                {user?.lastName[0]}
              </Avatar>
              <Box>
                <Text size="xl" weight={700} mb="xs">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Group spacing="md">
                  <Badge 
                    leftSection={<IconUser size={14} />}
                    variant="light" 
                    color="blue"
                    size="sm"
                  >
                    Utilisateur
                  </Badge>
                  <Badge 
                    leftSection={<IconMail size={14} />}
                    variant="light" 
                    color="green"
                    size="sm"
                  >
                    {user?.email}
                  </Badge>
                </Group>
              </Box>
            </Group>
          </Group>
        </Card>
        
        {/* Divider entre les sections */}
        <Divider my="xl" />
        
        {/* Section Favoris */}
        <FavoritesList />
      </Stack>
    </>
  );
};

export default withAuth(Profile);

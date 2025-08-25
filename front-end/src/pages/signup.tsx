import React from 'react';
import Head from 'next/head';
import { Container, Title, Text, Box } from '@mantine/core';
import { SignupForm } from '../components/Form';
import { PageTitle } from '../components/PageTitle';
import { withoutAuth } from '../hocs/withoutAuth';

interface SignupProps {}

const Signup: React.FC<SignupProps> = (props) => {
  return (
    <>
      <Head>
        <title>Inscription | CDTR</title>
      </Head>
      <PageTitle title="Inscription" />
      <Container size="sm">
        <Box maw={450} mx="auto">
          <SignupForm />
        </Box>
      </Container>
    </>
  );
};

export default withoutAuth(Signup);

'use client';

import { useEffect, useState } from 'react';
import { IconApi } from '@tabler/icons-react';
import { AppShell, Group, Text } from '@mantine/core';
import { SelectMovieOptions } from '../components/SelectMovieOptions/SelectMovieOptions';
import { ClientRateLimiter } from './lib/utils/api-helpers';

export default function HomePage() {
  const [remainingRequests, setRemainingRequests] = useState(0);

  useEffect(() => {
    setRemainingRequests(ClientRateLimiter.getRemainingRequests());
  }, []);

  return (
    <AppShell header={{ height: 80 }} footer={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Text size="xl" fw={700} c="blue.7">
            🎬 Movie Recommendations
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <SelectMovieOptions />
      </AppShell.Main>

      <AppShell.Footer>
        <Group h="100%" px="md" justify="center">
          <IconApi size={20} />
          <Text size="sm" c="dimmed">
            API Requests Remaining: <strong>{remainingRequests}</strong>
          </Text>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { IconApi } from '@tabler/icons-react';
import { AppShell, Group, Text } from '@mantine/core';
import { DisplayMovieRecommendations } from '../components/DisplayMovieRecommendations/DisplayMovieRecommendations';
import { SelectMovieOptions } from '../components/SelectMovieOptions/SelectMovieOptions';
import { ClientRateLimiter } from './lib/utils/api-helpers';

interface MovieRecommendation {
  title: string;
  year: number;
  imdb_id: string;
}

export default function HomePage() {
  const [remainingRequests, setRemainingRequests] = useState(0);
  const [movieRecommendations, setMovieRecommendations] = useState<MovieRecommendation[]>([]);
  const [hasRecommendations, setHasRecommendations] = useState(false);

  useEffect(() => {
    // Only update remaining requests on the client side
    if (typeof window !== 'undefined') {
      setRemainingRequests(ClientRateLimiter.getRemainingRequests());
    }
  }, []);

  // Update remaining requests count
  const updateRemainingRequests = () => {
    setRemainingRequests(ClientRateLimiter.getRemainingRequests());
  };

  const handleRecommendationsReceived = (recommendations: MovieRecommendation[]) => {
    setMovieRecommendations(recommendations);
    setHasRecommendations(true);
  };

  const handleResetRecommendations = () => {
    setMovieRecommendations([]);
    setHasRecommendations(false);
    // Reset rate limiter when going back to search
    ClientRateLimiter.resetRequests();
    setRemainingRequests(ClientRateLimiter.getRemainingRequests());
  };

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
        {!hasRecommendations ? (
          <SelectMovieOptions
            onRecommendationsReceived={handleRecommendationsReceived}
            onRequestMade={updateRemainingRequests}
          />
        ) : (
          <DisplayMovieRecommendations
            recommendations={movieRecommendations}
            onBack={handleResetRecommendations}
          />
        )}
      </AppShell.Main>

      <AppShell.Footer>
        <Group h="100%" px="md" justify="center">
          <IconApi size={20} />
          <Text size="sm" c="dimmed">
            API Requests Remaining: <strong>{remainingRequests}</strong>
            {typeof window !== 'undefined' && <> (Used: {ClientRateLimiter.getCurrentCount()})</>}
          </Text>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
}

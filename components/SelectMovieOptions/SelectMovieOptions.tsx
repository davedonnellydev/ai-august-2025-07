'use client';

import { useState } from 'react';
import { IconInfoCircle, IconRefresh, IconSearch } from '@tabler/icons-react';
import {
  Alert,
  Badge,
  Button,
  Chip,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { ClientRateLimiter } from '../../app/lib/utils/api-helpers';

// Movie genres
const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'Crime',
  'Historical',
  'Musical',
  'Animation',
  'Documentary',
];

// Movie categories
const CATEGORIES = [
  'New Release',
  'Blockbuster',
  'Indie',
  'Critically Acclaimed',
  'Award-Winning',
  'Cult Classic',
  'Family-Friendly',
];

interface MovieSearchOptions {
  description: string;
  genres: string[];
  categories: string[];
}

interface MovieRecommendation {
  title: string;
  year: number;
  imdb_id: string;
}

interface SelectMovieOptionsProps {
  onRecommendationsReceived: (recommendations: MovieRecommendation[]) => void;
  onRequestMade?: () => void;
}

export function SelectMovieOptions({
  onRecommendationsReceived,
  onRequestMade,
}: SelectMovieOptionsProps) {
  const [searchOptions, setSearchOptions] = useState<MovieSearchOptions>({
    description: '',
    genres: [],
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDescriptionChange = (value: string) => {
    setSearchOptions((prev) => ({ ...prev, description: value }));
  };

  const handleGenresChange = (value: string[]) => {
    setSearchOptions((prev) => ({ ...prev, genres: value }));
  };

  const handleCategoriesChange = (value: string[]) => {
    setSearchOptions((prev) => ({ ...prev, categories: value }));
  };

  const handleSubmit = async () => {
    // Check if at least one input is filled in
    const hasDescription = searchOptions.description.trim().length > 0;
    const hasGenres = searchOptions.genres.length > 0;
    const hasCategories = searchOptions.categories.length > 0;

    if (!hasDescription && !hasGenres && !hasCategories) {
      setError(
        'Please provide at least one preference: a description, select genres, or select categories'
      );
      return;
    }

    // Check rate limit before making the request
    if (!ClientRateLimiter.checkLimit()) {
      setError('Rate limit exceeded. Please try again later.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/openai/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchOptions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.error || 'API call failed');
      }

      const result = await response.json();
      console.log(result);

      // Check if we have movie recommendations in the response
      if (result.response && result.response.list && Array.isArray(result.response.list)) {
        const recommendations: MovieRecommendation[] = result.response.list;
        console.log('Movie recommendations received:', recommendations);
        onRecommendationsReceived(recommendations);
      } else {
        console.log('No movie recommendations received in response');
        setError('No movie recommendations received. Please try again.');
      }

      // Notify parent component that a request was made (this updates the footer)
      if (onRequestMade) {
        onRequestMade();
      }
    } catch (err) {
      console.error('API error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchOptions({
      description: '',
      genres: [],
      categories: [],
    });
    setError('');
  };

  const hasSelections = searchOptions.genres.length > 0 || searchOptions.categories.length > 0;

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {/* Main Form */}
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            {/* Description Textarea */}
            <Textarea
              label="What kind of movies are you looking for?"
              description="Describe the mood, plot elements, or anything specific you want to see"
              placeholder="e.g., I want a feel-good comedy that makes me laugh out loud, something like The Office but as a movie..."
              value={searchOptions.description}
              onChange={(event) => handleDescriptionChange(event.currentTarget.value)}
              size="md"
              radius="md"
              minRows={3}
              maxRows={6}
            />

            {/* Genres Selection */}
            <div>
              <Text size="sm" fw={500} mb="xs">
                Genres
              </Text>
              <Text size="xs" c="dimmed" mb="md">
                Select one or more genres that interest you
              </Text>
              <Chip.Group value={searchOptions.genres} onChange={handleGenresChange} multiple>
                <Group gap="xs" wrap="wrap">
                  {GENRES.map((genre) => (
                    <Chip key={genre} value={genre} variant="light" size="sm">
                      {genre}
                    </Chip>
                  ))}
                </Group>
              </Chip.Group>
            </div>

            {/* Categories Selection */}
            <div>
              <Text size="sm" fw={500} mb="xs">
                Categories
              </Text>
              <Text size="xs" c="dimmed" mb="md">
                Select one or more categories that interest you
              </Text>
              <Chip.Group
                value={searchOptions.categories}
                onChange={handleCategoriesChange}
                multiple
              >
                <Group gap="xs" wrap="wrap">
                  {CATEGORIES.map((category) => (
                    <Chip key={category} value={category} variant="light" size="sm">
                      {category}
                    </Chip>
                  ))}
                </Group>
              </Chip.Group>
            </div>

            {/* Selected Options Display */}
            {hasSelections && (
              <Paper p="md" radius="md" bg="gray.0">
                <Text size="sm" fw={500} mb="xs">
                  Your Selections:
                </Text>
                <Group gap="xs">
                  {searchOptions.genres.map((genre) => (
                    <Badge key={genre} variant="filled" color="blue" size="sm">
                      {genre}
                    </Badge>
                  ))}
                  {searchOptions.categories.map((category) => (
                    <Badge key={category} variant="filled" color="green" size="sm">
                      {category}
                    </Badge>
                  ))}
                </Group>
              </Paper>
            )}

            {/* Action Buttons */}
            <Group justify="center" gap="md">
              <Button
                variant="filled"
                color="blue"
                size="lg"
                radius="md"
                leftSection={<IconSearch size={20} />}
                onClick={handleSubmit}
                loading={isLoading}
                disabled={
                  !searchOptions.description.trim() &&
                  searchOptions.genres.length === 0 &&
                  searchOptions.categories.length === 0
                }
              >
                Recommend me some movies
              </Button>

              <Button
                variant="light"
                color="gray"
                size="lg"
                radius="md"
                leftSection={<IconRefresh size={20} />}
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset
              </Button>
            </Group>

            {/* Error Display */}
            {error && (
              <Alert
                icon={<IconInfoCircle size={16} />}
                title="Error"
                color="red"
                variant="light"
                radius="md"
              >
                {error}
              </Alert>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

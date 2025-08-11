'use client';

import { useCallback, useEffect, useState } from 'react';
import { IconArrowLeft, IconCalendar, IconClock, IconStar, IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Drawer,
  Grid,
  Group,
  Image,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import classes from './DisplayMovieRecommendations.module.css';

interface MovieRecommendation {
  title: string;
  year: number;
  imdb_id: string;
}

interface OMDbMovieData {
  title: string;
  year: number;
  rated: string;
  released: string;
  runtime: string;
  genre: string[];
  director: string;
  writer: string;
  actors: string[];
  plot: string;
  poster: string;
  ratings: Array<{ Source: string; Value: string }>;
  metascore: number | null;
  imdbRating: number | null;
  imdbVotes: number | null;
  imdbId: string;
  type: string;
  boxOffice: string | null;
  production: string | null;
}

interface DisplayMovieRecommendationsProps {
  recommendations: MovieRecommendation[];
  onBack: () => void;
}

// Cache for OMDb API responses
const movieCache = new Map<string, OMDbMovieData>();

export function DisplayMovieRecommendations({
  recommendations,
  onBack,
}: DisplayMovieRecommendationsProps) {
  const [movies, setMovies] = useState<OMDbMovieData[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<OMDbMovieData | null>(null);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch movie data from OMDb API
  const fetchMovieData = useCallback(
    async (recommendation: MovieRecommendation): Promise<OMDbMovieData | null> => {
      const cacheKey = recommendation.imdb_id || `${recommendation.title}-${recommendation.year}`;

      // Check cache first
      if (movieCache.has(cacheKey)) {
        return movieCache.get(cacheKey)!;
      }

      try {
        let url: string;
        if (recommendation.imdb_id) {
          url = `/api/omdb/movie?i=${recommendation.imdb_id}`;
        } else {
          url = `/api/omdb/movie?t=${encodeURIComponent(recommendation.title)}&y=${recommendation.year}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch movie data: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.success && result.data) {
          const movieData = result.data;
          // Cache the result
          movieCache.set(cacheKey, movieData);
          return movieData;
        }

        throw new Error(result.error || 'Failed to fetch movie data');
      } catch (error) {
        console.error(`Error fetching movie data for ${recommendation.title}:`, error);
        return null;
      }
    },
    []
  );

  // Fetch all movie data
  const fetchAllMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const moviePromises = recommendations.map(fetchMovieData);
      const movieResults = await Promise.all(moviePromises);

      // Filter out failed requests
      const validMovies = movieResults.filter((movie): movie is OMDbMovieData => movie !== null);

      if (validMovies.length === 0) {
        setError('Failed to fetch movie data. Please try again.');
      } else {
        setMovies(validMovies);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to fetch movie data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [recommendations, fetchMovieData]);

  // Fetch movies when component mounts or recommendations change
  useEffect(() => {
    if (recommendations.length > 0) {
      fetchAllMovies();
    }
  }, [recommendations, fetchAllMovies]);

  const handleMovieSelect = (movie: OMDbMovieData) => {
    setSelectedMovie(movie);
    setDrawerOpened(true);
  };

  const closeDrawer = () => {
    setDrawerOpened(false);
    setSelectedMovie(null);
  };

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Stack gap="xl" align="center" justify="center" style={{ minHeight: '400px' }}>
          <Loader size="xl" />
          <Text size="lg" c="dimmed">
            Fetching movie recommendations...
          </Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Stack gap="xl" align="center" justify="center" style={{ minHeight: '400px' }}>
          <Alert title="Error" color="red" variant="light">
            {error}
          </Alert>
          <Button onClick={onBack} leftSection={<IconArrowLeft size={16} />}>
            Back to Search
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Paper p="lg" radius="md" bg="blue.0" withBorder>
          <Group justify="space-between" align="center">
            <div>
              <Text c="blue.7" size="sm">
                Here are your personalized movie suggestions
              </Text>
            </div>
            <Group gap="md">
              <Badge variant="filled" color="blue" size="lg">
                {movies.length} Movies
              </Badge>
              <Button
                variant="light"
                color="gray"
                onClick={onBack}
                leftSection={<IconArrowLeft size={16} />}
              >
                Back to Search
              </Button>
            </Group>
          </Group>
        </Paper>

        {/* Movie Grid */}
        <Grid gutter="md">
          {movies.map((movie) => (
            <Grid.Col key={movie.imdbId} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className={classes.movieCard}
                onClick={() => handleMovieSelect(movie)}
              >
                <Card.Section>
                  <Image
                    src={
                      movie.poster !== 'N/A'
                        ? movie.poster
                        : 'https://placehold.co/300x450/666666/FFFFFF?text=No+Poster'
                    }
                    height={300}
                    alt={movie.title}
                    fallbackSrc="https://placehold.co/300x450/666666/FFFFFF?text=No+Poster"
                    className={classes.moviePoster}
                  />
                </Card.Section>

                <Stack gap="xs" mt="md">
                  <Title order={4} className={classes.movieTitle}>
                    {movie.title}
                  </Title>

                  <Group gap="xs" wrap="wrap">
                    <Badge variant="light" color="blue" size="sm">
                      {movie.year}
                    </Badge>
                    {movie.genre.slice(0, 2).map((genre) => (
                      <Badge
                        key={genre}
                        variant="outline"
                        color="gray"
                        size="sm"
                        className={classes.genreBadge}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </Group>

                  <Group gap="xs" c="dimmed" className={classes.ratingGroup}>
                    {movie.imdbRating && (
                      <Group gap={4}>
                        <IconStar size={14} fill="gold" />
                        <Text size="sm">{movie.imdbRating}</Text>
                      </Group>
                    )}
                    <Group gap={4}>
                      <IconClock size={14} />
                      <Text size="sm">{movie.runtime}</Text>
                    </Group>
                  </Group>

                  <Text size="sm" c="dimmed" className={classes.moviePlot}>
                    {movie.plot}
                  </Text>

                  <Button
                    variant="light"
                    color="blue"
                    fullWidth
                    mt="auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMovieSelect(movie);
                    }}
                  >
                    View Details
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* Movie Details Drawer */}
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          position="right"
          size="lg"
          title={
            <Group justify="space-between" w="100%">
              <Text size="lg" fw={600}>
                Movie Details
              </Text>
              <ActionIcon variant="subtle" onClick={closeDrawer}>
                <IconX size={20} />
              </ActionIcon>
            </Group>
          }
        >
          {selectedMovie && (
            <ScrollArea h="calc(100vh - 120px)" className={classes.drawerContent}>
              <Stack gap="lg">
                {/* Large Poster */}
                <Paper className={classes.posterContainer}>
                  <Image
                    src={
                      selectedMovie.poster !== 'N/A'
                        ? selectedMovie.poster
                        : 'https://placehold.co/400x600/666666/FFFFFF?text=No+Poster'
                    }
                    height={400}
                    alt={selectedMovie.title}
                    fallbackSrc="https://placehold.co/400x600/666666/FFFFFF?text=No+Poster"
                    radius="md"
                  />
                </Paper>

                {/* Basic Info */}
                <Stack gap="md">
                  <Title order={2}>{selectedMovie.title}</Title>

                  <Group gap="lg">
                    {selectedMovie.imdbRating && (
                      <Group gap={4} className={classes.ratingGroup}>
                        <IconStar size={20} fill="gold" />
                        <Text size="lg" fw={600}>
                          {selectedMovie.imdbRating}/10
                        </Text>
                      </Group>
                    )}
                    <Group gap={4}>
                      <IconCalendar size={20} />
                      <Text size="lg">{selectedMovie.year}</Text>
                    </Group>
                    <Group gap={4}>
                      <IconClock size={20} />
                      <Text size="lg">{selectedMovie.runtime}</Text>
                    </Group>
                  </Group>

                  {/* Genres */}
                  <Group gap="xs" wrap="wrap">
                    {selectedMovie.genre.map((genre) => (
                      <Badge
                        key={genre}
                        variant="filled"
                        color="blue"
                        size="md"
                        className={classes.genreBadge}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </Group>
                </Stack>

                <Divider />

                {/* Plot */}
                <Stack gap="md">
                  <Title order={3}>Plot</Title>
                  <Text size="md" lh={1.6}>
                    {selectedMovie.plot}
                  </Text>
                </Stack>

                <Divider />

                {/* Additional Details */}
                <Stack gap="md">
                  <Title order={3}>Additional Information</Title>

                  <Grid gutter="md">
                    {selectedMovie.director && (
                      <Grid.Col span={6}>
                        <Paper className={classes.detailCard}>
                          <Text size="sm" c="dimmed" mb={4}>
                            Director
                          </Text>
                          <Text size="md">{selectedMovie.director}</Text>
                        </Paper>
                      </Grid.Col>
                    )}
                    {selectedMovie.writer && (
                      <Grid.Col span={6}>
                        <Paper className={classes.detailCard}>
                          <Text size="sm" c="dimmed" mb={4}>
                            Writer
                          </Text>
                          <Text size="md">{selectedMovie.writer}</Text>
                        </Paper>
                      </Grid.Col>
                    )}
                    {selectedMovie.metascore && (
                      <Grid.Col span={6}>
                        <Paper className={classes.detailCard}>
                          <Text size="sm" c="dimmed" mb={4}>
                            Metascore
                          </Text>
                          <Text size="md">{selectedMovie.metascore}</Text>
                        </Paper>
                      </Grid.Col>
                    )}
                    {selectedMovie.boxOffice && (
                      <Grid.Col span={6}>
                        <Paper className={classes.detailCard}>
                          <Text size="sm" c="dimmed" mb={4}>
                            Box Office
                          </Text>
                          <Text size="md">{selectedMovie.boxOffice}</Text>
                        </Paper>
                      </Grid.Col>
                    )}
                  </Grid>
                </Stack>
              </Stack>
            </ScrollArea>
          )}
        </Drawer>
      </Stack>
    </Container>
  );
}

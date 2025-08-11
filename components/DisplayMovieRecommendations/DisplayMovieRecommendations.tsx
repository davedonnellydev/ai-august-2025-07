'use client';

import { useState } from 'react';
import { IconX, IconStar, IconClock, IconCalendar } from '@tabler/icons-react';
import {
  Container,
  Grid,
  Card,
  Image,
  Text,
  Group,
  Badge,
  Button,
  Drawer,
  Stack,
  Divider,
  Paper,
  Title,
  ScrollArea,
  ActionIcon,
} from '@mantine/core';
import classes from './DisplayMovieRecommendations.module.css';

// Mock data for demonstration - will be replaced with real data later
const MOCK_MOVIES = [
  {
    id: 1,
    title: 'Guardians of the Galaxy Vol. 2',
    year: 2017,
    imdbId: 'tt3896198',
    poster:
      'https://m.media-amazon.com/images/M/MV5BNjM0NTc0NzItM2FlYS00YzEwLWE0YmUtNTA2ZWIzODc2OTgxXkEyXkFqcGdeQXVyNTgwNzIyNzg@._V1_SX300.jpg',
    rating: 7.6,
    runtime: '136 min',
    genre: ['Action', 'Adventure', 'Comedy'],
    plot: "The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father the ambitious celestial being Ego.",
  },
  {
    id: 2,
    title: 'The Dark Knight',
    year: 2008,
    imdbId: 'tt0468569',
    poster:
      'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
    rating: 9.0,
    runtime: '152 min',
    genre: ['Action', 'Crime', 'Drama'],
    plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
  },
  {
    id: 3,
    title: 'Inception',
    year: 2010,
    imdbId: 'tt1375666',
    poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    rating: 8.8,
    runtime: '148 min',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    year: 1994,
    imdbId: 'tt0110912',
    poster:
      'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    rating: 8.9,
    runtime: '154 min',
    genre: ['Crime', 'Drama'],
    plot: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
  },
  {
    id: 5,
    title: 'The Shawshank Redemption',
    year: 1994,
    imdbId: 'tt0111161',
    poster:
      'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
    rating: 9.3,
    runtime: '142 min',
    genre: ['Drama'],
    plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
  },
];

interface Movie {
  id: number;
  title: string;
  year: number;
  imdbId: string;
  poster: string;
  rating: number;
  runtime: string;
  genre: string[];
  plot: string;
}

export function DisplayMovieRecommendations() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [drawerOpened, setDrawerOpened] = useState(false);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setDrawerOpened(true);
  };

  const closeDrawer = () => {
    setDrawerOpened(false);
    setSelectedMovie(null);
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Paper p="lg" radius="md" bg="blue.0" withBorder>
          <Group justify="space-between" align="center">
            <div>
              <Title order={2} c="blue.8">
                🎬 Movie Recommendations
              </Title>
              <Text c="blue.7" size="sm">
                Here are your personalized movie suggestions
              </Text>
            </div>
            <Badge variant="filled" color="blue" size="lg">
              {MOCK_MOVIES.length} Movies
            </Badge>
          </Group>
        </Paper>

        {/* Movie Grid */}
        <Grid gutter="md">
          {MOCK_MOVIES.map((movie) => (
            <Grid.Col key={movie.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
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
                    src={movie.poster}
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
                    <Group gap={4}>
                      <IconStar size={14} fill="gold" />
                      <Text size="sm">{movie.rating}</Text>
                    </Group>
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
                    src={selectedMovie.poster}
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
                    <Group gap={4} className={classes.ratingGroup}>
                      <IconStar size={20} fill="gold" />
                      <Text size="lg" fw={600}>
                        {selectedMovie.rating}/10
                      </Text>
                    </Group>
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

                {/* Additional Details (placeholder for OMDb data) */}
                <Stack gap="md">
                  <Title order={3}>Additional Information</Title>

                  <Grid gutter="md">
                    <Grid.Col span={6}>
                      <Paper className={classes.detailCard}>
                        <Text size="sm" c="dimmed" mb={4}>
                          Director
                        </Text>
                        <Text size="md">Christopher Nolan</Text>
                      </Paper>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Paper className={classes.detailCard}>
                        <Text size="sm" c="dimmed" mb={4}>
                          Writer
                        </Text>
                        <Text size="md">Christopher Nolan</Text>
                      </Paper>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Paper className={classes.detailCard}>
                        <Text size="sm" c="dimmed" mb={4}>
                          Metascore
                        </Text>
                        <Text size="md">74</Text>
                      </Paper>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Paper className={classes.detailCard}>
                        <Text size="sm" c="dimmed" mb={4}>
                          Box Office
                        </Text>
                        <Text size="md">$836.8M</Text>
                      </Paper>
                    </Grid.Col>
                  </Grid>
                </Stack>

                {/* Action Buttons */}
                <Stack gap="md">
                  <Button variant="filled" color="blue" size="lg" fullWidth>
                    Add to Watchlist
                  </Button>
                  <Button variant="light" color="gray" size="md" fullWidth>
                    Share Movie
                  </Button>
                </Stack>
              </Stack>
            </ScrollArea>
          )}
        </Drawer>
      </Stack>
    </Container>
  );
}

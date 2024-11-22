import { View, Text, ScrollView, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { TMDB_API_KEY } from '../env';

export default function HomeScreen() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const [trending, popular, topRated, upcoming, nowPlaying] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`).then(res => res.json()),
          fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`).then(res => res.json()),
          fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}`).then(res => res.json()),
          fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}`).then(res => res.json()),
          fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}`).then(res => res.json()),
        ]);

        setTrendingMovies(trending.results);
        setPopularMovies(popular.results);
        setTopRatedMovies(topRated.results);
        setUpcomingMovies(upcoming.results);
        setNowPlayingMovies(nowPlaying.results);
      } catch (error) {
        console.error('Error loading movies:', error);
      }
    };

    loadMovies();
  }, []);

  const MovieRow = ({ title, data }) => (
    <View className="mb-8">
      <Text className="text-white text-xl font-bold mb-3 px-4">
        {title}
      </Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <MovieCard movie={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );

  return (
    <ScrollView className="bg-neutral-900">
      <MovieRow title="Trending Now" data={trendingMovies} />
      <MovieRow title="Popular" data={popularMovies} />
      <MovieRow title="Top Rated" data={topRatedMovies} />
      <MovieRow title="Upcoming" data={upcomingMovies} />
      <MovieRow title="Now Playing" data={nowPlayingMovies} />
    </ScrollView>
  );
} 
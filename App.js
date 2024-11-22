import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import MovieCard from './components/MovieCard';
import { fetchTrendingMovies, fetchPopularMovies } from './utils/api';
import "./global.css"
export default function App() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      const trending = await fetchTrendingMovies();
      const popular = await fetchPopularMovies();
      setTrendingMovies(trending);
      setPopularMovies(popular);
    };

    loadMovies();
  }, []);

  return (
    <View className="flex-1 bg-neutral-900">
      <Header />
      <ScrollView className="px-4">
        <Text className="text-white text-xl font-bold mt-4 mb-3">
          Trending Movies
        </Text>
        <FlatList
          data={trendingMovies}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <MovieCard movie={item} />}
          keyExtractor={(item) => item.id.toString()}
        />

        <Text className="text-white text-xl font-bold mt-6 mb-3">
          Popular Movies
        </Text>
        <FlatList
          data={popularMovies}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <MovieCard movie={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { TMDB_API_KEY } from '../env';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';

export default function MoviesScreen() {
  const [activeCategory, setActiveCategory] = useState('Now Playing');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'now_playing', title: 'Now Playing' },
    { id: 'popular', title: 'Popular' },
    { id: 'top_rated', title: 'Top Rated' },
    { id: 'upcoming', title: 'Upcoming' },
  ];

  useEffect(() => {
    fetchMovies(activeCategory.toLowerCase().replace(' ', '_'));
  }, [activeCategory]);

  const fetchMovies = async (category) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${category}?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <View className="flex-1 bg-neutral-900">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-4">
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setActiveCategory(category.title)}
            className={`mr-4 px-4 py-2 rounded-full ${
              activeCategory === category.title ? 'bg-neutral-700' : 'bg-neutral-800'
            }`}
          >
            <Text className={`${
              activeCategory === category.title ? 'text-white' : 'text-neutral-400'
            } font-semibold`}>
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={movies}
        numColumns={2}
        className="px-4"
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <View className="w-[48%] mb-4">
            <MovieCard movie={item} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { TMDB_API_KEY } from '../env';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';

export default function TVShowsScreen() {
  const [activeCategory, setActiveCategory] = useState('Popular');
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'popular', title: 'Popular' },
    { id: 'top_rated', title: 'Top Rated' },
    { id: 'on_the_air', title: 'On TV' },
    { id: 'airing_today', title: 'Airing Today' },
  ];

  useEffect(() => {
    fetchShows(activeCategory.toLowerCase().replace(' ', '_'));
  }, [activeCategory]);

  const fetchShows = async (category) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${category}?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      setShows(data.results);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
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
        data={shows}
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
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { TMDB_API_KEY } from '../env';
import MovieCard from '../components/MovieCard';
import { MagnifyingGlassIcon } from "react-native-heroicons/solid";
import Loading from '../components/Loading';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchMovies();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      setResults(data.results.filter(item => item.media_type !== 'person'));
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-neutral-900 px-4 pt-4">
      <View className="flex-row items-center bg-neutral-800 rounded-full px-4 py-2 mb-4">
        <MagnifyingGlassIcon size={20} color="#fff" />
        <TextInput
          className="flex-1 text-white ml-2"
          placeholder="Search movies & TV shows..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={results}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <View className="w-[48%] mb-4">
              <MovieCard movie={item} />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-neutral-400 text-lg">
                {searchQuery ? 'No results found' : 'Search for movies & TV shows'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
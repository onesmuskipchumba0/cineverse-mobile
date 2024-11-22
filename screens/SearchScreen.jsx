import { View, Text, TextInput, FlatList, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { TMDB_API_KEY } from '../env';
import MovieCard from '../components/MovieCard';
import { MagnifyingGlassIcon } from "react-native-heroicons/solid";
import Loading from '../components/Loading';
import Layout from '../components/Layout';

const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 16;
const cardWidth = (width - (gap * (numColumns + 1))) / numColumns;

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
    <Layout>
      <View className="flex-1 px-4">
        <View className="flex-row items-center bg-neutral-800 rounded-full px-4 py-2 mb-4">
          <MagnifyingGlassIcon size={20} color="#fff" />
          <TextInput
            className="flex-1 text-white ml-2 text-base"
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
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ 
              justifyContent: 'space-between',
              gap: gap 
            }}
            contentContainerStyle={{
              gap: gap,
              paddingBottom: 20
            }}
            renderItem={({ item }) => (
              <MovieCard movie={item} />
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
    </Layout>
  );
}
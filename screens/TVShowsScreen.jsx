import { View, FlatList, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { TMDB_API_KEY } from '../env';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import Layout from '../components/Layout';
import CategoryList from '../components/CategoryList';

const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 16;
const cardWidth = (width - (gap * (numColumns + 1))) / numColumns;

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
    <Layout>
      <View className="flex-1">
        <CategoryList 
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        
        <FlatList
          data={shows}
          numColumns={numColumns}
          className="px-4 pt-4"
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
        />
      </View>
    </Layout>
  );
}
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon, StarIcon, ClockIcon } from "react-native-heroicons/solid";
import { TMDB_API_KEY } from '../env';
import Loading from '../components/Loading';

const { width, height } = Dimensions.get('window');

export default function MovieDetailScreen({ route }) {
  const { movieId } = route.params;
  const navigation = useNavigation();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
      );
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!movie) return null;

  return (
    <View className="flex-1 bg-neutral-900">
      {/* Back Button */}
      <TouchableOpacity 
        className="absolute z-10 top-12 left-4 bg-neutral-800 p-2 rounded-full"
        onPress={() => navigation.goBack()}
      >
        <ChevronLeftIcon size={28} color="white" />
      </TouchableOpacity>

      <ScrollView>
        {/* Poster Image */}
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
            }}
            style={{ width: width, height: height * 0.3 }}
            className="opacity-50"
          />
          <View className="absolute bottom-0 p-6">
            <Text className="text-white text-3xl font-bold">{movie.title}</Text>
          </View>
        </View>

        {/* Movie Info */}
        <View className="p-4">
          {/* Rating and Runtime */}
          <View className="flex-row items-center space-x-4 mb-4">
            <View className="flex-row items-center">
              <StarIcon size={20} color="#FCD34D" />
              <Text className="text-white ml-1">
                {movie.vote_average.toFixed(1)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <ClockIcon size={20} color="white" />
              <Text className="text-white ml-1">
                {movie.runtime} min
              </Text>
            </View>
          </View>

          {/* Genres */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {movie.genres.map(genre => (
              <View key={genre.id} className="bg-neutral-800 px-3 py-1 rounded-full">
                <Text className="text-white">{genre.name}</Text>
              </View>
            ))}
          </View>

          {/* Overview */}
          <View className="mb-4">
            <Text className="text-white text-lg font-bold mb-2">Overview</Text>
            <Text className="text-neutral-400 leading-6">
              {movie.overview}
            </Text>
          </View>

          {/* Cast */}
        </View>
      </ScrollView>
    </View>
  );
} 
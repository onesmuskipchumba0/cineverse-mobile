import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon, StarIcon } from "react-native-heroicons/solid";
import { TMDB_API_KEY } from '../env';
import Loading from '../components/Loading';

const { width, height } = Dimensions.get('window');

export default function TVShowDetailScreen({ route }) {
  const { showId } = route.params;
  const navigation = useNavigation();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  const fetchShowDetails = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
      );
      const data = await response.json();
      setShow(data);
    } catch (error) {
      console.error('Error fetching show details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!show) return null;

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
        {/* Show Poster */}
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${show.backdrop_path}`
            }}
            style={{ width: width, height: height * 0.3 }}
            className="opacity-50"
          />
          <View className="absolute bottom-0 p-6">
            <Text className="text-white text-3xl font-bold">{show.name}</Text>
          </View>
        </View>

        {/* Show Info */}
        <View className="p-4">
          {/* Rating and Seasons */}
          <View className="flex-row items-center space-x-4 mb-4">
            <View className="flex-row items-center">
              <StarIcon size={20} color="#FCD34D" />
              <Text className="text-white ml-1">
                {show.vote_average.toFixed(1)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white ml-1">
                {show.number_of_seasons} seasons
              </Text>
            </View>
          </View>

          {/* Genres */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {show.genres.map(genre => (
              <View key={genre.id} className="bg-neutral-800 px-3 py-1 rounded-full">
                <Text className="text-white">{genre.name}</Text>
              </View>
            ))}
          </View>

          {/* Overview */}
          <View className="mb-4">
            <Text className="text-white text-lg font-bold mb-2">Overview</Text>
            <Text className="text-neutral-400 leading-6">
              {show.overview}
            </Text>
          </View>

          {/* Cast */}
          <View>
            <Text className="text-white text-lg font-bold mb-2">Cast</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="gap-4"
            >
              {show.credits.cast.slice(0, 10).map(actor => (
                <View key={actor.id} className="items-center w-20">
                  <Image
                    source={{
                      uri: actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'
                    }}
                    className="w-20 h-20 rounded-full mb-1"
                  />
                  <Text className="text-white text-center text-xs" numberOfLines={2}>
                    {actor.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 
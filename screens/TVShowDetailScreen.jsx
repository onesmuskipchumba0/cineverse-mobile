import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon, StarIcon, CalendarIcon, FilmIcon, HeartIcon } from "react-native-heroicons/solid";
import { LinearGradient } from 'expo-linear-gradient';
import { TMDB_API_KEY } from '../env';
import Loading from '../components/Loading';

const { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';

export default function TVShowDetailScreen({ route }) {
  const { showId } = route.params;
  const navigation = useNavigation();
  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarShows, setSimilarShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const [showRes, creditsRes, similarRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/tv/${showId}?api_key=${TMDB_API_KEY}`),
          fetch(`https://api.themoviedb.org/3/tv/${showId}/credits?api_key=${TMDB_API_KEY}`),
          fetch(`https://api.themoviedb.org/3/tv/${showId}/similar?api_key=${TMDB_API_KEY}`)
        ]);

        const [showData, creditsData, similarData] = await Promise.all([
          showRes.json(),
          creditsRes.json(),
          similarRes.json()
        ]);

        setShow(showData);
        setCast(creditsData.cast);
        setSimilarShows(similarData.results);
      } catch (error) {
        console.error('Error fetching show details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [showId]);

  if (loading) return <Loading />;
  if (!show) return null;

  return (
    <ScrollView className="flex-1 bg-neutral-900">
      {/* Header Image Section */}
      <View className="relative">
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original${show.backdrop_path}`
          }}
          style={{ width, height: height * 0.5 }}
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(23, 23, 23, 0.8)', 'rgba(23, 23, 23, 1)']}
          style={{ width, height: height * 0.5 }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className="absolute bottom-0"
        />

        {/* Navigation Header */}
        <SafeAreaView className="absolute w-full">
          <View className="flex-row justify-between items-center px-4 pt-12">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="rounded-xl p-2 bg-neutral-800/50"
            >
              <ChevronLeftIcon size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsFavorite(!isFavorite)}
              className="rounded-xl p-2 bg-neutral-800/50"
            >
              <HeartIcon size={28} color={isFavorite ? '#ef4444' : 'white'} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Show Info Overlay */}
        <View className="absolute bottom-0 left-0 right-0 p-6">
          <Text className="text-white text-3xl font-bold mb-2">
            {show.name}
          </Text>
          
          <View className="flex-row items-center space-x-4 mb-3">
            <View className="flex-row items-center">
              <StarIcon size={20} color="#FCD34D" />
              <Text className="text-white ml-1">
                {show.vote_average?.toFixed(1)}
              </Text>
            </View>
            <Text className="text-neutral-300">
              {show.first_air_date?.split('-')[0]}
            </Text>
            <Text className="text-neutral-300">
              {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {show.genres?.map(genre => (
              <View key={genre.id} className="bg-neutral-800/60 px-3 py-1 rounded-full">
                <Text className="text-white text-sm">{genre.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View className="px-4 py-6">
        {/* Overview */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-3">Overview</Text>
          <Text className="text-neutral-400 leading-6">
            {show.overview}
          </Text>
        </View>

        {/* Cast Section */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-3">Cast</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {cast.slice(0, 10).map(person => (
              <View key={person.id} className="items-center w-24">
                <View className="w-24 h-24 rounded-2xl overflow-hidden mb-2">
                  <Image
                    source={{
                      uri: person.profile_path
                        ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'
                    }}
                    className="w-full h-full"
                  />
                </View>
                <Text className="text-white text-sm text-center" numberOfLines={1}>
                  {person.name}
                </Text>
                <Text className="text-neutral-500 text-xs text-center" numberOfLines={1}>
                  {person.character}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Seasons Section */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-3">Seasons</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {show.seasons?.map(season => (
              <View key={season.id} className="w-32">
                <Image
                  source={{
                    uri: season.poster_path
                      ? `https://image.tmdb.org/t/p/w200${season.poster_path}`
                      : 'https://via.placeholder.com/200x300?text=No+Image'
                  }}
                  className="w-32 h-48 rounded-xl mb-2"
                />
                <Text className="text-white text-sm" numberOfLines={1}>
                  {season.name}
                </Text>
                <Text className="text-neutral-500 text-xs">
                  {season.episode_count} Episodes
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Similar Shows */}
        {similarShows.length > 0 && (
          <View>
            <Text className="text-white text-xl font-bold mb-3">Similar Shows</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            >
              {similarShows.map(similar => (
                <TouchableOpacity 
                  key={similar.id}
                  onPress={() => navigation.push('TVShowDetail', { showId: similar.id })}
                >
                  <Image
                    source={{
                      uri: similar.poster_path
                        ? `https://image.tmdb.org/t/p/w200${similar.poster_path}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'
                    }}
                    className="w-32 h-48 rounded-xl mb-2"
                  />
                  <Text className="text-white text-sm w-32" numberOfLines={2}>
                    {similar.name}
                  </Text>
                  <View className="flex-row items-center">
                    <StarIcon size={16} color="#FCD34D" />
                    <Text className="text-neutral-500 text-xs ml-1">
                      {similar.vote_average?.toFixed(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
} 
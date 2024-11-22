import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon, StarIcon, CalendarIcon, FilmIcon, HeartIcon } from "react-native-heroicons/solid";
import { LinearGradient } from 'expo-linear-gradient';
import { TMDB_API_KEY } from '../env';
import Loading from '../components/Loading';

const { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';

const fallbackPoster = "https://img.myloview.com/posters/movie-icon-in-trendy-design-style-movie-icon-isolated-on-white-background-movie-vector-icon-simple-and-modern-flat-symbol-for-web-site-mobile-logo-app-ui-movie-icon-vector-illustration-eps10-700-199565986.jpg";
const fallbackPersonImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmUiF-YGjavA63_Au8jQj7zxnFxS_Ay9xc6pxleMqCxH92SzeNSDkC&usqp=CAE&s";
const fallbackCompanyLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";

export default function TVShowDetailScreen({ route }) {
  const { showId } = route.params;
  const navigation = useNavigation();
  
  // Initialize with empty arrays to prevent undefined errors
  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]); // Initialize as empty array
  const [similarShows, setSimilarShows] = useState([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  const fetchShowDetails = async () => {
    try {
      setIsLoading(true);
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
      setCast(creditsData.cast || []); // Add fallback empty array
      setSimilarShows(similarData.results || []); // Add fallback empty array
    } catch (error) {
      console.error('Error fetching show details:', error);
      // Set empty arrays on error
      setCast([]);
      setSimilarShows([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-neutral-900 justify-center items-center">
        <Loading />
      </View>
    );
  }

  if (!show) {
    return (
      <View className="flex-1 bg-neutral-900 justify-center items-center">
        <Text className="text-white text-lg">Show not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-900">
      <StatusBar barStyle="light-content" />
      <ScrollView 
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Image Section */}
        <View className="w-full relative">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original${show.backdrop_path}`
            }}
            style={{ 
              width, 
              height: height * 0.55
            }}
            className="rounded-b-[40px]"
          />
          
          <LinearGradient
            colors={['transparent', 'rgba(23, 23, 23, 0.8)', 'rgba(23, 23, 23, 1)']}
            style={{ 
              width, 
              height: height * 0.55
            }}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="absolute bottom-0 rounded-b-[40px]"
          />

          {/* Navigation Header */}
          <View 
            style={{ 
              marginTop: ios ? 50 : StatusBar.currentHeight + 10
            }} 
            className="absolute w-full z-20"
          >
            <View className="flex-row justify-between items-center mx-6">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="rounded-xl p-3 bg-neutral-800/50 backdrop-blur-sm"
              >
                <ChevronLeftIcon size={28} color="white" strokeWidth={2.5} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsFavorite(!isFavorite)}
                className="rounded-xl p-3 bg-neutral-800/50 backdrop-blur-sm"
              >
                <HeartIcon size={28} color={isFavorite ? '#ef4444' : 'white'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Show Info Overlay */}
          <View 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingHorizontal: 24,
              paddingBottom: ios ? 24 : 20,
            }}
          >
            {/* Title */}
            <Text 
              style={{ 
                color: 'white',
                fontSize: ios ? 34 : 30,
                fontWeight: 'bold',
                marginBottom: 16,
                letterSpacing: 0.5,
              }}
              numberOfLines={2}
            >
              {show.name}
            </Text>
            
            {/* Show Stats */}
            <View 
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
                gap: 24,
              }}
            >
              {/* Rating */}
              <View className="flex-row items-center">
                <StarIcon size={20} color="#FCD34D" />
                <Text className="text-white text-base font-semibold ml-1.5">
                  {show.vote_average?.toFixed(1)}
                </Text>
              </View>

              {/* First Air Date */}
              <View className="flex-row items-center">
                <CalendarIcon size={20} color="white" />
                <Text className="text-white text-base ml-1.5">
                  {show.first_air_date?.split('-')[0]}
                </Text>
              </View>

              {/* Seasons */}
              <View className="flex-row items-center">
                <FilmIcon size={20} color="white" />
                <Text className="text-white text-base ml-1.5">
                  {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            {/* Genres */}
            <View 
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {show.genres?.map(genre => (
                <View 
                  key={genre.id} 
                  style={{
                    backgroundColor: 'rgba(38, 38, 38, 0.8)',
                    borderRadius: 20,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    marginBottom: 4,
                  }}
                >
                  <Text 
                    style={{
                      color: 'white',
                      fontSize: ios ? 15 : 14,
                      fontWeight: '500',
                    }}
                  >
                    {genre.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Content continues with the same styling as MovieDetailScreen... */}
      </ScrollView>
    </View>
  );
} 
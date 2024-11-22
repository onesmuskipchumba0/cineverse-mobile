import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon, StarIcon, ClockIcon, CalendarIcon, HeartIcon } from "react-native-heroicons/solid";
import { LinearGradient } from 'expo-linear-gradient';
import { TMDB_API_KEY } from '../env';
import Loading from '../components/Loading';

const { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';
const topMargin = ios ? 0 : StatusBar.currentHeight;
const verticalOffset = ios ? 16 : 8;

const fallbackMoviePoster = "https://img.myloview.com/posters/movie-icon-in-trendy-design-style-movie-icon-isolated-on-white-background-movie-vector-icon-simple-and-modern-flat-symbol-for-web-site-mobile-logo-app-ui-movie-icon-vector-illustration-eps10-700-199565986.jpg";
const fallbackPersonImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmUiF-YGjavA63_Au8jQj7zxnFxS_Ay9xc6pxleMqCxH92SzeNSDkC&usqp=CAE&s";
const fallbackCompanyLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";

export default function MovieDetailScreen({ route }) {
  const { movieId } = route.params;
  const navigation = useNavigation();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        const [movieRes, creditsRes, similarRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`)
        ]);

        const [movieData, creditsData, similarData] = await Promise.all([
          movieRes.json(),
          creditsRes.json(),
          similarRes.json()
        ]);

        setMovie(movieData);
        setCast(creditsData.cast || []);
        setSimilarMovies(similarData.results || []);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setCast([]);
        setSimilarMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-neutral-900 justify-center items-center">
        <Loading />
      </View>
    );
  }

  if (!movie) {
    return (
      <View className="flex-1 bg-neutral-900 justify-center items-center">
        <Text className="text-white text-lg">Movie not found</Text>
      </View>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
              uri: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
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

          {/* Movie Info Overlay */}
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
              {movie.title}
            </Text>
            
            {/* Movie Stats */}
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
                  {movie.vote_average?.toFixed(1)}
                </Text>
              </View>

              {/* Year */}
              <View className="flex-row items-center">
                <CalendarIcon size={20} color="white" />
                <Text className="text-white text-base ml-1.5">
                  {movie.release_date?.split('-')[0]}
                </Text>
              </View>

              {/* Runtime */}
              <View className="flex-row items-center">
                <ClockIcon size={20} color="white" />
                <Text className="text-white text-base ml-1.5">
                  {movie.runtime} min
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
              {movie.genres?.map(genre => (
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

        {/* Content Section */}
        <View className={`px-6 mt-${ios ? 12 : 10}`}>
          {/* Overview */}
          <View className="mb-8">
            <Text 
              className="text-white font-bold tracking-wide mb-4"
              style={{ fontSize: ios ? 24 : 22 }}
            >
              Overview
            </Text>
            <Text 
              className="text-neutral-400 leading-7"
              style={{ fontSize: ios ? 16 : 15 }}
            >
              {movie.overview}
            </Text>
          </View>

          {/* Cast Section */}
          {cast.length > 0 && (
            <View className="mb-8">
              <Text 
                className="text-white font-bold tracking-wide mb-6"
                style={{ fontSize: ios ? 24 : 22 }}
              >
                Top Cast
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ 
                  paddingRight: 24,
                  gap: ios ? 24 : 20
                }}
              >
                {cast.slice(0, 10).map(person => (
                  <TouchableOpacity 
                    key={person.id} 
                    className="items-center"
                    style={{ width: ios ? 96 : 88 }}
                  >
                    <View className="rounded-full overflow-hidden mb-3 border-2 border-neutral-700"
                      style={{ 
                        width: ios ? 96 : 88,
                        height: ios ? 96 : 88
                      }}
                    >
                      <Image
                        source={{
                          uri: person.profile_path
                            ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                            : fallbackPersonImage
                        }}
                        className="w-full h-full"
                        style={{ resizeMode: 'cover' }}
                      />
                    </View>
                    <Text 
                      className="text-white text-center font-medium"
                      style={{ fontSize: ios ? 15 : 14 }}
                      numberOfLines={1}
                    >
                      {person.name}
                    </Text>
                    <Text 
                      className="text-neutral-500 text-center mt-1"
                      style={{ fontSize: ios ? 13 : 12 }}
                      numberOfLines={1}
                    >
                      {person.character}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <View className="mb-8">
              <Text 
                className="text-white font-bold tracking-wide mb-6"
                style={{ fontSize: ios ? 24 : 22 }}
              >
                Similar Movies
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ 
                  paddingRight: 24,
                  gap: ios ? 24 : 20
                }}
              >
                {similarMovies.map(similar => (
                  <TouchableOpacity 
                    key={similar.id}
                    onPress={() => navigation.push('MovieDetail', { movieId: similar.id })}
                    style={{ width: ios ? 150 : 140 }}
                  >
                    <View className="relative">
                      <Image
                        source={{
                          uri: similar.poster_path
                            ? `https://image.tmdb.org/t/p/w500${similar.poster_path}`
                            : fallbackMoviePoster
                        }}
                        style={{ 
                          width: ios ? 150 : 140,
                          height: ios ? 225 : 210,
                        }}
                        className="rounded-3xl"
                      />
                      <View className="absolute top-2 right-2 bg-black/60 rounded-full px-2.5 py-1.5 flex-row items-center">
                        <StarIcon size={12} color="#FCD34D" />
                        <Text className="text-white ml-1"
                          style={{ fontSize: ios ? 13 : 12 }}
                        >
                          {similar.vote_average?.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                    <Text 
                      className="text-white font-medium mt-2"
                      style={{ fontSize: ios ? 15 : 14 }}
                      numberOfLines={1}
                    >
                      {similar.title}
                    </Text>
                    <Text 
                      className="text-neutral-400 mt-1"
                      style={{ fontSize: ios ? 13 : 12 }}
                    >
                      {similar.release_date?.split('-')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Additional Info */}
          <View className="mb-12 bg-neutral-800/50 rounded-3xl p-6 space-y-4">
            {movie.budget > 0 && (
              <View className="flex-row justify-between items-center">
                <Text 
                  className="text-neutral-400"
                  style={{ fontSize: ios ? 16 : 15 }}
                >
                  Budget
                </Text>
                <Text 
                  className="text-white font-medium"
                  style={{ fontSize: ios ? 16 : 15 }}
                >
                  {formatCurrency(movie.budget)}
                </Text>
              </View>
            )}
            {movie.revenue > 0 && (
              <View className="flex-row justify-between items-center">
                <Text 
                  className="text-neutral-400"
                  style={{ fontSize: ios ? 16 : 15 }}
                >
                  Revenue
                </Text>
                <Text 
                  className="text-white font-medium"
                  style={{ fontSize: ios ? 16 : 15 }}
                >
                  {formatCurrency(movie.revenue)}
                </Text>
              </View>
            )}
            <View className="flex-row justify-between items-center">
              <Text 
                className="text-neutral-400"
                style={{ fontSize: ios ? 16 : 15 }}
              >
                Status
              </Text>
              <Text 
                className="text-white font-medium"
                style={{ fontSize: ios ? 16 : 15 }}
              >
                {movie.status}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
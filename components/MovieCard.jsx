import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { StarIcon } from "react-native-heroicons/solid";
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;

export default function MovieCard({ movie, isTV = false }) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (isTV) {
      navigation.navigate('TVShowDetail', { showId: movie.id });
    } else {
      navigation.navigate('MovieDetail', { movieId: movie.id });
    }
  };

  return (
    <TouchableOpacity 
      className="mb-4"
      onPress={handlePress}
    >
      <View className="relative">
        <Image
          source={{
            uri: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://via.placeholder.com/500x750?text=No+Poster'
          }}
          style={{
            width: CARD_WIDTH,
            height: CARD_WIDTH * 1.5,
          }}
          className="rounded-xl"
        />
        
        {/* Rating Badge */}
        <View className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-1 flex-row items-center">
          <StarIcon size={12} color="#FCD34D" />
          <Text className="text-white text-xs ml-1">
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text 
        numberOfLines={1} 
        className="text-white text-sm mt-2 font-semibold"
      >
        {movie.title || movie.name}
      </Text>

      {/* Release Year */}
      <Text className="text-neutral-400 text-xs">
        {(movie.release_date || movie.first_air_date)?.split('-')[0] || 'TBA'}
      </Text>
    </TouchableOpacity>
  );
}
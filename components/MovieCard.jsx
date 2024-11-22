import { View, Text, Image } from 'react-native';

export default function MovieCard({ movie }) {
  return (
    <View className="mr-4">
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        }}
        className="rounded-lg w-28 h-40"
      />
      <Text className="text-white mt-1 text-sm" numberOfLines={1}>
        {movie.title}
      </Text>
    </View>
  );
} 
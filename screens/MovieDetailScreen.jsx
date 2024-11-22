import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Platform, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon, StarIcon, ClockIcon, CalendarIcon, HeartIcon } from "react-native-heroicons/solid";
import { LinearGradient } from 'expo-linear-gradient';
import { TMDB_API_KEY } from '../env';
import Loading from '../components/Loading';

const { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';

export default function MovieDetailScreen({ route }) {
  // ... existing state and useEffect ...

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <Loading />;
  if (!movie) return null;

  return (
    <ScrollView 
      className="flex-1 bg-neutral-900"
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Image Section */}
      <View className="w-full relative">
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          }}
          style={{ width, height: height * 0.55 }}
          className="rounded-b-[30px]"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(23, 23, 23, 0.8)', 'rgba(23, 23, 23, 1)']}
          style={{ width, height: height * 0.55 }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className="absolute bottom-0 rounded-b-[30px]"
        />

        {/* Navigation Header */}
        <SafeAreaView className="absolute w-full z-20">
          <View className="flex-row justify-between items-center mx-4 mt-3">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="rounded-xl p-2 bg-neutral-800/50 backdrop-blur-sm"
            >
              <ChevronLeftIcon size={28} color="white" strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsFavorite(!isFavorite)}
              className="rounded-xl p-2 bg-neutral-800/50 backdrop-blur-sm"
            >
              <HeartIcon size={28} color={isFavorite ? '#ef4444' : 'white'} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Movie Info Overlay */}
        <View className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <Text className="text-white text-3xl font-bold tracking-wider mb-4">
            {movie.title}
          </Text>
          
          <View className="flex-row items-center space-x-6 mb-4">
            <View className="flex-row items-center">
              <StarIcon size={22} color="#FCD34D" />
              <Text className="text-white text-base font-semibold ml-1">
                {movie.vote_average?.toFixed(1)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <CalendarIcon size={22} color="white" />
              <Text className="text-white text-base ml-1">
                {movie.release_date?.split('-')[0]}
              </Text>
            </View>
            <View className="flex-row items-center">
              <ClockIcon size={22} color="white" />
              <Text className="text-white text-base ml-1">
                {movie.runtime} min
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {movie.genres?.map(genre => (
              <View key={genre.id} className="bg-neutral-800/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <Text className="text-white text-sm font-medium">{genre.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View className="px-6 mt-8">
        {/* Overview */}
        <View className="mb-8">
          <Text className="text-white text-xl font-bold tracking-wide mb-4">Overview</Text>
          <Text className="text-neutral-400 text-base leading-7">
            {movie.overview}
          </Text>
        </View>

        {/* Cast Section */}
        <View className="mb-8">
          <Text className="text-white text-xl font-bold tracking-wide mb-4">Top Cast</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
            className="space-x-4"
          >
            {cast.slice(0, 10).map(person => (
              <View key={person.id} className="items-center w-24">
                <View className="w-24 h-24 rounded-2xl overflow-hidden mb-2 border border-neutral-700">
                  <Image
                    source={{
                      uri: person.profile_path
                        ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'
                    }}
                    className="w-full h-full"
                  />
                </View>
                <Text className="text-white text-sm font-medium text-center" numberOfLines={1}>
                  {person.name}
                </Text>
                <Text className="text-neutral-500 text-xs text-center mt-1" numberOfLines={1}>
                  {person.character}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Production Companies */}
        {movie.production_companies?.length > 0 && (
          <View className="mb-8">
            <Text className="text-white text-xl font-bold tracking-wide mb-4">Production</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 24 }}
              className="space-x-6"
            >
              {movie.production_companies.map(company => (
                company.logo_path && (
                  <View key={company.id} className="items-center w-32 bg-neutral-800/50 rounded-2xl p-4">
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w200${company.logo_path}`
                      }}
                      className="w-28 h-14"
                      resizeMode="contain"
                    />
                    <Text className="text-neutral-400 text-xs text-center mt-3">
                      {company.name}
                    </Text>
                  </View>
                )
              ))}
            </ScrollView>
          </View>
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <View className="mb-8">
            <Text className="text-white text-xl font-bold tracking-wide mb-4">Similar Movies</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 24 }}
              className="space-x-4"
            >
              {similarMovies.map(similar => (
                <TouchableOpacity 
                  key={similar.id}
                  onPress={() => navigation.push('MovieDetail', { movieId: similar.id })}
                  className="w-32"
                >
                  <Image
                    source={{
                      uri: similar.poster_path
                        ? `https://image.tmdb.org/t/p/w200${similar.poster_path}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'
                    }}
                    className="w-32 h-48 rounded-2xl mb-2"
                  />
                  <Text className="text-white text-sm font-medium" numberOfLines={2}>
                    {similar.title}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <StarIcon size={16} color="#FCD34D" />
                    <Text className="text-neutral-400 text-sm ml-1">
                      {similar.vote_average?.toFixed(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Additional Info */}
        <View className="mb-8 bg-neutral-800/50 rounded-3xl p-6 space-y-4">
          {movie.budget > 0 && (
            <View className="flex-row justify-between items-center">
              <Text className="text-neutral-400 text-base">Budget</Text>
              <Text className="text-white text-base font-medium">
                {formatCurrency(movie.budget)}
              </Text>
            </View>
          )}
          {movie.revenue > 0 && (
            <View className="flex-row justify-between items-center">
              <Text className="text-neutral-400 text-base">Revenue</Text>
              <Text className="text-white text-base font-medium">
                {formatCurrency(movie.revenue)}
              </Text>
            </View>
          )}
          <View className="flex-row justify-between items-center">
            <Text className="text-neutral-400 text-base">Status</Text>
            <Text className="text-white text-base font-medium">{movie.status}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { HomeIcon, FilmIcon, TvIcon, MagnifyingGlassIcon } from "react-native-heroicons/solid";
import { useNavigation, useRoute } from '@react-navigation/native';

export default function TopNavBar() {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    { name: 'Home', icon: HomeIcon, label: 'Home' },
    { name: 'Movies', icon: FilmIcon, label: 'Movies' },
    { name: 'TVShows', icon: TvIcon, label: 'TV Shows' },
    { name: 'Search', icon: MagnifyingGlassIcon, label: 'Search' },
  ];

  return (
    <View className="bg-neutral-900 border-b border-neutral-800">
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        className="flex-row py-3"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isFocused = route.name === tab.name;
          
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => navigation.navigate(tab.name)}
              className={`px-4 py-2 rounded-full flex-row items-center mr-3 
                ${isFocused ? 'bg-neutral-700' : 'bg-neutral-800'}`}
            >
              <Icon 
                size={20} 
                color={isFocused ? '#ffffff' : '#a3a3a3'}
              />
              <Text 
                className={`font-semibold ml-1
                  ${isFocused ? 'text-white' : 'text-neutral-400'}`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
} 
import { View, Text, TouchableOpacity } from 'react-native';
import { HomeIcon, FilmIcon, TvIcon, MagnifyingGlassIcon } from "react-native-heroicons/solid";
import { useNavigation } from '@react-navigation/native';

export default function TopNavBar() {
  const navigation = useNavigation();

  const tabs = [
    { name: 'Home', icon: HomeIcon, label: 'Home' },
    { name: 'Movies', icon: FilmIcon, label: 'Movies' },
    { name: 'TVShows', icon: TvIcon, label: 'TV Shows' },
    { name: 'Search', icon: MagnifyingGlassIcon, label: 'Search' },
  ];

  return (
    <View className="flex-row justify-between items-center px-4 py-3 bg-neutral-900 border-b border-neutral-800">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => navigation.navigate(tab.name)}
            className="px-4 py-2 rounded-full flex-row items-center space-x-1"
          >
            <Icon 
              size={20} 
              color="#fff"
            />
            <Text className="text-white font-semibold ml-1">
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
} 
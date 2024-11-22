import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from './components/Header';
import TopNavBar from './components/TopNavBar';
import HomeScreen from './screens/HomeScreen';
import MoviesScreen from './screens/MoviesScreen';
import TVShowsScreen from './screens/TVShowsScreen';
import SearchScreen from './screens/SearchScreen';
import "./global.css"

const Stack = createNativeStackNavigator();

function MainLayout() {
  return (
    <View className="flex-1 bg-neutral-900">
      <Header />
      <TopNavBar />
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Movies" component={MoviesScreen} />
        <Stack.Screen name="TVShows" component={TVShowsScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MainLayout />
    </NavigationContainer>
  );
}
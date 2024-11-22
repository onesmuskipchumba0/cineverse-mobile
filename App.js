import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import MoviesScreen from './screens/MoviesScreen';
import TVShowsScreen from './screens/TVShowsScreen';
import SearchScreen from './screens/SearchScreen';
import MovieDetailScreen from './screens/MovieDetailScreen';
import TVShowDetailScreen from './screens/TVShowDetailScreen';
import Layout from './components/Layout';
import "./global.css"

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
        <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
        <Stack.Screen name="TVShowDetail" component={TVShowDetailScreen} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from './Header';
import TopNavBar from './TopNavBar';

export default function Layout({ children }) {
  return (
    <View className="flex-1 bg-neutral-900">
      <Header />
      <TopNavBar />
      {children}
    </View>
  );
} 
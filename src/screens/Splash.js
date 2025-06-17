import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Animated,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import { heightToDp as hp, widthToDp as wp } from '../store/responsive';

export default function Splash({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in logo + tagline
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Navigate to user list after 3s
    const timer = setTimeout(() => {
      navigation.dispatch(StackActions.replace('UsersList'));
    }, 3000);
    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground
        source={require('../images/SplashUser.jpg')}  // swap in your own splash image
        style={styles.background}
        resizeMode="contain"
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* If you have an actual logo image, use <Image source={...} style={styles.logo} /> */}
          <Text style={styles.logoText}>User Directory</Text>
          <Text style={styles.tagline}>
            Your contacts, organized
          </Text>
        </Animated.View>

        <View style={styles.footer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>
            Loading users…
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: wp(100),
    height: hp(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#ffffff'
  },
  content: {
    alignItems: 'center',
    marginBottom: hp(15),
  },
  logoText: {
    fontSize: wp(10),
    color: '#0066cc',
    fontWeight: 'bold',
    marginBottom: hp(30),
  },
  tagline: {
    fontSize: wp(5),
    color: 'blue',
    textAlign: 'center',
    paddingHorizontal: wp(10),
  },
  footer: {
    position: 'absolute',
    bottom: hp(10),
    alignItems: 'center',
  },
  loadingText: {
    color: 'blue',
    marginTop: hp(2),
    fontSize: wp(4),
  },
});

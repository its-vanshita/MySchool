import React, { useEffect, useState, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Keep the native splash screen visible while we setup
SplashScreen.preventAutoHideAsync().catch(() => {});

interface AnimatedSplashScreenProps {
  children: React.ReactNode;
}

export function AnimatedSplashScreen({ children }: AnimatedSplashScreenProps) {
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Simulate loading resources (fonts, data, etc)
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // You can add your actual font/asset loading here if needed.
        // We'll just wait a brief moment to let Expo Router initialize properly
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  // When app is ready, start the gentle fade & scale out animation
  useEffect(() => {
    if (isAppReady) {
      // First, hide the native static splash screen smoothly
      SplashScreen.hideAsync().catch(() => {});

      // Then animate our custom overlay
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.15, // Gentle zoom-in feeling while fading out
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setAnimationComplete(true);
      });
    }
  }, [isAppReady, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      {children}

      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.splashOverlay,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Animated.Image
            source={require('../../assets/splash-icon.png')}
            style={[
              styles.image,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
            resizeMode="contain"
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashOverlay: {
    backgroundColor: '#FFFFFF', // Matches our new native splash background
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999, // Ensure it's over everything else
  },
  image: {
    width: Dimensions.get('window').width * 0.7, // Adjust scale relative to screen size
    height: Dimensions.get('window').width * 0.7,
  },
});

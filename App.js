
import React, { useState, useRef } from 'react';
import { StyleSheet, View, Image, PanResponder, Animated, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [bgUri, setBgUri] = useState(null);
  const [userUri, setUserUri] = useState(null);
  const pan = useRef(new Animated.ValueXY()).current;

  // Interaction Logic: Allows user to move their cutout
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const pickAndTeleport = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // Logic: You would fetch from your Django API here
      // For now, setting the picker result as the interactive layer
      setUserUri(result.assets[0].uri);
      // Example placeholder background
      setBgUri('https://images.unsplash.com/photo-1502602898657-3e91760cbb34'); 
    }
  };

  return (
    <View style={styles.container}>
      {bgUri && <Image source={{ uri: bgUri }} style={styles.background} />}
      
      {userUri && (
        <Animated.View
          style={[pan.getLayout(), styles.userWrapper]}
          {...panResponder.panHandlers}
        >
          <Image source={{ uri: userUri }} style={styles.userImage} resizeMode="contain" />
        </Animated.View>
      )}

      <TouchableOpacity style={styles.button} onPress={pickAndTeleport}>
        <Text style={styles.text}>Pick & Teleport</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  background: { ...StyleSheet.absoluteFillObject },
  userWrapper: { width: 300, height: 450, position: 'absolute' },
  userImage: { width: '100%', height: '100%' },
  button: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 30 },
  text: { fontWeight: 'bold' }
});

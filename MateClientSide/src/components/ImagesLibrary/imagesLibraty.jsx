import React, { useState } from 'react';
import { View, FlatList, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImageLibrary = () => {
  const [images, setImages] = useState([]);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true, 
    });

    if (!result.cancelled) {
      setImages([...images, ...result.uri]); 
    }
  };

  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={{ width: 200, height: 150, borderRadius: 20, marginHorizontal: 5 }} />
  );

  return (
    <View>
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <Button title="Add Photos" onPress={pickImages} />
    </View>
  );
};

export default ImageLibrary;

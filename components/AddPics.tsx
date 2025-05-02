import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

const AddParkingPictures = () => {
  const [images, setImages] = useState([]);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (libraryStatus !== 'granted' || cameraStatus !== 'granted') {
        Alert.alert(
          'Permissions required', 
          'Sorry, we need camera and library permissions to make this work!'
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async (type) => {
    // Request permissions
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    // Launch image picker
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.Images],
        allowsEditing: true,
        quality: 0.7,
        aspect: [4, 3]
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage = {
          uri: result.assets[0].uri,
          type: type,
          fileName: result.assets[0].fileName || `${type}_image.jpg`,
          fileSize: result.assets[0].fileSize,
        };

        // Check if an image of this type already exists
        const filteredImages = images.filter(img => img.type !== type);
        setImages([...filteredImages, newImage]);

        // Validate image
        validateImage(newImage);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Unable to pick image. Please try again.');
    }
  };

  const validateImage = (image) => {
    // More comprehensive image validation rules
    const validateRules = [
      { 
        rule: 'File Size',
        check: () => image.fileSize && image.fileSize < 5 * 1024 * 1024, // Max 5MB
        message: 'Image size should be less than 5MB'
      },
      { 
        rule: 'Image Type', 
        check: () => {
          const allowedTypes = ['.jpg', '.jpeg', '.png'];
          return allowedTypes.some(type => 
            image.fileName.toLowerCase().endsWith(type)
          );
        },
        message: 'Only JPG and PNG images are allowed'
      }
    ];

    const failedRules = validateRules.filter(r => !r.check());

    if (failedRules.length > 0) {
      Alert.alert(
        'Image Validation Failed',
        failedRules.map(rule => rule.message).join('\n')
      );
      // Remove the invalid image
      setImages(images.filter(img => img.type !== image.type));
    }
  };

  const removeImage = (type) => {
    setImages(images.filter(img => img.type !== type));
  };

  const ImageUploadButton = ({ type, title }) => (
    <View className="mb-4 p-2 border-2 border-dashed border-gray-300 rounded-lg">
      <TouchableOpacity 
        onPress={() => pickImage(type)}
        className="flex-row items-center justify-center p-3 bg-gray-100 rounded-md"
      >
        <Text className="text-gray-600 mr-2">{title}</Text>
        <Text className="text-blue-500">+ Add</Text>
      </TouchableOpacity>
      
      {images.find(img => img.type === type) && (
        <View className="mt-2 relative">
          <Image 
            source={{ uri: images.find(img => img.type === type).uri }} 
            className="w-full h-40 rounded-md"
            resizeMode="cover"
          />
          <TouchableOpacity 
            onPress={() => removeImage(type)}
            className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
          >
            <Text className="text-white text-xs">X</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const afterupload = () => {
        console.log("Renting Process 5 Starts")
        router.push("/(root)/accessins");
    
      };

  const handleUpload = () => {
    // Check if all required images are uploaded
    const requiredTypes = ['entrance', 'exit', 'overview'];
    const missingImages = requiredTypes.filter(
      type => !images.some(img => img.type === type)
    );

    if (missingImages.length > 0) {
      Alert.alert(
        'Incomplete Upload', 
        `Please upload the following images: ${missingImages.join(', ')}`
      );
      return;
    }

    // Proceed with upload
    console.log('Images to upload:', images);
    // Add your upload logic here (e.g., API call)
    Alert.alert('Success', 'Images are ready to be uploaded!');
  };

  return (
    <ScrollView className="p-4 bg-white">
      <Text className="text-xl font-bold mb-4 text-gray-700">Add Parking Space Pictures</Text>
      
      <Text className="text-sm text-gray-500 mb-4">
        Guidelines:
        • Take clear, well-lit pictures
        • Capture full entrance and exit
        • Ensure correct angle and perspective
        • Avoid blurry or dark images
        • Max file size: 5MB
        • Supported formats: JPG, PNG
      </Text>

      <ImageUploadButton 
        type="entrance" 
        title="Parking Entrance" 
      />
      
      <ImageUploadButton 
        type="exit" 
        title="Parking Exit" 
      />
      
      <ImageUploadButton 
        type="overview" 
        title="Parking Overview" 
      />

      <TouchableOpacity 
        className="bg-blue-500 p-4 rounded-lg mt-4"
        onPress={afterupload}
      >
        <Text className="text-white text-center">Upload Parking Pictures</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddParkingPictures;
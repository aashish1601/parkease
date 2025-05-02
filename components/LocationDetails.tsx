import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, SafeAreaView, Alert, Platform } from 'react-native';
import { ChevronDown, MapPin, Globe } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';

const LocationSelectionScreen = ({ }) => {
  const [country, setCountry] = useState('Choose Your Country');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [showMapScreen, setShowMapScreen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 20.5937, // Default to center of India
    longitude: 78.9629,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });

  const countries = ['India'];

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        return false;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    const getCurrentLocation = async () => {
      const hasPermission = await requestLocationPermission();
      
      if (hasPermission) {
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
          });

          const { latitude, longitude } = location.coords;
          setInitialRegion({
            latitude,
            longitude,
            latitudeDelta: 0.1, // Closer zoom
            longitudeDelta: 0.1,
          });
          setSelectedLocation({ latitude, longitude });
        } catch (error) {
          console.log('Location error:', error);
          Alert.alert('Location Error', 'Could not retrieve your current location.');
        }
      }
    };

    if (showMapScreen) {
      getCurrentLocation();
    }
  }, [showMapScreen]);

  const handleContinue = () => {
    if (country && address) {
      setShowMapScreen(true);
    } else {
      Alert.alert('Incomplete Information', 'Please select a country and enter an address.');
    }
  };

  const handleMapLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      Alert.alert(
        'Location Confirmed', 
        `Latitude: ${selectedLocation.latitude}\nLongitude: ${selectedLocation.longitude}`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'OK', 
            onPress: () => gotostreetview() // Fixed syntax: added arrow function
          }
        ]
      );
    } else {
      Alert.alert('Select Location', 'Please drag and place the pin on the map');
    }
  };

  const gotostreetview = () => {
    console.log("Renting Process 4 Starts")
    router.push("/(root)/streetview");
  };

  // Location Selection Screen
  if (!showMapScreen) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 px-6 pt-8">
          {/* Header */}
          <View className="mb-8 flex-row items-center">
            <TouchableOpacity className="mr-4">
              <MapPin color="#4A5568" size={24} />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-800">Space Location</Text>
          </View>
          {/* Country Selection */}
          <View className="mb-6">
            <Text className="text-gray-600 mb-2">Country</Text>
            <TouchableOpacity 
              className="bg-gray-100 p-4 rounded-xl flex-row justify-between items-center"
              onPress={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
            >
              <View className="flex-row items-center">
                <Globe color="#4A5568" size={20} className="mr-3" />
                <Text className="text-gray-800 font-semibold">{country}</Text>
              </View>
              <ChevronDown color="#4A5568" size={20} />
            </TouchableOpacity>
            {isCountryDropdownOpen && (
              <View className="bg-gray-100 mt-2 rounded-xl">
                {countries.map((countryName, index) => (
                  <TouchableOpacity 
                    key={index}
                    className="p-4 border-b border-gray-200 last:border-b-0"
                    onPress={() => {
                      setCountry(countryName);
                      setIsCountryDropdownOpen(false);
                    }}
                  >
                    <Text className="text-gray-800">{countryName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {/* Address Input */}
          <View className="mb-4">
            <Text className="text-gray-600 mb-2">Space Address</Text>
            <TextInput 
              placeholder="Enter your space address"
              value={address}
              onChangeText={setAddress}
              className="bg-gray-100 p-4 rounded-xl text-gray-800"
            />
          </View>
          {/* Nearby Landmark Input */}
          <View>
            <Text className="text-gray-600 mb-2">Nearby Landmark</Text>
            <TextInput 
              placeholder="Enter nearby famous place (optional)"
              value={landmark}
              onChangeText={setLandmark}
              className="bg-gray-100 p-4 rounded-xl text-gray-800"
            />
            <Text className="text-xs text-gray-500 mt-1 ml-2">
              Example: Near Taj Mahal, Opposite Central Mall, Next to City Park
            </Text>
          </View>
          {/* Continue Button */}
          <View className="mt-8">
            <TouchableOpacity 
              className="bg-green-500 p-4 rounded-xl items-center"
              onPress={handleContinue}
              disabled={!country || !address}
            >
              <Text className="text-white font-bold text-lg">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Map Location Screen
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <View className="p-4 bg-white flex-row items-center">
          <TouchableOpacity onPress={() => setShowMapScreen(false)} className="mr-4">
            <MapPin color="#4A5568" size={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800">Place the Pin</Text>
        </View>
        
        <MapView
          className="flex-1"
          region={initialRegion}
        >
          {/* Always show a marker, even if no location selected */}
          <Marker
            coordinate={selectedLocation || initialRegion}
            draggable
            onDragEnd={(e) => handleMapLocationSelect(e.nativeEvent.coordinate)}
            title="Drag to select location"
          />
        </MapView>
        
        <View className="p-4 bg-white">
          <TouchableOpacity 
            className="bg-green-500 p-4 rounded-xl items-center"
            onPress={handleConfirmLocation}
          >
            <Text className="text-white font-bold text-lg">Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LocationSelectionScreen;
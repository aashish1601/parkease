import "react-native-get-random-values";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { icons, images } from "@/constants";
import { useLocationStore } from "@/store";
import { SignedIn, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

// Parking spaces from Map component
const parkingSpaces = [
  {
    id: "1",
    price: "₹50/hr",
    owner_first_name: "Rajesh",
    owner_last_name: "Sharma",
    profile_image_url:
      "https://images.indianexpress.com/2022/08/parking-multi-level-1.jpg?w=640",
    parking_image_url:
      "https://images.indianexpress.com/2022/08/parking-multi-level-1.jpg?w=640",
    parking_spots: 2,
    rating: "4.80",
    location_description: "Secure residential parking near metro station",
    amenities: ["Covered", "24/7 Access", "CCTV Surveillance"],
  },
  {
    id: "2",
    price: "₹35/hr",
    owner_first_name: "Priya",
    owner_last_name: "Patel",
    profile_image_url:
      "https://images.indianexpress.com/2021/02/parking-1.jpg?w=640",
    parking_image_url:
      "https://images.indianexpress.com/2021/02/parking-1.jpg?w=640",
    parking_spots: 3,
    rating: "4.60",
    location_description: "Spacious commercial area parking",
    amenities: ["Open Space", "Easy Access", "Hourly Rates"],
  },
  {
    id: "3",
    price: "₹25/hr",
    owner_first_name: "Amit",
    owner_last_name: "Gupta",
    profile_image_url:
      "https://lh3.googleusercontent.com/p/AF1QipNwOuUNR9iSaw0Dk8YFFHGIeHUgXv_U9RQcq10Y=s1360-w1360-h1020",
    parking_image_url:
      "https://lh3.googleusercontent.com/p/AF1QipNwOuUNR9iSaw0Dk8YFFHGIeHUgXv_U9RQcq10Y=s1360-w1360-h1020",
    parking_spots: 1,
    rating: "4.70",
    location_description: "Quiet residential street parking",
    amenities: ["Street Parking", "Residential Area", "Affordable"],
  },
  {
    id: "4",
    price: "₹75/hr",
    owner_first_name: "Neha",
    owner_last_name: "Kumar",
    profile_image_url:
      "https://img.etimg.com/thumb/msid-61613749,width-300,height-225,imgsize-158812,resizemode-75/.jpg",
    parking_image_url:
      "https://img.etimg.com/thumb/msid-61613749,width-300,height-225,imgsize-158812,resizemode-75/.jpg",
    parking_spots: 4,
    rating: "4.90",
    location_description: "Premium parking near business district",
    amenities: ["Underground", "Secure", "Electric Vehicle Charging"],
  },
];

// Custom Parking Space Card Component
const ParkingSpaceCard = ({ parkingSpace }) => {
  return (
    <View className="bg-white rounded-xl shadow-md mb-4 p-4">
      <View className="flex-row items-center">
        <Image 
          source={{ uri: parkingSpace.parking_image_url }} 
          className="w-20 h-20 rounded-lg mr-4" 
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="text-base font-JakartaBold text-neutral-800">
            {parkingSpace.location_description}
          </Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-green-600 font-JakartaMedium mr-2">
              {parkingSpace.price}
            </Text>
            <View className="flex-row items-center">
              <Image 
                source={icons.star} 
                className="w-4 h-4 mr-1" 
                resizeMode="contain"
              />
              <Text className="text-neutral-600 text-sm">
                {parkingSpace.rating}
              </Text>
            </View>
          </View>
          <Text className="text-neutral-500 text-xs mt-1">
            {parkingSpace.parking_spots} spots available
          </Text>
        </View>
      </View>
      <View className="flex-row mt-2">
        {parkingSpace.amenities.map((amenity, index) => (
          <View 
            key={index} 
            className="bg-blue-50 px-2 py-1 rounded-md mr-2 mb-2"
          >
            <Text className="text-blue-600 text-xs">{amenity}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function Page() {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [hasPermissons, setHasPermissions] = useState(false);
  
  const handleSignOut = () => {};
  const handleDestinationPress = () => {};

  useEffect(() => {
    const requestLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setHasPermissions(false);
          setLoading(false);
          return;
        }

        setHasPermissions(true);
        let location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords?.latitude!,
          longitude: location.coords?.longitude!,
        });

        setUserLocation({
          latitude: location.coords?.latitude,
          longitude: location.coords?.longitude,
          address: `${address[0].name}, ${address[0].region}`,
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error getting location:", error);
        setLoading(false);
      }
    };
    
    requestLocation();
  }, []);

  const getUserName = () => {
    if (user?.firstName) return user.firstName;
    if (user?.emailAddresses && user.emailAddresses.length > 0) {
      return user.emailAddresses[0].emailAddress.split("@")[0];
    }
    return "there";
  };

  return (
    <SafeAreaView className="bg-general-500 flex-1">
      <FlatList
        data={parkingSpaces}
        renderItem={({ item }) => <ParkingSpaceCard parkingSpace={item} />}
        className="px-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center py-8">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No parking areas found"
                  resizeMode="contain"
                />
                <Text className="text-sm font-JakartaMedium text-neutral-600 mt-3">
                  No parking areas found
                </Text>
              </>
            ) : (
              <View className="py-4">
                <ActivityIndicator size="large" color="#3B82F6" />
              </View>
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-4">
              <View>
                <Text className="text-neutral-500 font-JakartaMedium mb-1 text-sm">
                  Welcome back
                </Text>
                <Text className="text-xl capitalize font-JakartaExtraBold text-neutral-800">
                  {getUserName()} 👋
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-full bg-white shadow-sm shadow-neutral-300"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>

            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white rounded-xl shadow-md shadow-neutral-300 mb-4"
              handlePress={handleDestinationPress}
            />

            <View className="mb-4">
              <View className="flex flex-row items-center justify-between mb-2">
                <Text className="text-lg font-JakartaBold text-neutral-800">
                  Your current location
                </Text>
                {!hasPermissons && (
                  <TouchableOpacity>
                    <Text className="text-xs font-JakartaMedium text-blue-500">
                      Enable location
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View className="overflow-hidden rounded-xl shadow-md shadow-neutral-300 h-[360px]">
                {loading ? (
                  <View className="flex-1 justify-center items-center bg-gray-100">
                    <ActivityIndicator size="small" color="#3B82F6" />
                  </View>
                ) : (
                  <Map />
                )}
              </View>
            </View>

            <View className="flex flex-row items-center justify-between mb-3">
              <Text className="text-lg font-JakartaBold text-neutral-800">
                Nearby Parking Areas
              </Text>
              <TouchableOpacity>
                <Text className="text-xs font-JakartaMedium text-blue-500">
                  View all
                </Text>
              </TouchableOpacity>
            </View>

            {loading && (
              <View className="py-3 flex items-center">
                <ActivityIndicator size="small" color="#3B82F6" />
              </View>
            )}
          </>
        )}
      />
    </SafeAreaView>
  );
}
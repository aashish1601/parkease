import { icons } from "@/constants";
import { calculateRegion, generateMarkersFromData } from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { MarkerData } from "@/types/type";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import "react-native-get-random-values";
import { router } from "expo-router";
import { Accelerometer, Gyroscope } from "expo-sensors";
const parkingSpaces = [
  {
    id: "1",
    price: "₹50/hr",
    owner_first_name: "Rajesh",
    owner_last_name: "Sharma",
    profile_image_url:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Findianexpress.com%2Farticle%2Fcities%2Fmumbai%2Fmumbai-to-get-3-multi-level-car-parking-lots-in-under-2-yrs-8064653%2F&psig=AOvVaw0OY4QnKwBfr5i9bwA4WLKR&ust=1742989925122000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKjk-M2VpYwDFQAAAAAdAAAAABAE",
    parking_image_url:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Findianexpress.com%2Farticle%2Fcities%2Fmumbai%2Fmumbai-to-get-3-multi-level-car-parking-lots-in-under-2-yrs-8064653%2F&psig=AOvVaw0OY4QnKwBfr5i9bwA4WLKR&ust=1742989925122000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKjk-M2VpYwDFQAAAAAdAAAAABAE",
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
      "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
    parking_image_url:
      "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
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
      "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
    parking_image_url:
      "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
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
      "https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/",
    parking_image_url:
      "https://ucarecdn.com/b6fb3b55-7676-4ff3-8484-fb115e268d32/-/preview/930x932/",
    parking_spots: 4,
    rating: "4.90",
    location_description: "Premium parking near business district",
    amenities: ["Underground", "Secure", "Electric Vehicle Charging"],
  },
];

type UserActivity =
  | "stationary"
  | "stationary"
  | "running"
  | "driving"
  | "cycling"
  | "unknown";

const Map: React.FC = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

  const { selectedDriver, setDrivers, setSelectedDriver } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [activeCallout, setActiveCallout] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  // Improved Sensor Configuration
  const ACTIVITY_THRESHOLDS = {
    stationary: 0.2,
    walking: 1.5,
    cycling: 3.0,
    running: 5.0,
    driving: 8.0,
  };

  // Sensor State
  const [userActivity, setUserActivity] = useState<UserActivity>("unknown");
  const [sensorData, setSensorData] = useState({
    acceleration: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  });

  // Enhanced Moving Average and Noise Reduction
  const accelerationHistory = {
    x: useRef<number[]>([]),
    y: useRef<number[]>([]),
    z: useRef<number[]>([]),
  };
  const MAX_HISTORY_LENGTH = 20;

  // Improved Moving Average Calculation
  const calculateMovingAverage = (
    history: React.MutableRefObject<number[]>
  ) => {
    if (history.current.length === 0) return 0;
    // Remove outliers (e.g., values > 2x median)
    const sorted = [...history.current].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const filtered = history.current.filter((val) => val <= median * 2);
    return filtered.reduce((sum, value) => sum + value, 0) / filtered.length;
  };

  // Advanced User Activity Detection with Gyroscope Integration
  const detectUserActivity = useCallback(
    (
      acceleration: { x: number; y: number; z: number },
      rotation: { x: number; y: number; z: number }
    ) => {
      // Update acceleration histories
      ["x", "y", "z"].forEach((axis) => {
        const history = accelerationHistory[axis as "x" | "y" | "z"];
        history.current.push(Math.abs(acceleration[axis as "x" | "y" | "z"]));
        if (history.current.length > MAX_HISTORY_LENGTH) {
          history.current.shift();
        }
      });

      // Calculate total acceleration magnitude with moving average
      const avgX = calculateMovingAverage(accelerationHistory.x);
      const avgY = calculateMovingAverage(accelerationHistory.y);
      const avgZ = calculateMovingAverage(accelerationHistory.z);
      const totalAcceleration = Math.sqrt(avgX ** 2 + avgY ** 2 + avgZ ** 2);

      // Calculate total rotation magnitude (from gyroscope)
      const totalRotation = Math.sqrt(
        rotation.x ** 2 + rotation.y ** 2 + rotation.z ** 2
      );

      // Enhanced activity detection logic
      if (
        totalAcceleration < ACTIVITY_THRESHOLDS.stationary &&
        totalRotation < 0.1
      ) {
        return "stationary"; // Low acceleration AND minimal rotation
      } else if (
        totalAcceleration < ACTIVITY_THRESHOLDS.walking &&
        totalRotation < 0.5
      ) {
        return "stationary"; // Moderate acceleration, low rotation
      } else if (
        totalAcceleration < ACTIVITY_THRESHOLDS.cycling &&
        totalRotation > 0.3
      ) {
        return "cycling"; // Higher acceleration with some rotation
      } else if (totalAcceleration < ACTIVITY_THRESHOLDS.running) {
        return "running"; // High acceleration
      } else if (totalAcceleration >= ACTIVITY_THRESHOLDS.driving) {
        return "driving"; // Very high acceleration
      }

      return "unknown";
    },
    []
  );

  useEffect(() => {
    let accelerometerSubscription: { remove: () => void } | null = null;
    let gyroscopeSubscription: { remove: () => void } | null = null;

    const initializeSensors = async () => {
      try {
        const { status: accelerometerStatus } =
          await Accelerometer.requestPermissionsAsync();
        const { status: gyroscopeStatus } =
          await Gyroscope.requestPermissionsAsync();

        if (
          accelerometerStatus !== "granted" ||
          gyroscopeStatus !== "granted"
        ) {
          throw new Error("Sensor permissions not granted");
        }

        // Slower update interval to reduce noise
        Accelerometer.setUpdateInterval(200); // 5 updates per second
        Gyroscope.setUpdateInterval(200);

        // Stronger low-pass filter state
        let lastAcceleration = { x: 0, y: 0, z: 0 };
        let lastRotation = { x: 0, y: 0, z: 0 };

        // Accelerometer Subscription with Enhanced Filtering
        accelerometerSubscription = Accelerometer.addListener(({ x, y, z }) => {
          // Stronger low-pass filter (more weight to previous value)
          const filteredAcceleration = {
            x: Number((lastAcceleration.x * 0.8 + x * 0.2).toFixed(3)),
            y: Number((lastAcceleration.y * 0.8 + y * 0.2).toFixed(3)),
            z: Number((lastAcceleration.z * 0.8 + z * 0.2).toFixed(3)),
          };
          lastAcceleration = filteredAcceleration;

          setSensorData((prev) => ({
            ...prev,
            acceleration: filteredAcceleration,
          }));
          const detectedActivity = detectUserActivity(
            filteredAcceleration,
            lastRotation
          );
          setUserActivity(detectedActivity);
        });

        // Gyroscope Subscription
        gyroscopeSubscription = Gyroscope.addListener(({ x, y, z }) => {
          const filteredRotation = {
            x: Number((lastRotation.x * 0.8 + x * 0.2).toFixed(3)),
            y: Number((lastRotation.y * 0.8 + y * 0.2).toFixed(3)),
            z: Number((lastRotation.z * 0.8 + z * 0.2).toFixed(3)),
          };
          lastRotation = filteredRotation;

          setSensorData((prev) => ({ ...prev, rotation: filteredRotation }));
          const detectedActivity = detectUserActivity(
            lastAcceleration,
            filteredRotation
          );
          setUserActivity(detectedActivity);
        });
      } catch (error) {
        console.error("Sensor Initialization Error:", error);
        Alert.alert(
          "Sensor Access",
          "Could not access device sensors. Some features may be limited."
        );
      }
    };

    initializeSensors();

    // Cleanup
    return () => {
      accelerometerSubscription?.remove();
      gyroscopeSubscription?.remove();
    };
  }, [detectUserActivity]);

  // Use default values if coordinates are undefined
  const safeUserLatitude = userLatitude || 37.7749;
  const safeUserLongitude = userLongitude || -122.4194;
  const safeDestLatitude =
    destinationLatitude || (userLatitude ? userLatitude + 0.01 : 37.785);
  const safeDestLongitude =
    destinationLongitude || (userLongitude ? userLongitude + 0.01 : -122.409);

  const region = calculateRegion({
    userLatitude: safeUserLatitude,
    userLongitude: safeUserLongitude,
    destinationLatitude: safeDestLatitude,
    destinationLongitude: safeDestLongitude,
  });

  useEffect(() => {
    // Set parking spaces in the store when component mounts
    setDrivers?.(parkingSpaces);
  }, []);

  useEffect(() => {
    if (Array.isArray(parkingSpaces) && safeUserLatitude && safeUserLongitude) {
      const newMarkers = generateMarkersFromData({
        data: parkingSpaces,
        userLatitude: safeUserLatitude,
        userLongitude: safeUserLongitude,
      });
      setMarkers(newMarkers);
    }
  }, [parkingSpaces, safeUserLatitude, safeUserLongitude]);

  const handleMarkerPress = (markerId: string) => {
    const parkingSpace = parkingSpaces.find((p) => p.id === markerId);
    setSelectedDriver?.(parkingSpace);
    setActiveCallout(markerId);
  };

  // Helper function to get parking space data from marker id
  const getParkingSpaceById = (id: string) => {
    return parkingSpaces.find((space) => space.id === id);
  };

  // Handle map press to close active callout
  const handleMapPress = () => {
    if (activeCallout) {
      setActiveCallout(null);
    }
  };

  // Handle booking navigation
  const handleBookNow = () => {
    // Navigate to booking screen
    router.push("/(root)/booking");
  };

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        className="w-full h-full rounded-2xl"
        mapType="standard"
        showsPointsOfInterest={false}
        initialRegion={region}
        showsUserLocation={true}
        userInterfaceStyle="light"
        onPress={handleMapPress}
      >
        {markers.map((marker) => {
          const parkingSpace = getParkingSpaceById(marker.id);

          return (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              onPress={() => handleMarkerPress(marker.id)}
            >
              {/* Custom Marker View */}
              <View className="items-center">
                {/* Price Text */}
                <Text className="text-xs font-bold text-black bg-white px-1 rounded-sm">
                  {marker.price || "Rent"}
                </Text>
                {/* Location Pin Image */}
                <Image
                  source={icons.pin}
                  className="w-3 h-3 mt-1"
                  resizeMode="contain"
                />
              </View>
            </Marker>
          );
        })}
      </MapView>
      {/* Activity Overlay */}
      <View className="absolute top-4 left-4 bg-white/80 p-2 rounded-lg">
        <Text className="text-xs font-bold">
          Activity: {userActivity.toUpperCase()}
        </Text>
        
      </View>

      {selectedDriver && (
        <View className="absolute bottom-1 left-4 right-4 bg-white rounded-lg shadow-md">
          {/* Close Button */}
          <TouchableOpacity
            className="absolute top-2 right-2 z-10 p-1 bg-gray-100 rounded-full"
            onPress={() => setSelectedDriver(null)}
          >
            <Text className="text-gray-600 font-bold text-base">×</Text>
          </TouchableOpacity>

          {/* Header with Recommended Badge */}

          {/* Content Container */}
          <View className="p-3">
            <View className="flex-row justify-between items-center">
              {/* Location and Rating */}
              <View className="flex-1 pr-2">
                <Text className="text-base font-bold text-gray-800 truncate">
                  {selectedDriver.location_description}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Image
                    source={icons.star || require("@/assets/icons/star.png")}
                    style={{ width: 14, height: 14 }}
                    resizeMode="contain"
                  />
                  <Text className="ml-1 text-gray-600 text-xs">
                    {selectedDriver.rating} ({865} reviews)
                  </Text>
                </View>
              </View>

              {/* Price */}
              <View>
                <Text className="text-green-600 font-bold text-base">
                  {selectedDriver.price}
                  <Text className="text-xs font-normal"></Text>
                </Text>
              </View>
            </View>

            {/* Walking Time */}
            <View className="flex-row items-center mt-1">
              <Text className="text-gray-500 text-xs">🚶 19 mins</Text>
            </View>

            {/* Book Button */}
            <TouchableOpacity
              className="bg-green-500 py-2 rounded-lg mt-2"
              onPress={handleBookNow}
            >
              <Text className="text-white text-center font-bold text-sm">
                reserve for {selectedDriver.price}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default Map;
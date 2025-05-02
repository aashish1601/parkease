import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronRight, Coins, Users, Star,Cross, CrossIcon } from "lucide-react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const RentYourSpaceScreen = () => {
  const [name, setName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [email, setEmail] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const statsData = [
    { value: "£4,000", label: "per year earned by top hosts" },
    { value: "13 million+", label: "drivers trust us to find parking" },
    { value: "£50 million+", label: "earned by hosts since we began" },
    { value: "45,000+", label: "hosts already earning from driveway" },
  ];

  const faqData = [
    {
      question: "How much money will I earn from renting out my space?",
      answer:
        "Earnings vary based on location, availability, and demand. Top hosts in prime areas can earn up to £4,000 annually.",
    },
    {
      question: "Is my space eligible to be listed on ParkEase?",
      answer:
        "Most residential and commercial parking spaces are eligible. The key requirements are accessibility and a clear parking area.",
    },
    {
      question: "How does it work once someone books my space?",
      answer:
        "Once booked, you'll receive a notification. The app provides secure payment and booking management.",
    },
    {
      question: "Do I need my space to be available all the time?",
      answer:
        "No! You have complete control. Set your availability, pricing, and manage bookings as it suits you.",
    },
    {
      question: "Do I pay tax on what I earn?",
      answer:
        "The first £1,000 is tax-free. Beyond that, you may need to report earnings. Consult a tax professional for specific advice.",
    },
    {
      question: "How does ParkEase make money?",
      answer:
        "We charge a small commission on each booking, ensuring a win-win for both hosts and drivers.",
    },
  ];

  const handleGetQuote = () => {
    console.log("Quote requested:", { name, postcode, email });
  };

  const rentprocess = () => {
    console.log("Renting Process 1 Starts")
    router.push("/(root)/rentprocess");

  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero Section */}
        <View className="px-6 pt-8 pb-10 bg-white">
          <Text className="text-4xl text-black font-JakartaBold mb-4 text-center leading-tight">
            Sarah earns enough to cover her monthly energy bills
          </Text>
          <Text className="text-2xl text-black font-JakartaBold text-center">
            What could your space pay for?
          </Text>
        </View>

        {/* Quote Form */}
        {/* Quote Form */}
        <View className="px-6 -mt-8">
          <View className="bg-emerald-50 rounded-2xl p-6 shadow-lg">
            <Text className="text-lg text-gray-800 font-bold text-center mb-6">
              See how much spaces in your area can earn!
            </Text>

            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              className="border border-gray-200 p-4 rounded-lg mb-4 text-gray-700 bg-gray-50"
              placeholderTextColor="#6B7280"
            />
            <TextInput
              placeholder="Postcode"
              value={postcode}
              onChangeText={setPostcode}
              className="border border-gray-200 p-4 rounded-lg mb-4 text-gray-700 bg-gray-50"
              placeholderTextColor="#6B7280"
            />
            <TextInput
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              className="border border-gray-200 p-4 rounded-lg mb-6 text-gray-700 bg-gray-50"
              placeholderTextColor="#6B7280"
            />

            <TouchableOpacity
              className="bg-general-400 p-3 rounded-lg items-center shadow-md mb-4"
              onPress={handleGetQuote}
            >
              <Text className="text-white text-lg font-bold">Get a Quote</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white border-2 border-general-400 p-3 rounded-lg items-center shadow-md"
              onPress={rentprocess}
            >
              <Text className="text-emerald-600 text-lg font-bold">
                Rent Your Space
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="px-6 pt-12">
          <Text className="text-2xl font-bold text-gray-900 mb-6">
            Why choose ParkEase?
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {statsData.map((stat, index) => (
              <View
                key={index}
                className="w-[48%] bg-white p-4 rounded-xl mb-4 shadow-sm"
              >
                <Text className="text-2xl font-bold text-emerald-600 mb-1">
                  {stat.value}
                </Text>
                <Text className="text-sm text-gray-600">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Benefits Cards */}
        <View className="px-6 pt-12">
          <View className="flex-row justify-between -mx-2">
            <View className="w-[48%] bg-white p-5 rounded-xl shadow-sm">
              <Coins size={32} color="#10B981" className="mb-4" />
              <Text className="text-lg font-bold text-gray-900 mb-2">
                Earn with Us
              </Text>
              <Text className="text-sm text-gray-600">
                Top hosts make over £4,000 a year. The first £1,000 is tax-free.
              </Text>
            </View>

            <View className="w-[48%] bg-white p-5 rounded-xl shadow-sm">
              <Users size={32} color="#10B981" className="mb-4" />
              <Text className="text-lg font-bold text-gray-900 mb-2">
                You're in Control
              </Text>
              <Text className="text-sm text-gray-600">
                Choose your days, set your price, and manage bookings easily.
              </Text>
            </View>
          </View>
        </View>

        {/* Trust Badge */}
        <View className="px-6 pt-12">
          <View className="bg-emerald-50 p-6 rounded-xl items-center shadow-sm">
            <Star size={32} color="#10B981" className="mb-3" />
            <Text className="text-lg font-bold text-gray-900 mb-1">
              Trusted by Millions
            </Text>
            <Text className="text-gray-600 text-center">
              4.5/5 on Trustpilot - UK's Most Trusted Parking App
            </Text>
          </View>
        </View>

        {/* FAQ Section */}
        <View className="px-6 pt-12 pb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </Text>
          <View className="bg-white rounded-xl shadow-sm">
            {faqData.map((faq, index) => (
              <View
                key={index}
                className={`px-5 py-4 ${
                  index !== faqData.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <TouchableOpacity
                  onPress={() =>
                    setExpandedFAQ(expandedFAQ === index ? null : index)
                  }
                  className="flex-row justify-between items-center"
                >
                  <Text className="text-base text-gray-900 font-medium flex-1 pr-4">
                    {faq.question}
                  </Text>
                  <CrossIcon
                    color="#10B981"
                    size={20}
                    style={{
                      transform: [
                        { rotate: expandedFAQ === index ? "90deg" : "0deg" },
                      ],
                    }}
                  />
                </TouchableOpacity>
                {expandedFAQ === index && (
                  <Text className="mt-3 text-gray-600 text-sm leading-5">
                    {faq.answer}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RentYourSpaceScreen;

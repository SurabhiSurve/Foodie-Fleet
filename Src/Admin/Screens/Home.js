import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Image } from "react-native";

const Home = () => {
  const [todaySignificance, setTodaySignificance] = useState("");
  const [userRole, setUserRole] = useState("");

  // Data for significant days based on the Indian Calendar
  const significanceData = {
    "1-26": { event: "Republic Day" },
    "8-15": { event: "Independence Day" },
    "10-2": { event: "Gandhi Jayanti" },
    // Add more days and events here
  };

  useEffect(async () => {
    const value = await AsyncStorage.getItem('UserRole');
    console.log(value);
    setUserRole(value);
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}-${today.getDate()}`;
    if (significanceData[formattedDate]) {
      setTodaySignificance(significanceData[formattedDate]);
    } else {
      setTodaySignificance({
        event: "No significant event today!",

      });
    }
  }, []);

  const hotels = [
    { name: "AL Baik", image: "https://via.placeholder.com/150" },
    { name: "Hotel Oasis", image: "https://via.placeholder.com/150" },
    { name: "O'Chef Cafe", image: "https://via.placeholder.com/150" },
    { name: "Dominos", image: "https://via.placeholder.com/150" },
    { name: "Hotel Vanashri", image: "https://via.placeholder.com/150" },
    { name: "Hotel Shivsagar", image: "https://via.placeholder.com/150" },
    { name: "Shinde Mala", image: "https://via.placeholder.com/150" },
    { name: "Hotel Shivsagar Anex", image: "https://via.placeholder.com/150" },
    { name: "Hotel Abhishek", image: "https://via.placeholder.com/150" },
    { name: "Kokan Italy Cafe", image: "https://via.placeholder.com/150" },
    { name: "Hotel Abhiruchi", image: "https://via.placeholder.com/150" },
    { name: "Omii's Kitchen", image: "https://via.placeholder.com/150" },
    { name: "Moods Of Desserts", image: "https://via.placeholder.com/150" },
    { name: "Rajdhani Thali", image: "https://via.placeholder.com/150" },
    { name: "Hotel Atithi", image: "https://via.placeholder.com/150" },
    { name: "Hotel Deepak", image: "https://via.placeholder.com/150" },
    { name: "North Point Rooftop", image: "https://via.placeholder.com/150" },
    { name: "99 Pancakes", image: "https://via.placeholder.com/150" },
    { name: "Hotel Tej", image: "https://via.placeholder.com/150" },
    { name: "Cafe MH 08", image: "https://via.placeholder.com/150" },
    { name: "Hotel Swagat", image: "https://via.placeholder.com/150" },
    { name: "Hotel Swapnil", image: "https://via.placeholder.com/150" },
    { name: "Rasik Chinese Corner", image: "https://via.placeholder.com/150" },
    { name: "Spice Bell Cafe", image: "https://via.placeholder.com/150" },
    { name: "Momo's Basket", image: "https://via.placeholder.com/150" },
    { name: "3 Singles", image: "https://via.placeholder.com/150" },
    { name: "Hunger's Point", image: "https://via.placeholder.com/150" },

  ];

  const dishes = [
    { name: "Veg Fried Rice", image: "https://via.placeholder.com/150" },
    { name: "Margherita", image: "https://via.placeholder.com/150" },
    { name: "Paneer Tikka", image: "https://via.placeholder.com/150" },
    { name: "Garlic Naan", image: "https://via.placeholder.com/150" },
    { name: "Butter Chicken", image: "https://via.placeholder.com/150" },
    { name: "Bhakri", image: "https://via.placeholder.com/150" },
    { name: "Jeera Rice", image: "https://via.placeholder.com/150" },
    { name: "Mushroom Soup", image: "https://via.placeholder.com/150" },
    { name: "Sweet Corn Soup", image: "https://via.placeholder.com/150" },
    { name: "Sprite", image: "https://via.placeholder.com/150" },
    { name: "Golden Corn Pizza", image: "https://via.placeholder.com/150" },
    { name: "Pav Bhaji", image: "https://via.placeholder.com/150" },
    { name: "Sol-Kadhi", image: "https://via.placeholder.com/150" },
    { name: "Ragda Pattice", image: "https://via.placeholder.com/150" },
    { name: "Veg Steam Momos", image: "https://via.placeholder.com/150" },
    { name: "Chicken Fried Momos", image: "https://via.placeholder.com/150" },
    { name: "Chicken Baked Momos ", image: "https://via.placeholder.com/150" },
    { name: "Chicken Tandoori Momos", image: "https://via.placeholder.com/150" },
    { name: "Veg Makhni Momos", image: "https://via.placeholder.com/150" },

  ];

  return (
    <ScrollView style={styles.Home}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to Foodie Fleet!</Text>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for hotels, dishes, or locations..."
          />
          <Button title="Search" onPress={() => alert("Searching...")} />
        </View>
      </View>
      {userRole == 'admin' && <View>
        <Text>ADMIN DASHBOARD</Text>
      </View>}

      {userRole != 'admin' && <View>
        {/* Significance of the Day Section */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Significance of the Day</Text>
          <View style={styles.significanceContainer}>
            <Text style={styles.significanceText}>{todaySignificance.event}</Text>
          </View>
        </View>

        {/* Hotels List Section */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Hotels</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hotels.map((hotel, index) => (
              <View key={index} style={styles.hotelItem}>
                <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
                <Text style={styles.hotelName}>{hotel.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Dishes List Section */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Dishes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dishes.map((dish, index) => (
              <View key={index} style={styles.dishItem}>
                <Image source={{ uri: dish.image }} style={styles.dishImage} />
                <Text style={styles.dishName}>{dish.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    color: "black",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  listContainer: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "black",
    marginBottom: 10,
    fontWeight: 'bold',
  },
  significanceContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  significanceText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  hotelItem: {
    alignItems: "center",
    marginRight: 20,
  },
  hotelImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  hotelName: {
    fontSize: 16,
    color: "#555",
  },
  dishItem: {
    alignItems: "center",
    marginRight: 20,
  },
  dishImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  dishName: {
    fontSize: 16,
    color: "#555",
  },
});

export default Home;

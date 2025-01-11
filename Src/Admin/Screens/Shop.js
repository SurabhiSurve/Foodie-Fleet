import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, Switch, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddShop from './AddShop';
import EditShop from './EditShop';
import auth from '@react-native-firebase/auth';


const Shop = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [searchText, setSearchText] = useState("");  // State to store search text
  const [modalVisible, setModalVisible] = useState(false);
  const [modaleditVisible, setModalEditVisible] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState(null);



  // Filter shops based on search text
  const filteredShops = shops.filter(Shop =>
    Shop.ShopName.toLowerCase().includes(searchText.toLowerCase())
  );

  const deleteUnit = (id) => {
    Alert.alert(
      "Delete Shop",
      "Are you sure you want to delete this Shop?",
      [
        {
          text: "Yes",
          onPress: () => {
            firestore()
              .collection('Shops')
              .doc(id)
              .delete()
              .then(() => {
                console.log('Shop deleted!');
              })
              .catch(error => {
                console.error('Error removing document: ', error);
              });
          }
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  useEffect(() => {
    const user = auth().currentUser;
    const unsubscribe = firestore()
      .collection('Shops')
      .where("UserId","==",user.uid)
      .onSnapshot((snapshot) => {
        const shopsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShops(shopsList);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Open' ? 'Close' : 'Open';
    const updatedShops = shops.map(shop =>
      shop.id === id ? { ...shop, Status: newStatus } : shop
    );
    setShops(updatedShops);

    firestore()
      .collection('Shops')
      .doc(id)
      .update({ Status: newStatus })
      .catch(error => {
        console.error("Error updating document: ", error);
        setShops(shops);
      });
  };

  const renderUnitItem = ({ item }) => (
    <View style={styles.UnitItem}>
      <View style={styles.topRow}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>{item.ShopName}</Text>
        <View style={styles.iconContainer}>
          <Switch
            trackColor={{ false: "#EAEAEA", true: "black" }}
            thumbColor={item.Status === 'Open' ? "orange" : "orange"}
            ios_backgroundColor="#3e3e3e"
            value={item.Status === 'Open'}
            onValueChange={() => toggleStatus(item.id, item.Status)}
          />

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setSelectedShopId(item.id);
              setModalEditVisible(true);
            }}
          >
            <Icon name="pencil" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => deleteUnit(item.id)}>
            <Icon name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.productInfo}>GST: {item.GST}</Text>
        <Text style={styles.productInfo}>Phone No: {item.PhoneNo}</Text>
        <Text style={styles.productInfo}>City: {item.City}</Text>
        <Text style={styles.productInfo}>Address: {item.Address}</Text>
        <Text style={styles.productInfo}>Pincode: {item.pincode}</Text>
      </View>
      {selectedShopId === item.id && (
        <EditShop
          isVisible={modaleditVisible}
          onClose={() => setModalEditVisible(false)}
          shopId={selectedShopId}
        />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={24} color="black" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Shops"
          placeholderTextColor="grey"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filteredShops}
        renderItem={renderUnitItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={30} color="black" />
      </TouchableOpacity>
      <AddShop
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

export default Shop;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light grey background
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: '600',
    color: 'black', // Consistent brand color
    marginBottom: 20,
  },
  UnitItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2, // Subtle shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoRow: {
    marginTop: 10,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'orange', // A vibrant, consistent brand color
    width: 56, // A good size for touchability
    height: 56,
    borderRadius: 28, // Perfectly round shape
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8, // More prominent shadow for material design
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, // More visible but not overpowering shadow
    shadowRadius: 8, // Soften the shadow edges
  },
  searchBox: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    borderRadius: 30,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 20
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 18,
    color: '#333333',
  },
  productInfo: {
    color: 'grey',
    marginBottom: 2,
  },
  iconButton: {
    marginLeft: 15,
  },
});

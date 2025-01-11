import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, Switch, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import AddProduct from './AddProduct';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditProduct from './EditProduct';
import auth from '@react-native-firebase/auth';

const Product = () => {
  const [loading, setLoading] = useState(true);
  const [Products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");  // State to store search text
  const [modalVisible, setModalVisible] = useState(false);
  const [modaleditVisible, setModalEditVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const filteredProducts = Products.filter(Product =>
    Product.ProductName.toLowerCase().includes(searchText.toLowerCase())
  );

  const deleteProduct = (id) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this Product?",
      [
        {
          text: "Yes",
          onPress: () => {
            firestore()
              .collection('Product')
              .doc(id)
              .delete()
              .then(() => {
                console.log('Product deleted!');
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
      .collection('Product')
      .where("UserId","==",user.uid)
      .onSnapshot((snapshot) => {
        const ProductsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(ProductsList);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);


  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Available' ? 'Unavailable' : 'Available';
    const updatedProducts = Products.map(pro =>
      pro.id === id ? { ...pro, Status: newStatus } : pro
    );
    setProducts(updatedProducts);

    firestore()
      .collection('Product')
      .doc(id)
      .update({ Status: newStatus })
      .catch(error => {
        console.error("Error updating document: ", error);
        setProducts(Products);
      });
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.ProductItem}>
      <View style={styles.topRow}>
        <Text style={styles.productName}>{item.ProductName}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => toggleStatus(item.id, item.Status)}>
            <Switch
              trackColor={{ false: "#EAEAEA", true: "#DDDFFF" }}
              thumbColor={item.Status === 'Available' ? "#643AFF" : "#DFDFDF"}
              ios_backgroundColor="#3e3e3e"
              value={item.Status === 'Available'}
              onValueChange={() => toggleStatus(item.id, item.Status)}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setSelectedProductId(item.id);
              setModalEditVisible(true);
            }}
          >
            <Icon name="pencil" size={24} color="blue" />
          </TouchableOpacity>
          {selectedProductId === item.id && (
          <EditProduct
            isVisible={modaleditVisible}
            onClose={() => setModalEditVisible(false)}
            productId={selectedProductId}
          />
          )}
          <TouchableOpacity style={styles.iconButton} onPress={() => deleteProduct(item.id)}>
            <Icon name="trash-outline" size={24} color="red" />
          </TouchableOpacity>

        </View>
      </View>
      <View style={styles.infoRow}>
        <Text style={{ color: 'grey' }}>{item.CategoryName}</Text>
        <Text style={{ color: 'grey' }}>{item.Description}</Text>
        <Text style={{ color: 'grey' }}>Rs {item.Price}</Text>
        <Text style={{ color: 'grey' }}>{item.UnitName}</Text>
      </View>
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
        <Icon name="search-outline" size={24} color="#CCCCCC" /><TextInput
          style={styles.searchInput}
          placeholder="Search Products"
          placeholderTextColor="#888888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
      <AddProduct
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  ProductItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#330077',
    flex: 1, // Ensures it takes the necessary space
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton: {
    marginLeft: 15,
  },
  infoRow: {
    paddingTop: 10, // Adds a space between the rows
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#41008A',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
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
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 18,
    color: '#333333',
  },
});
export default Product;
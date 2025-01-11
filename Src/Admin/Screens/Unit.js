import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, Switch, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import AddUnit from './AddUnit';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';

const Unit = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");  // State to store search text
  const [modalVisible, setModalVisible] = useState(false);

  // Filter categories based on search text
  const filteredCategories = categories.filter(Unit =>
    Unit.UnitName.toLowerCase().includes(searchText.toLowerCase())
  );

  const deleteUnit = (id) => {
    Alert.alert(
      "Delete Unit",
      "Are you sure you want to delete this Unit?",
      [
        {
          text: "Yes",
          onPress: () => {
            firestore()
              .collection('Unit')
              .doc(id)
              .delete()
              .then(() => {
                console.log('Unit deleted!');
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
    const user=auth().currentUser
    const unsubscribe = firestore()
      .collection('Unit')
      .where("UserId","==",user.uid)
      .onSnapshot((snapshot) => {
        const categoriesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesList);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const updatedCategories = categories.map(cat =>
      cat.id === id ? { ...cat, Status: newStatus } : cat
    );
    setCategories(updatedCategories);

    firestore()
      .collection('Unit')
      .doc(id)
      .update({ Status: newStatus })
      .catch(error => {
        console.error("Error updating document: ", error);
        setCategories(categories);
      });
  };

  const renderUnitItem = ({ item }) => (
    <View style={styles.UnitItem}>
      <Text style={{ fontSize: 20, fontWeight: 'bold',color:'#330077' }}>{item.UnitName}</Text>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Switch
          trackColor={{ false: "#EAEAEA", true: "#DDDFFF" }}
          thumbColor={item.Status === 'Active' ? "#643AFF" : "#DFDFDF"}
          ios_backgroundColor="#3e3e3e"
          value={item.Status === 'Active'}
          onValueChange={() => toggleStatus(item.id, item.Status)}
        />
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => deleteUnit(item.id)}>
          <Icon name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
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
      {/* <Text style={styles.heading}>Unit List</Text> */}
      {/* <TextInput
        style={styles.searchBox}
        placeholder="Search Categories"
        value={searchText}
        onChangeText={setSearchText}
      /> */}

      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={24} color="#CCCCCC" /><TextInput
          style={styles.searchInput}
          placeholder="Search Units"
          placeholderTextColor="#888888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filteredCategories}
        renderItem={renderUnitItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
      <AddUnit
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

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
    color: '#1E90FF', // Consistent brand color
    marginBottom: 20,
  },
  UnitItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2, // Subtle shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#41008A', // A vibrant, consistent brand color
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
    marginBottom:20
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 18,
    color: '#333333',
  },
});


export default Unit;

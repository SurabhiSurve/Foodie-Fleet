import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, Switch, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import AddEmployee from './AddEmployee';
import EditEmployee from './EditEmployee';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';

const Employee = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const filteredEmployees = employees.filter(employee => {
    const firstName = employee.FirstName ? employee.FirstName.toLowerCase() : '';
    const lastName = employee.LastName ? employee.LastName.toLowerCase() : '';
    return firstName.includes(searchText.toLowerCase()) || lastName.includes(searchText.toLowerCase());
  });

  const deleteEmployee = (id) => {
    Alert.alert(
      "Delete Employee",
      "Are you sure you want to delete this employee?",
      [
        {
          text: "Yes",
          onPress: () => {
            firestore()
              .collection('Employees')
              .doc(id)
              .delete()
              .then(() => {
                console.log('Employee deleted!');
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
      .collection('Employees')
      .where("UserId", "==", user.uid)
      .onSnapshot((snapshot) => {
        const employeeList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeeList);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const updatedEmployees = employees.map(emp =>
      emp.id === id ? { ...emp, Status: newStatus } : emp
    );
    setEmployees(updatedEmployees);

    firestore()
      .collection('Employees')
      .doc(id)
      .update({ Status: newStatus })
      .catch(error => {
        console.error("Error updating document: ", error);
        setEmployees(employees);
      });
  };

  const renderEmployeeItem = ({ item }) => (
    <View style={styles.employeeItem}>
      <View style={styles.topRow}>
        <Text style={styles.employeeName}>{item.FirstName} {item.LastName}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => toggleStatus(item.id, item.Status)}>
            <Switch
              trackColor={{ false: "#EAEAEA", true: "#DDDFFF" }}
              thumbColor={item.Status === 'Active' ? "#643AFF" : "#DFDFDF"}
              ios_backgroundColor="#3e3e3e"
              value={item.Status === 'Active'}
              onValueChange={() => toggleStatus(item.id, item.Status)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setSelectedEmployeeId(item.id);
              setModalEditVisible(true);
            }}
          >
            <Icon name="pencil" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => deleteEmployee(item.id)}>
            <Icon name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>Shop: {item.ShopName}</Text>
        <Text style={styles.infoText}>Education: {item.Education}</Text>
        <Text style={styles.infoText}>Aadhar Card No.: {item.AadharCardNo}</Text>
        <Text style={styles.infoText}>Address: {item.Address}</Text>
        <Text style={styles.infoText}>Mobile No.: {item.MobileNo}</Text>
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
        <Icon name="search-outline" size={24} color="#CCCCCC" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Employees"
          placeholderTextColor="#888888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filteredEmployees}
        renderItem={renderEmployeeItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
      <AddEmployee
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      {selectedEmployeeId && (
        <EditEmployee
          isVisible={modalEditVisible}
          onClose={() => setModalEditVisible(false)}
          employeeId={selectedEmployeeId}
        />
      )}
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
  employeeItem: {
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
  employeeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#330077',
    flex: 1,
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
    paddingTop: 10,
  },
  infoText: {
    color: 'grey',
    marginBottom: 2,
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

export default Employee;
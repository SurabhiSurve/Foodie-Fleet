import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import MyTextInput from '../Component/MyTextInput';
const RequestHistory = () => {
  const [expanded, setExpanded] = useState(null);
  const [statuses, setStatuses] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
          console.error("User not logged in");
          setLoading(false);
          return;
        }
        
        const userId = user.uid;
        const snapshot = await firestore()
          .collection('ProductRequests')
          .where('userId', '==', userId)
          .get();

        const fetchedOrders = await Promise.all(snapshot.docs.map(async (doc) => {
          const orderData = doc.data();
          const shopSnapshot = await firestore().collection('Shops').doc(orderData.shopId).get();
          if (!shopSnapshot.exists) {
            console.log(`Shop with ID ${orderData.shopId} does not exist`);
            return null;
          }
          const shopData = shopSnapshot.data();
          return {
            id: doc.id,
            shopName: shopData.shopName,
            ...orderData
          };
        }));

        const validOrders = fetchedOrders.filter(order => order !== null);
        setOrders(validOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders: ", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleClose = () => {
    setExpanded(null);
  };

  const handleDelete = async (id) => {
    try {
      await firestore().collection('ProductRequests').doc(id).delete();
      setOrders(orders.filter(order => order.id !== id));
      setExpanded(null);
    } catch (error) {
      console.error("Error deleting order: ", error);
    }
  };

  const handleStatusChange = async (id, value) => {
    try {
      await firestore().collection('ProductRequests').doc(id).update({ status: value });
      setStatuses({ ...statuses, [id]: value });
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  const navigateToHome = () => {
    navigation.navigate("Home");
  };

  const filteredOrders = statusFilter ? orders.filter(order => order.Status === statusFilter) : orders;

  const renderOrder = ({ item }) => {
    const status = statuses[item.id] || item.status;

    return (
      <View style={styles.orderContainer}>
        <TouchableOpacity style={styles.orderItem} onPress={() => handleExpand(item.id)}>
          <Text style={styles.orderName}>{item.shopname}</Text>
          <Text style={styles.orderDate}>{new Date(item.date.toDate()).toDateString()}</Text>
        </TouchableOpacity>
        {expanded === item.id && (
          <View style={styles.orderDetails}>
            <View style={styles.header}>
              <View style={styles.mobileStatusContainer}>
                <Text style={styles.modalMobile}>Status: {item.Status}</Text>
                {/* <View style={styles.statusContainer}>
                  <Text style={styles.statusLabel}>Status</Text>
                  <Picker
                    selectedValue={status}
                    style={[styles.modalStatus, { color: getStatusColor(status) }]}
                    onValueChange={(value) => handleStatusChange(item.id, value)}
                  >
                    <Picker.Item label="Select Status" value="" />
                    <Picker.Item label="ACCEPTED" value="ACCEPTED" />
                    <Picker.Item label="PENDING" value="PENDING" />
                    <Picker.Item label="COMPLETED" value="COMPLETED" />
                  </Picker>
                </View> */}
              </View>
            </View>
            <View style={styles.modalTable}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Product</Text>
                <Text style={styles.tableHeaderText}>Qty</Text>
                <Text style={styles.tableHeaderText}>Unit</Text>
              </View>
              {item.products.map((product, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableRowText}>{product.name}</Text>
                  <Text style={styles.tableRowText}>{product.qty}</Text>
                  <Text style={styles.tableRowText}>{product.unit}</Text>
                </View>
              ))}
            </View>
            <MyTextInput
                placeholder="Enter message for cartist"
                fontSize={18}
                width={300}
                textAlign="left"
                value={item.message}
                style={styles.messageInput}
                editable={false}
            />
             {item.Status === 'DECLINED' && (
              <View style={styles.declineReasonContainer}>
                <Text style={styles.declineReasonLabel}>Decline Reason</Text>
                <Text style={styles.declineReasonText}>{item.declineReason}</Text>
              </View>
            )}
            {/* <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleClose}>
                <Text style={styles.buttonText}>CLOSE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: 'red' }]} onPress={() => handleDelete(item.id)}>
                <Text style={styles.buttonText}>DECLINE</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        )}
      </View>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'black';
      case 'PENDING':
        return 'black';
      case 'COMPLETED':
        return 'green';
      case 'DECLINED':
        return 'red';
      default:
        return 'black';
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {/* <Text style={styles.title}>Order History</Text> */}
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={statusFilter}
          style={styles.filterPicker}
          onValueChange={(itemValue) => setStatusFilter(itemValue)}
        >
          <Picker.Item label="Select Status" value="" />
          <Picker.Item label="PENDING" value="PENDING" />
          <Picker.Item label="ACCEPTED" value="ACCEPTED" />
          <Picker.Item label="COMPLETED" value="COMPLETED"   />
          <Picker.Item label="DECLINED" value="DECLINED"  />
        </Picker>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      {/* <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={navigateToHome}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
  },
  filterPicker: {
    height: 50,
    width: '100%',
    color:'grey'
  },
  orderContainer: {
    marginBottom: 20,
  },
  orderItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  orderDate: {
    fontSize: 14,
    color: 'red',
  },
  orderDetails: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mobileStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalMobile: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  modalStatus: {
    height: 50,
    width: 150,
  },
  modalTable: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4682B4',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableRowText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'green',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    color: '#333',
  },
  messageInput: {
    marginTop: 20,
    backgroundColor: 'white',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#202020',
},
declineReasonContainer: {
  marginTop: 10,
  paddingVertical: 10,
  paddingHorizontal: 15,
  backgroundColor: '#ffe6e6',
  borderRadius: 8,
},
declineReasonLabel: {
  fontSize: 16,
  fontWeight: 'bold',
  color: 'red',
  marginBottom: 5,
},
declineReasonText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
},
});

export default RequestHistory;
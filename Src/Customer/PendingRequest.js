import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert, Modal, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const PendingRequest = () => {
    const [expanded, setExpanded] = useState(null);
    const [statuses, setStatuses] = useState({});
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [declineModalVisible, setDeclineModalVisible] = useState(false);
    const [declineReason, setDeclineReason] = useState('');
    const [currentDeclineOrderId, setCurrentDeclineOrderId] = useState(null);

    useEffect(() => {

        const user = auth().currentUser;

        

        const fetchOrders = async () => {
            try {
                const snapshot = await firestore().collection('ProductRequests').where("UserId","==",user.uid).orderBy('date', 'desc').get();
                const fetchedOrders = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(fetchedOrders);

                const initialStatuses = fetchedOrders.reduce((acc, order) => {
                    acc[order.id] = order.Status || 'PENDING';
                    return acc;
                }, {});
                setStatuses(initialStatuses);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders: ", error);
                setLoading(false);
            }
        };

        fetchOrders();

        const unsubscribe = firestore().collection('ProductRequests').orderBy('date', 'desc').onSnapshot(snapshot => {
            const updatedOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(updatedOrders);

            const updatedStatuses = updatedOrders.reduce((acc, order) => {
                acc[order.id] = order.Status || 'PENDING';
                return acc;
            }, {});
            setStatuses(updatedStatuses);

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const handleStatusChange = (id, value) => {
        if (value === 'DECLINED') {
            setCurrentDeclineOrderId(id);
            setDeclineModalVisible(true);
        } else if (value === 'COMPLETED') {
            Alert.alert(
                "Confirmation",
                "Order is completed?",
                [
                    {
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel"
                    },
                    {
                        text: "OK",
                        onPress: () => updateOrderStatus(id, value)
                    }
                ]
            );
        } else {
            updateOrderStatus(id, value);
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await firestore().collection('ProductRequests').doc(id).update({ Status: status });
            setStatuses({ ...statuses, [id]: status });
            setOrders(prevOrders => prevOrders.map(order =>
                order.id === id ? { ...order, Status: status } : order
            ));
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };

    const handleDeclineSubmit = async () => {
        if (currentDeclineOrderId && declineReason) {
            try {
                await firestore().collection('ProductRequests').doc(currentDeclineOrderId).update({
                    Status: 'DECLINED',
                    declineReason
                });
                setStatuses({ ...statuses, [currentDeclineOrderId]: 'DECLINED' });
                setOrders(prevOrders => prevOrders.map(order =>
                    order.id === currentDeclineOrderId ? { ...order, Status: 'DECLINED', declineReason } : order
                ));
                setDeclineModalVisible(false);
                setDeclineReason('');
                setCurrentDeclineOrderId(null);
            } catch (error) {
                console.error("Error updating decline reason: ", error);
            }
        }
    };

    const renderOrder = ({ item }) => {
        const status = statuses[item.id] || 'PENDING';
        const message = item.message || '';
        const declineReason = item.declineReason || '';

        return (
            <View style={styles.orderContainer}>
                <TouchableOpacity style={styles.orderItem} onPress={() => handleExpand(item.id)}>
                    <Text style={styles.orderName}>{item.userFirstName} {item.userLastName}</Text>
                    <Text style={styles.orderDate}>{new Date(item.date.toDate()).toDateString()}</Text>
                </TouchableOpacity>
                {expanded === item.id && (
                    <View style={styles.orderDetails}>
                        <View style={styles.header}>
                            <View style={styles.mobileStatusContainer}>
                                <Text style={styles.modalMobile}>Mobile: {item.userMobile}</Text>
                                <View style={styles.statusContainer}>
                                    <Text style={styles.statusLabel}>Status</Text>
                                    <Picker
                                        selectedValue={status}
                                        style={[styles.modalStatus, { color: getStatusColor(status) }]}
                                        onValueChange={(value) => handleStatusChange(item.id, value)}
                                    >
                                        <Picker.Item label="PENDING" value="PENDING" />
                                        <Picker.Item label="ACCEPTED" value="ACCEPTED" />
                                        <Picker.Item label="COMPLETED" value="COMPLETED" />
                                        <Picker.Item label="DECLINED" value="DECLINED" />
                                    </Picker>
                                </View>
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
                        <View>
                            <TextInput
                                multiline
                                numberOfLines={1}
                                maxLength={40}
                                value={message}
                                style={styles.messageInput}
                                editable={false}
                            />
                            {status === 'DECLINED' && (
                                <TextInput
                                    multiline
                                    numberOfLines={1}
                                    maxLength={40}
                                    value={declineReason}
                                    style={styles.declineReasonInput}
                                    editable={false}
                                    placeholder="Decline Reason"
                                />
                            )}
                        </View>
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
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={declineModalVisible}
                onRequestClose={() => {
                    setDeclineModalVisible(!declineModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Decline Reason</Text>
                        <TextInput
                            style={styles.modalInput}
                            multiline
                            numberOfLines={4}
                            onChangeText={(text) => setDeclineReason(text)}
                            value={declineReason}
                            placeholder="Enter decline reason"
                        />
                        <Button
                            title="Submit"
                            onPress={handleDeclineSubmit}
                        />
                    </View>
                </View>
            </Modal>
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
        color: '#333',
    },
    orderDate: {
        fontSize: 14,
        color: '#4682B4',
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
    messageInput: {
        backgroundColor: 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        color: '#202020',
    },
    declineReasonInput: {
        backgroundColor: '#fff0f0',
        borderColor: '#ffcccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        color: '#cc0000',
        marginTop: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalInput: {
        width: 250,
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
        color:'grey',
    },
});

export default PendingRequest;

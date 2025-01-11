import * as React from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import MyTextInput from '../../Component/MyTextInput';
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';

const EditProduct = ({ isVisible, onClose, productId }) => {
    const [productData, setProductData] = useState(null);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [unit, setUnit] = useState('');
    const [units, setUnits] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchCategoriesAndUnits = async () => {
            const catSnapshot = await firestore().collection('Category').where("Status", "==", "Active").get();
            const unitSnapshot = await firestore().collection('Unit').where("Status", "==", "Active").get();

            setCategories(catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setUnits(unitSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchCategoriesAndUnits();
    }, []);

    useEffect(() => {
        if (productId && isVisible) {
            const unsubscribe = firestore()
                .collection('Product')
                .doc(productId)
                .onSnapshot((documentSnapshot) => {
                    if (documentSnapshot.exists) {
                        const data = documentSnapshot.data();
                        setProductData(data);
                        setName(data.ProductName || '');
                        setDescription(data.Description || '');
                        setPrice(data.Price ? data.Price.toString() : ''); // Convert price to string for TextInput
                        setCategory(data.CategoryId || ''); // Ensure CategoryId is stored and fetched correctly
                        setUnit(data.Unit || ''); // Ensure UnitId is stored and fetched correctly
                        setStatus(data.Status || 'Available');
                    }
                });

            return () => unsubscribe();
        }
    }, [productId, isVisible]);

    useEffect(() => {
        if (!isVisible) {
            resetState();
        }
    }, [isVisible]);

    const resetState = () => {
        setProductData(null);
        setCategory('');
        setName('');
        setDescription('');
        setPrice('');
        setUnit('');
        setStatus('');
    };

    const handleSelectCategory = (itemValue, itemIndex) => {
        if (itemIndex > 0) { // this will avoid the Select Category default picker item
            setCategory(itemValue);
        }
    };

    const handleSelectUnit = (itemValue, itemIndex) => {
        if (itemIndex > 0) { // this will avoid the Select Unit default picker item
            setUnit(itemValue);
        }
    };

    const handleEditProduct = async () => {
        if (!name || !description || !price || !category || !unit) {
            Alert.alert('Please fill all fields');
            return;
        }

        try {
            await firestore().collection('Product').doc(productId).update({
                CategoryId: category,
                CategoryName: categories.find(c => c.id === category).CategoryName,
                ProductName: name,
                Description: description,
                Price: parseFloat(price),
                Unit: unit,
                UnitName: units.find(u => u.id === unit).UnitName,
                Status: status
            });
            Alert.alert('Product updated successfully');
            onClose(); // Close the modal
        } catch (error) {
            console.error("Failed to update product:", error);
            Alert.alert('Error', 'Failed to update product');
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
            transparent={true}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.headerText}>Edit Product</Text>
                    <Picker
                        selectedValue={category}
                        onValueChange={handleSelectCategory}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        <Picker.Item label="Select Category" value="" />
                        {categories.map((cat) => (
                            <Picker.Item key={cat.id} label={cat.CategoryName} value={cat.id} />
                        ))}
                    </Picker>

                    <MyTextInput
                        placeholder="Name"
                        fontSize={18}
                        width={280}
                        textAlign="left"
                        value={name}
                        onChangeText={setName}
                    />
                    <MyTextInput
                        placeholder="Description"
                        fontSize={18}
                        width={280}
                        textAlign="left"
                        value={description}
                        onChangeText={setDescription}
                    />
                    <MyTextInput
                        placeholder="Price"
                        fontSize={18}
                        width={280}
                        textAlign="left"
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                    />
                    <Picker
                        selectedValue={unit}
                        onValueChange={handleSelectUnit}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        <Picker.Item label="Select Unit" value="" />
                        {units.map((u) => (
                            <Picker.Item key={u.id} label={u.UnitName} value={u.id} />
                        ))}
                    </Picker>
                    <Picker
                        selectedValue={status}
                        onValueChange={setStatus}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        <Picker.Item label="Available" value="Available" />
                        <Picker.Item label="Unavailable" value="Unavailable" />
                    </Picker>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleEditProduct}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
                            <Text style={styles.buttonCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowColor: '#000',
        shadowOffset: { height: 2, width: 0 },
        width: '80%'
    },
    headerText: {
        color: '#6200ee',
        fontSize: 24,
        fontWeight: 'bold'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%'
    },
    button: {
        flex: 1,
        backgroundColor: '#00aa00',
        padding: 12,
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center'
    },
    buttonCancel: {
        flex: 1,
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'grey',
        marginHorizontal: 5,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    buttonCancelText: {
        color: 'grey',
        fontSize: 16,
        fontWeight: 'bold'
    },
    picker: {
        width: 280,
        marginTop: 20,
        fontSize: 18,
        color: 'grey',
        backgroundColor: 'white',
        borderRadius: 5,
        borderColor: '#CCC',
        borderWidth: 1,
    }
});

export default EditProduct;

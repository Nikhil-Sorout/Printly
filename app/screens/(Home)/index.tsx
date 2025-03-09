import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Home from './homeWithMenu';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { AddIcon, AlertCircleIcon, CloseIcon, Icon } from '@/components/ui/icon';
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import AddItemModal from '@/components/AddItemModal';
import homeWithoutMenuThemedStyles from '@/app/styles/homeWithoutMenuThemedStyles';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '@/helper';
import { useApiError } from '@/app/hooks/useApiError';


type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: string; // Changed from string to number
  created_at: string;
  updated_at: string;
};

interface ProcessedMenuItem {
  id: number;
  name: string;
  category: string;
  price: number; // Converted to number
  created_at: string;
  updated_at: string;
}

// Category group structure
interface CategoryGroup {
  id: string;
  name: string;
  items: ProcessedMenuItem[];
}






const Index: React.FC = () => {
  

  const styles = homeWithoutMenuThemedStyles();

  const [showModal, setShowModal] = React.useState(false)

  const { isModalVisible, errorDetails, showError, hideError } = useApiError();

  const [menuData, setMenuData] = useState<CategoryGroup[]>([])

  
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log(token)
      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await axios.get(`${baseUrl}/items/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Menu ', response.data.data.items);
      const items = response.data.data.items
      setMenuData(response.data.data.items)
      if (response.status !== 201) {
        showError(response.status);
        return;
      }

    } catch (err) {
      console.log('Caught the error ', err);
      showError(undefined, 'Network Error Occurred');
      return []
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  console.log(menuData)
  // Will show the modal
  const handleAddItem = () => {
    setShowModal(true)
    console.log(showModal)
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header />
      {menuData.length > 0 ? <Home menuData={menuData} fetchData={fetchData} /> : (
        <View style={styles.container}>
          <Text style={styles.addItemsTxt}>No items available right now!</Text>
          {/* Add items button */}
          <Button style={styles.addItemsBtn} size="md" variant="solid" action="primary" onPress={handleAddItem}>
            <ButtonText>Add Item</ButtonText>
            <ButtonIcon as={AddIcon} />
          </Button>

          {/* Add items modal */}
          <AddItemModal isVisible={showModal} onClose={handleCloseModal} fetchData={fetchData} addItem={true}/>
        </View>)}
    </SafeAreaView>
  )
};


export default Index;

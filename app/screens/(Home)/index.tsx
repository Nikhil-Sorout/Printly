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
import {UIActivityIndicator} from 'react-native-indicators';
import { useTheme } from '@/app/context/themeContext';

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

  const {theme} = useTheme();

  const [showModal, setShowModal] = React.useState(false)

  const { isModalVisible, errorDetails, showError, hideError } = useApiError();

  const [loading, setLoading] = useState(true);

  const [menuData, setMenuData] = useState<CategoryGroup[]>([])



  const fetchData = async () => {
    try {
      setLoading(true);
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

      if (response.status === 200 || response.status === 201) { // Check if successful
        console.log('Menu ', response.data.data.items);
        setMenuData(response.data?.data?.items || []);
        setLoading(false); // Stop loading only if successful
      } else {
        showError(response.status);
      }

    } catch (err) {
      console.log('Caught the error ', err);
      showError(undefined, 'Network Error Occurred');
    }

  };


  useEffect(() => {
    fetchData();
  }, []);

  console.log(menuData)
  // Will show the modal
  const handleAddItem = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };


  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header />

      {/* Show Loading Indicator */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <UIActivityIndicator count={12} size={30} color={theme.primary} />
        </View>
      ) : menuData.length > 0 ? (
        <Home menuData={menuData} fetchData={fetchData} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.addItemsTxt}>No items available right now!</Text>
          <Button style={styles.addItemsBtn} size="md" variant="solid" action="primary" onPress={handleAddItem}>
            <ButtonText>Add Item</ButtonText>
            <ButtonIcon as={AddIcon} />
          </Button>

          <AddItemModal isVisible={showModal} onClose={handleCloseModal} fetchData={fetchData} addItem={true} />
        </View>
      )}
    </SafeAreaView>
  )
};


export default Index;

import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { menuData } from '../../data/menuData';
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




const Index: React.FC = () => {

  const styles = homeWithoutMenuThemedStyles();

  const [showModal, setShowModal] = React.useState(false)


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
      {menuData.length > 0 ? <Home /> : (
        <View style={styles.container}>
          <Text style={styles.addItemsTxt}>No items available right now!</Text>
          {/* Add items button */}
          <Button style={styles.addItemsBtn} size="md" variant="solid" action="primary" onPress={handleAddItem}>
            <ButtonText>Add Item</ButtonText>
            <ButtonIcon as={AddIcon} />
          </Button>

          {/* Add items modal */}
          <AddItemModal isVisible={showModal} onClose={handleCloseModal} />
        </View>)}
    </SafeAreaView>
  )
};




export default Index;

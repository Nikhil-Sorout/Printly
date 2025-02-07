import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { menuData } from '../../data/menuData';
import { cartSlice } from '../../redux/cartSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from './homeWithMenu';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { AddIcon, AlertCircleIcon, CloseIcon, Icon } from '@/components/ui/icon';
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';



const { width, height } = Dimensions.get('window')


const Index: React.FC = () => {

  const [showModal, setShowModal] = React.useState(false)


  // Will show the modal
  const handleAddItem = () => {
    setShowModal(true)
  }

  // Save the new item
  const saveItem = () => {
    const isCategoryInvalid = category.length <= 0
    const isPriceInvalid = price.length <= 0
    const isItemInvalid = item.length <= 0

    setIsCategoryInvalid(isCategoryInvalid)
    setIsItemInvalid(isItemInvalid)
    setIsPriceInvalid(isPriceInvalid)

    if (!isCategoryInvalid && !isItemInvalid && !isPriceInvalid) {
      setShowModal(false);
    }
  }


  const [category, setCategory] = useState('')
  const [item, setItem] = useState('')
  const [price, setPrice] = useState('')

  const [isCategoryInvalid, setIsCategoryInvalid] = React.useState(false)
  const [isItemInvalid, setIsItemInvalid] = React.useState(false)
  const [isPriceInvalid, setIsPriceInvalid] = React.useState(false)

  return menuData.length > 0 ? <Home /> : (
    <View style={styles.container}>
      <Text style={styles.addItemsTxt}>No items available right now!</Text>
      {/* Add items button */}
      <Button style={styles.addItemsBtn} size="md" variant="solid" action="primary" onPress={handleAddItem}>
        <ButtonText>Add Item</ButtonText>
        <ButtonIcon as={AddIcon} />
      </Button>

      {/* Add items modal */}
      <Modal isOpen={showModal} onClose={() => {
        setShowModal(false)
      }}>
        <ModalContent>
          <ModalHeader>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#9893DA' }}>Add Item</Text>
            <ModalCloseButton>
              <Icon as={CloseIcon} size="md" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody contentContainerStyle={styles.modalBody}>

            {/* Category */}
            <FormControl
              style={styles.formControl}
              isInvalid={isCategoryInvalid}
              size="md"
              isDisabled={false}
              isReadOnly={false}
              isRequired={false}
            >
              <FormControlLabel>
                <FormControlLabelText style={styles.label}>Category</FormControlLabelText>
              </FormControlLabel>
              <Input style={styles.input} size='md'>
                <InputField
                  placeholder="Enter category of item"
                  value={category}
                  onChangeText={(text) => setCategory(text)}
                />
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  Category name is required.
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* Item Name */}
            <FormControl
              style={styles.formControl}
              isInvalid={isItemInvalid}
              size="md"
              isDisabled={false}
              isReadOnly={false}
              isRequired={false}
            >
              <FormControlLabel>
                <FormControlLabelText style={styles.label}>Name</FormControlLabelText>
              </FormControlLabel>
              <Input style={styles.input} size='md'>
                <InputField
                  placeholder="Enter name of item"
                  value={item}
                  onChangeText={(text) => setItem(text)}
                />
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  Item name is required.
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* Price */}
            <FormControl
              style={styles.formControl}
              isInvalid={isPriceInvalid}
              size="md"
              isDisabled={false}
              isReadOnly={false}
              isRequired={false}
            >
              <FormControlLabel>
                <FormControlLabelText style={styles.label}>Price</FormControlLabelText>
              </FormControlLabel>
              <Input style={styles.input} size='md'>
                <InputField
                  placeholder="Enter price of item"
                  value={price}
                  onChangeText={(text) => setPrice(text)}
                />
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  Price of item is required.
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button style={styles.addItemsBtn} size="md" variant="solid" action="primary" onPress={saveItem}>
              <ButtonText>Done</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>)
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: height * .04,
    justifyContent: 'center',
    alignItems: 'center',
    gap: height * .02
  },
  addItemsTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey'
  },
  addItemsBtn: {
    backgroundColor: '#9893DA'
  },
  modalBody: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: 5
  },
  formControl: {
    width: width * .5
  },
  label: {
    color: "#9893DA",
    fontWeight: 'bold'
  },
  input: {
    borderColor: '#9893DA'
  },
})



export default Index;

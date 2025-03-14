import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, InputField } from '@/components/ui/input'
import { Button, ButtonText } from '@/components/ui/button'
import { Link, router } from 'expo-router'
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control'
import { AlertCircleIcon } from "@/components/ui/icon"
import authScreenThemedStyles from '@/app/styles/authScreenThemedStyles'
import axios from 'axios'
import { baseUrl } from '@/helper'
import { useTheme } from '@/app/context/themeContext'

// Dimensions of screen
const { width, height } = Dimensions.get('window')

const signUp = () => {

  const {theme} = useTheme()

  // Input parameters
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [isPswdInvalid, setIsPswdInvalid] = React.useState(false)
  const [isUserNameInvalid, setIsUserNameInvalid] = React.useState(false)
  const [isEmailInvalid, setIsEmailInvalid] = React.useState(false)

  // Handle Sign Up
  const handleSignUp = async() => {
    const isPswdInvalid = password.length < 6;
    const isUserNameInvalid = userName.length === 0;
    
    setIsPswdInvalid(isPswdInvalid);
    setIsEmailInvalid(isEmailInvalid);
    setIsUserNameInvalid(isUserNameInvalid);
  
    if (!isPswdInvalid && !isEmailInvalid && !isUserNameInvalid) {
      try {
        const response = await axios.post(`${baseUrl}/auth/register`, {
          username: userName,
          email: email,
          password: password
        });
        router.replace('/screens/(Onboarding)/logIn');
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
  };
  
  const styles = authScreenThemedStyles()

  return (
    <SafeAreaView style={styles.container}>

      {/* Icon */}
      <Image source={require('../../../assets/images/PrintlyIcon.jpg')} style={styles.img} />

      <Text style={styles.appName}>Printly</Text>

      {/* UserName */}
      <FormControl
        style={styles.formControl}
        isInvalid={isUserNameInvalid}
        size="md"
        isDisabled={false}
        isReadOnly={false}
        isRequired={false}
      >
        <FormControlLabel>
          <FormControlLabelText style={styles.label}>Username</FormControlLabelText>
        </FormControlLabel>
        <Input style={styles.input} size='md'>
          <InputField
            placeholder="Username"
            value={userName}
            onChangeText={(text) => setUserName(text)}
            style={{color: theme.neutralText}}
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>
            Username cannot be empty.
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      {/* Email */}
      <FormControl
        style={styles.formControl}
        isInvalid={isEmailInvalid}
        size="md"
        isDisabled={false}
        isReadOnly={false}
        isRequired={false}
      >
        <FormControlLabel>
          <FormControlLabelText style={styles.label}>Email</FormControlLabelText>
        </FormControlLabel>
        <Input style={styles.input} size='md'>
          <InputField
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={{color: theme.neutralText}}
          />
        </Input>
        <FormControlHelper>
          <FormControlHelperText>
            Must be a valid email.
          </FormControlHelperText>
        </FormControlHelper>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>
            Email is invalid.
          </FormControlErrorText>
        </FormControlError>
      </FormControl>
      
      {/* Password */}
      <FormControl
        style={styles.formControl}
        isInvalid={isPswdInvalid}
        size="md"
        isDisabled={false}
        isReadOnly={false}
        isRequired={false}
      >
        <FormControlLabel>
          <FormControlLabelText style={styles.label}>Password</FormControlLabelText>
        </FormControlLabel>
        <Input style={styles.input} size='md'>
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={{color: theme.neutralText}}
          />
        </Input>
        <FormControlHelper>
          <FormControlHelperText>
            Must be atleast 6 characters.
          </FormControlHelperText>
        </FormControlHelper>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>
            Atleast 6 characters are required.
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      {/* Sign Up Button */}
      <Button size="md" variant="solid" action="primary" onPress={handleSignUp} style={styles.signInBtn}>
        <ButtonText>Sign Up</ButtonText>
      </Button>
      <Text style={styles.footerTxt}>Already have an account? <Link href={'/screens/(Onboarding)/logIn'} replace style={styles.loginTxt}>Login</Link></Text>
    </SafeAreaView>
  )
}

export default signUp
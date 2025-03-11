import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, InputField } from '@/components/ui/input'
import { Button, ButtonText } from '@/components/ui/button'
import { Link, router } from 'expo-router'
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control'
import { AlertCircleIcon } from "@/components/ui/icon"
import authScreenThemedStyles from '@/app/styles/authScreenThemedStyles'
import axios from 'axios'
import { baseUrl } from '@/helper'
import { useApiError } from '../../hooks/useApiError'
import { ErrorModal } from '@/components/ErrorModal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTheme } from '@/app/context/themeContext'

// Dimensions of screen
const { width, height } = Dimensions.get('window')

const logIn = () => {
    const { isModalVisible, errorDetails, showError, hideError } = useApiError()

    const {theme} = useTheme()


    // Input parameters
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    

    const [isPswdInvalid, setIsPswdInvalid] = React.useState(false)
    const [isEmailInvalid, setIsEmailInvalid] = React.useState(false)

    // Handle Sign Up
    const handleLogIn = async() => {
        const isPswdInvalid = password.length < 6;

        setIsPswdInvalid(isPswdInvalid);
        setIsEmailInvalid(isEmailInvalid);

        if (!isPswdInvalid && !isEmailInvalid) {
            try {
                const response = await axios.post(`${baseUrl}/auth/login`, {
                    email: email,
                    password: password
                });
                if (response.status !== 201) {
                    showError(response.status);
                    return;
                }

                // Handle successful login
                const token = response.data.data.token;
                const shop_id = response.data.data.user.shop_id;
                console.log('shopId : ', shop_id)
                await AsyncStorage.setItem('shop_id', shop_id.toString())
                await AsyncStorage.setItem('userToken', token);
                router.replace('/screens/(Home)');
            } catch (error) {
                console.log("Cathced the error", error)
                showError(undefined, 'Network error occurred');
            }
        }
    };

    const styles = authScreenThemedStyles()


    return (
        <SafeAreaView style={styles.container}>

            {/* Icon */}
            <Image source={require('../../../assets/images/PrintlyIcon.jpg')} style={styles.img} />

            <Text style={styles.appName}>Printly</Text>

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
            <Button size="md" variant="solid" action="primary" onPress={handleLogIn} style={styles.signInBtn}>
                <ButtonText>Log In</ButtonText>
            </Button>
            <Text style={styles.footerTxt}>Don't have an account? <Link href={'/screens/(Onboarding)/signUp'} replace style={styles.loginTxt}>Sign Up</Link></Text>

            <ErrorModal
                isVisible={isModalVisible}
                statusCode={errorDetails.statusCode}
                message={errorDetails.message}
                onClose={hideError}
            />
        </SafeAreaView>
    )
}


export default logIn
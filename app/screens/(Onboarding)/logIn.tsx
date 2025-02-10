import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, InputField } from '@/components/ui/input'
import { Button, ButtonText } from '@/components/ui/button'
import { Link, router } from 'expo-router'
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control'
import { AlertCircleIcon } from "@/components/ui/icon"
import authScreenThemedStyles from '@/app/styles/authScreenThemedStyles'

// Dimensions of screen
const { width, height } = Dimensions.get('window')

const logIn = () => {

    // Input parameters
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isPswdInvalid, setIsPswdInvalid] = React.useState(false)
    const [isEmailInvalid, setIsEmailInvalid] = React.useState(false)

    // Handle Sign Up
    const handleLogIn = () => {
        const isPswdInvalid = password.length < 6;

        setIsPswdInvalid(isPswdInvalid);
        setIsEmailInvalid(isEmailInvalid);

        if (!isPswdInvalid && !isEmailInvalid) {
            router.replace('/screens/(Home)');
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
            <Text style={styles.footerTxt}>Don't have an account? <Link href={'/screens/(Home)'} replace style={styles.loginTxt}>Sign Up</Link></Text>
        </SafeAreaView>
    )
}


// StyleSheet
// const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: '#F6F6FF',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     gap: height * .02,
    //     padding: width * .05
    // },
    // img: {
    //     width: width * .4,
    //     height: height * .2,
    //     borderRadius: (width * .2) / 2,
    // },
    // appName: {
    //     fontSize: 22,
    //     fontFamily: 'serif',
    //     color: '#9893DA',
    //     fontWeight: 'bold'
    // },
    // formControl: {
    //     width: width * .9
    // },
    // label: {
    //     color: "#9893DA",
    //     fontWeight: 'bold'
    // },
    // input: {
    //     borderColor: '#9893DA'
    // },
    // signInBtn: {
    //     backgroundColor: '#9893DA',
    // },
    // footerTxt: {
    //     fontSize: 15,
    //     color: 'grey',
    //     top: 15
    // },
    // loginTxt: {
    //     fontWeight: 'bold',
    //     color: '#9893DA'
    // }
// })

export default logIn
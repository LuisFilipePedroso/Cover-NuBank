import React, { Component } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    AlertIOS,
    AsyncStorage
} from 'react-native';

import { StackActions, NavigationActions } from 'react-navigation';

import logo from '../../logo.png';
import api from '../services/api';

export default class Login extends Component {
    static navigationOptions = {
        header: null
    }

    state = {
        email: "",
        password: "",
        users: []
    }

    handleLogin = async () => {
        const { email, password } = this.state;

        if(!email.length > 0) return AlertIOS.alert("Empty email field");
        if(!password.length > 0) return AlertIOS.alert("Empty password field");

        const response = await api.get(`user/${email}`);

        if(response.data === null) return AlertIOS.alert("User not found");
        let account = response.data.account;

        await AsyncStorage.setItem('@NuClone:userAccount', account.toString());
        await AsyncStorage.setItem('@NuClone:userMail', email);
        
        this.navigateToTimeline();
    }

    navigateToTimeline = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Panel' })]
        });

        this.props.navigation.dispatch(resetAction);
    }

    handleEmailChange = email => {
        this.setState({ email });
    }

    handlePasswordChange = password => {
        this.setState({ password });
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.content}>
                    <View>
                        <Image source={logo} style={styles.logo} />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu email"
                        placeholderTextColor="#ddd"
                        value={this.state.email}
                        onChangeText={this.handleEmailChange}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua senha"
                        placeholderTextColor="#ddd"
                        onChangeText={this.handlePasswordChange}
                        secureTextEntry={true}
                    />
                    <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
                        <Text style={styles.buttonText}>Autenticar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#81249d",
        color: "#fff"
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30
    },
    logo: {
        height: 100,
        width: 100
    },
    input: {
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 1,
        height: 44,
        paddingHorizontal: 15,
        alignSelf: "stretch",
        marginTop: 20,
        color: "#fff",
        fontSize: 18
    },
    button: {
        height: 44,
        alignSelf: "stretch",
        marginTop: 20,
        borderRadius: 1,
        borderWidth: 1,
        borderColor: "#DDD",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 18
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold"
    }
})
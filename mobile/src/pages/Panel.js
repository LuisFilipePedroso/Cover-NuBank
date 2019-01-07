import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage, SafeAreaView, TouchableOpacity } from 'react-native';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { MaskService } from 'react-native-masked-text';

import api from '../services/api';
import socket from 'socket.io-client';

import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Panel extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Minha conta",
        header: null
    });

    state = {
        balance: 0
    }

    async componentDidMount() {
        this.subscribeToEvents();
        this.getBalance();
    }

    subscribeToEvents = async () => {
        const userMail = await AsyncStorage.getItem('@NuClone:userMail');
        const io = socket(`http://localhost:3000/`);

        io.on('fromuser', data => {
            if (data.email === userMail) {
                const balance = MaskService.toMask('money', data.balance);
                this.setState({ balance: balance });
            }
        });

        io.on('touser', data => {
            if (data.email === userMail) {
                const balance = MaskService.toMask('money', data.balance);
                this.setState({ balance: balance });
            }
        })
    }

    getBalance = async () => {
        const userMail = await AsyncStorage.getItem('@NuClone:userMail');
        const response = await api.get(`user/${userMail}`);
        const balance = MaskService.toMask('money', response.data.balance);

        this.setState({ balance: balance });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceCardValue}>{this.state.balance}</Text>
                    <Text style={styles.balanceCardText}>Saldo Atual</Text>
                </View>
                <View style={styles.buttonBox}>
                    <TouchableOpacity style={styles.buttons} onPress={() => navigate('Timeline')}>
                        <Icon name="payment" size={30} style={styles.icon} />
                        <Text style={styles.textButton}>Minhas Transações</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttons} onPress={() => navigate('New')}>
                        <Icon name="add" size={30} style={styles.icon} />
                        <Text style={styles.textButton}>Nova Transação</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: "#fff"
    },
    balanceCard: {
        width: 200,
        height: 80,
        marginTop: 80,
        //backgroundColor: "#C54DE9",
        //borderWidth: 2,
        // borderRadius: 5,
        //borderColor: "#C54DE9",
        justifyContent: 'center',
        alignItems: 'center',
    },
    balanceCardText: {
        fontSize: 18,
        color: "#838483",
        fontWeight: '800'
    },
    balanceCardValue: {
        fontSize: 25,
        marginTop: 10,
        color: "#424242"
    },
    buttonBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: 300,
    },
    buttons: {
        height: 50,
        alignItems: 'center'
    },
    textButton: {
        color: "#81249D",
        fontSize: 16
    },
    icon: {
        color: "#81249D",
    }
});

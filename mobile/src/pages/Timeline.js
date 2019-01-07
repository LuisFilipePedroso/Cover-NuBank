import React, { Component } from 'react';
import api from '../services/api';
import socket from 'socket.io-client';
import { MaskService } from 'react-native-masked-text';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  SafeAreaView
}
  from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Transaction from '../components/Transaction';

export default class Timeline extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Minhas Transações',
    header: null,
  });

  state = {
    transactions: [],
    saldo: 0
  }

  async componentDidMount() {
    this.subscribeToEvents();
    this.getTransactions();
    this.getBalance();
  }

  getTransactions = async () => {
    const userAccount = await AsyncStorage.getItem('@NuClone:userAccount');
    const response = await api.get(`transaction/${userAccount}`);
    this.setState({ transactions: response.data });
  }

  getBalance = async () => {
    const userMail = await AsyncStorage.getItem('@NuClone:userMail');
    const response = await api.get(`user/${userMail}`);

    const balance = MaskService.toMask('money', response.data.balance);

    this.setState({ saldo: balance });
  }

  subscribeToEvents = async () => {
    const userMail = await AsyncStorage.getItem('@NuClone:userMail');
    const io = socket(`http://localhost:3000/`);

    io.on("transaction", data => {
      this.setState({ transactions: [data, ...this.state.transactions] });
    });

    io.on('fromuser', data => {
      if (data.email === userMail) {
        const balance = MaskService.toMask('money', data.balance);
        this.setState({ saldo: balance });
      }
    });

    io.on('touser', data => {
      if (data.email === userMail) {
        const balance = MaskService.toMask('money', data.balance);
        this.setState({ saldo: balance });
      }
    })
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>Saldo Disponível: {this.state.saldo}</Text>
        </View>
        <FlatList
          data={this.state.transactions}
          keyExtractor={transaction => transaction._id}
          renderItem={({ item }) => <Transaction item={item} />}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2"
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: "#81249d",
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15
  },
  textHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: "#118759"
  }
});

import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import moment from 'moment';
import { TextMask } from 'react-native-masked-text';

export default class Transaction extends Component {

    // style = () => {
    //     const { item } = this.props;
        
    //     const model = item.model;

    //     return {
    //         color: {{model === "T" ? "Transferência" : item.model === "D" ? "Depósito" : "Saque";},
    //         fontSize: 20,
    //         fontWeight: '500',
    //     }
    // }

    componentDidMount() {
        //this.style();
    }

    render() {
        const { item } = this.props;
        const title = item.model === "T" ? "Transferência" : item.model === "D" ? "Depósito" : "Saque";
        return (
            <View style={styles.container}>
                <View style={styles.info}>
                    <Text style={styles.type}>{title}</Text>
                    <Text style={styles.textDate} type={'money'} >{moment(item.createdAt).format('DD MMM')}</Text>
                </View>
                <TextMask style={styles.value} type={'money'} value={item.value}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        borderBottomWidth: 1,
        borderColor: "#eee"
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    type: {
        color: "#8B27AA",
        fontSize: 20,
        marginBottom: 5
    },
    textDate: {
        color: "#7c7c7c",
        fontSize: 20,
        marginBottom: 5
    },
    value: {
        color: "#7c7c7c",
        fontSize: 20,
        fontWeight: '500',
    }
});
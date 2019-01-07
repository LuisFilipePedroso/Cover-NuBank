import React, { Component } from 'react';
import {
    View,
    Text,
    Picker,
    Modal,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    AsyncStorage,
    Alert,
    TextInput
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import RNPickerSelect from 'react-native-picker-select';

import api from '../services/api';

export default class New extends Component {
    static navigationOptions = {
        title: "Nova Transação",
        header: null
    };

    constructor(props) {
        super(props);
        this.inputRefs = {};
    }

    state = {
        type: "",
        value: "",
        para: "",
        items: [
            {
                label: 'Depósito',
                value: 'D',
            },
            {
                label: 'Saque',
                value: 'S',
            },
            {
                label: 'Transfêrencia',
                value: 'T',
            },
        ],
    }

    handleComboChange = value => {
        this.setState({ type: value })
    }

    handleInputChange = value => {
        this.setState({ value });
    }

    handleInputAccount = value => {
        this.setState({ para: value })
    }

    handleSubmit = async () => {
        const from = await AsyncStorage.getItem('@NuClone:userAccount');
        const model = this.state.type;
        let value = this.state.value.replace(/\D+/, '');
        const to = this.state.para;

        await api.post("transaction", { from, model, value, to })
            .then(response => {
                this.setState({ type: "" });
                this.setState({ para: "" });
                this.setState({ value: "" });
                this.setState({ to: "" });

                Alert.alert("Transação realizada com sucesso!")
            })
            .catch(err => {
                Alert.alert("Oops, algo de erro aconteceu!! Tente novamente");
            });
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View>
                    <Text style={styles.text}>Tipo</Text>
                    <RNPickerSelect
                        placeholder={{
                            label: 'Selecione uma operação...',
                            value: null,
                        }}
                        items={this.state.items}
                        onValueChange={(value) => this.handleComboChange(value)}
                        onUpArrow={() => {
                            this.inputRefs.name.focus();
                        }}
                        onDownArrow={() => {
                            this.inputRefs.picker2.togglePicker();
                        }}
                        style={{ ...pickerSelectStyles }}
                        value={this.state.type}
                        ref={(el) => {
                            this.inputRefs.picker = el;
                        }}
                    />
                    <Text style={styles.text}>Conta</Text>
                    <TextInput
                        value={this.state.para}
                        onChangeText={this.handleInputAccount}
                        style={styles.input}
                    />
                    <Text style={styles.text}>Valor</Text>
                    <TextInputMask
                        keyboardType='default'
                        type={'money'}
                        style={styles.input}
                        value={this.state.value}
                        onChangeText={this.handleInputChange} />
                    <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
                        <Text style={styles.buttonText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff"
    },
    text: {
        fontSize: 20,
        marginTop: 10,
        marginBottom: 10
    },
    combo: {
        width: 300,
        height: 20,
        borderWidth: 1,
        borderRadius: 5
    },
    input: {
        width: 300,
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: 'white',
        color: 'black',
    },
    button: {
        width: 300,
        height: 40,
        backgroundColor: "#0E6A46",
        marginTop: 40,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        fontSize: 20,
        color: "#fff"
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: 'white',
        color: 'black',
    },
});
import React from 'react'
import { Picker, StyleSheet, TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-datepicker'
import makeInput, {
    withNextInputAutoFocusForm,
    withNextInputAutoFocusInput,
} from 'react-native-formik'
import { Button, Text, TextInput } from 'react-native-paper'
import { compose } from 'redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { categories, categoriesKeys } from '../../../constants/categories'
import { getDate } from '../../../utils/getDate'

const FormTextInput = compose(
    makeInput,
    withNextInputAutoFocusInput,
)(TextInput)

const Form = withNextInputAutoFocusForm(View)

const validationSchema = Yup.object().shape({
    description: Yup.string().max(150, 'Descriptions must be less than 100 characters'),
    amount: Yup.number()
        .typeError('Please enter a number')
        .required('Please enter an amount'),
})

class AddLedgerEntry extends React.Component {
    constructor(props) {
        super(props)
        const dateObj = getDate()
        this.state = {
            category: 'uncategorized',
            date: dateObj.date,
            day: dateObj.day,
            month: dateObj.month,
            year: dateObj.year,
            moneySource: 'citizens',
            moneyDestination: 'expense',
        }
    }

    handleOnDateChange = date => {
        const day = parseInt(date.substring(3, 5), 10)
        const month = parseInt(date.substring(0, 2), 10)
        const year = parseInt(date.substring(6, 10), 10)
        this.setState({ day, month, year, date })
    }

    addLedgerEntry = values => {
        const { day, month } = this.state
        const dayString = day > 9 ? day.toString() : `0${day.toString()}`
        const monthString = month > 9 ? month.toString() : `0${month.toString()}`
        const dateString = `${monthString}/${dayString}`

        const description =
            values.description !== ''
                ? values.description
                : categories[this.state.category].displayName
        this.props.addLedgerEntry(
            {
                amount: values.amount,
                category: this.state.category,
                date: this.state.date,
                dateString,
                day: this.state.day,
                description,
                moneyDestination: this.state.moneyDestination,
                moneySource: this.state.moneySource,
                month: this.state.month,
                year: this.state.year,
            },
            true,
        )
        this.props.accountAdd({
            moneyDestination: this.state.moneyDestination,
            amount: values.amount,
        })
        if (this.state.category !== 'transfer' && this.state.category !== 'income') {
            const newAmount = this.props.monthCurrent - parseFloat(values.amount)
            this.props.editMonthCurrent({
                monthCurrent: newAmount,
            })
        }
        this.props.accountSubtract({ moneySource: this.state.moneySource, amount: values.amount })
        this.props.hideModal()
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.toolbar}>
                    <View style={styles.toolbarButton}>
                        <DatePicker
                            style={styles.datePicker}
                            date={this.state.date}
                            mode="date"
                            placeholder="date"
                            format="MM/DD YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateInput: {
                                    flex: 1,
                                    height: 50,
                                    borderWidth: 0,
                                    borderColor: '#aaa',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    marginLeft: 15,
                                },
                                dateText: {
                                    color: 'white',
                                },
                                dateTouchBody: {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                },
                            }}
                            showIcon
                            onDateChange={date => this.handleOnDateChange(date)}
                        />
                    </View>
                    <Text style={styles.toolbarTitle}>Add Ledger Entry</Text>
                    <TouchableOpacity style={styles.toolbarButton} onPress={this.props.hideModal}>
                        <Text style={styles.toolbarText}>Cancel</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.fromToContainer}>
                        <Text style={styles.fromToText}>From</Text>
                        <Picker
                            prompt="Money comes from:"
                            selectedValue={this.state.moneySource}
                            style={styles.from}
                            onValueChange={itemValue => this.setState({ moneySource: itemValue })}
                        >
                            <Picker.Item label="Allegent" value="allegent" />
                            <Picker.Item label="Capital One Long-Term" value="capitalOneLongTerm" />
                            <Picker.Item
                                label="Capital One Short-Term"
                                value="capitalOneShortTerm"
                            />
                            <Picker.Item
                                label="Capital One Utilities"
                                value="capitalOneUtilities"
                            />
                            <Picker.Item label="Capital One Gifts" value="capitalOneGifts" />
                            <Picker.Item label="Capital One Extras" value="capitalOneExtras" />
                            <Picker.Item label="Capital One Vacation" value="capitalOneVacation" />
                            <Picker.Item label="Cash" value="cash" />
                            <Picker.Item label="Citizens" value="citizens" />
                            <Picker.Item label="Gift" value="gift" />
                            <Picker.Item label="Library" value="library" />
                            <Picker.Item label="Niche" value="niche" />
                            <Picker.Item label="Sale" value="sale" />
                            <Picker.Item label="Synchrony" value="synchrony" />
                            <Picker.Item label="Other" value="other" />
                        </Picker>
                        <Text style={styles.fromToText}>To</Text>
                        <Picker
                            prompt="Money goes to:"
                            selectedValue={this.state.moneyDestination}
                            style={styles.to}
                            onValueChange={itemValue =>
                                this.setState({ moneyDestination: itemValue })
                            }
                        >
                            <Picker.Item label="Allegent" value="allegent" />
                            <Picker.Item label="Capital One Long-Term" value="capitalOneLongTerm" />
                            <Picker.Item
                                label="Capital One Short-Term"
                                value="capitalOneShortTerm"
                            />
                            <Picker.Item
                                label="Capital One Utilities"
                                value="capitalOneUtilities"
                            />
                            <Picker.Item label="Capital One Gifts" value="capitalOneGifts" />
                            <Picker.Item label="Capital One Extras" value="capitalOneExtras" />
                            <Picker.Item label="Capital One Vacation" value="capitalOneVacation" />
                            <Picker.Item label="Cash" value="cash" />
                            <Picker.Item label="Citizens" value="citizens" />
                            <Picker.Item label="Expense" value="expense" />
                            <Picker.Item label="Synchrony" value="synchrony" />
                            <Picker.Item label="Vanguard" value="vanguard" />
                            <Picker.Item label="Other" value="other" />
                        </Picker>
                    </View>
                    <View style={styles.categoryContainer}>
                        <Text style={styles.fromToText}>Category: </Text>
                        <Picker
                            prompt="Category"
                            style={styles.category}
                            selectedValue={this.state.category}
                            onValueChange={itemValue => this.setState({ category: itemValue })}
                        >
                            {categoriesKeys.map(category => (
                                <Picker.Item
                                    key={category}
                                    label={categories[category].displayName}
                                    value={category}
                                />
                            ))}
                        </Picker>
                    </View>
                    <Formik
                        initialValues={{
                            amount: '',
                            description: '',
                        }}
                        onSubmit={values => {
                            this.addLedgerEntry(values)
                        }}
                        validateOnBlur
                        validationSchema={validationSchema}
                        render={props => (
                            <Form>
                                <FormTextInput
                                    error={props.errors && props.errors.length}
                                    label="Description"
                                    mode="flat"
                                    name="description"
                                    onChangeText={this.handleOnDescriptionChange}
                                    style={styles.descriptionInput}
                                />
                                {props.errors &&
                                    props.errors.description &&
                                    props.touched.description && (
                                        <Text style={styles.errorText}>
                                            {props.errors.description}
                                        </Text>
                                    )}
                                <View style={styles.buttonRow}>
                                    <View style={styles.amountInputContainer}>
                                        <FormTextInput
                                            error={props.errors && props.errors.length}
                                            keyboardType="numeric"
                                            label="Amount"
                                            mode="flat"
                                            name="amount"
                                            placeholder="$"
                                            style={styles.amountInput}
                                            type="amount"
                                        />
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <Button
                                            dark
                                            mode="contained"
                                            onPress={props.handleSubmit}
                                            style={styles.button}
                                        >
                                            Add Entry
                                        </Button>
                                    </View>
                                </View>
                                {props.errors && props.errors.amount && props.touched.amount && (
                                    <Text style={styles.errorText}>{props.errors.amount}</Text>
                                )}
                            </Form>
                        )}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    amountInput: {
        flex: 1,
        marginRight: 10,
    },
    amountInputContainer: {
        alignItems: 'flex-start',
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    amountInputDollarSign: {
        alignSelf: 'flex-end',
        color: '#1976D2',
        fontSize: 20,
        paddingBottom: 5,
        width: 20,
    },
    button: {
        alignSelf: 'stretch',
        borderRadius: 6,
        elevation: 2,
        flex: 1,
        justifyContent: 'center',
        marginTop: 15,
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'stretch',
    },
    buttonRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    category: {
        flex: 1,
        marginVertical: 5,
    },
    categoryContainer: {
        alignItems: 'center',
        borderColor: '#ccc',
        borderRadius: 0,
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingLeft: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    datePicker: {
        width: 100,
        borderWidth: 0,
    },
    descriptionInput: {},
    errorText: {
        color: 'red',
    },
    from: {
        color: 'red',
        flex: 1,
        marginVertical: 0,
    },
    fromToContainer: {
        alignItems: 'center',
        borderColor: '#ccc',
        borderRadius: 0,
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingLeft: 10,
    },
    fromToText: {
        color: '#1976D2',
        padding: 5,
    },
    pickerItem: {
        color: 'red',
    },
    to: {
        color: 'green',
        flex: 1,
        marginVertical: 5,
    },
    toolbar: {
        backgroundColor: 'rgb(126, 89, 191)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingRight: 10,
    },
    toolbarButton: {
        width: 50,
    },
    toolbarText: {
        color: '#fff',
        textAlign: 'center',
    },
    toolbarTitle: {
        flex: 1,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
})

export default AddLedgerEntry

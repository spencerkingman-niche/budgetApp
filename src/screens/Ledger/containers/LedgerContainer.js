import React from 'react'
import { Alert, StyleSheet, View, Modal } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as accountsActions from '../../Accounts/actions/accountsActions'
import * as ledgerActions from '../actions/ledgerActions'
import * as monthActions from '../../Month/actions/monthActions'
import * as ledgerModalVisibilityActions from '../actions/ledgerModalVisibilityActions'
// import { VisibilityFilters } from '../actions/actionTypes'
import { NewEntryButton } from '../components/NewEntryButton'
import { BackupDataButton } from '../components/BackupDataButton'
import EntryList from '../components/EntryList'
import AddLedgerEntry from '../components/AddLedgerEntry'
import { sortByDate } from '../../../utils/sortByDate'

import { store } from '../../../store'

// store.dispatch(
//     ledgerActions.addLedgerEntry(
//         {
//             amount: 13.45,
//             category: 'Uncategorized',
//             date: '09/15',
//             description: 'goo',
//             moneyDestination: 'Cash',
//             moneySource: 'Expense',
//         },
//         true,
//     ),
// )

class LedgerContainer extends React.Component {
    handleCloseModal = () => {
        Alert.alert(
            'Back Button Pressed',
            'Discard changes?',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                {
                    text: 'OK',
                    onPress: () => store.dispatch(ledgerModalVisibilityActions.hideModal()),
                },
            ],
            { cancelable: false },
        )
    }

    render() {
        const { ledgerEntries, filter, dispatch, ledgerModalVisible } = this.props
        return (
            <View style={styles.container}>
                <BackupDataButton ledgerEntries={ledgerEntries} />
                <NewEntryButton {...bindActionCreators(ledgerModalVisibilityActions, dispatch)} />

                <EntryList
                    activeFilter={filter}
                    ledgerEntries={ledgerEntries}
                    {...bindActionCreators(ledgerActions, dispatch)}
                />

                {
                    // <Filters
                    //     activeFilter={filter}
                    //     {...bindActionCreators(visibilityActions, dispatch)}
                    // />
                }

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={ledgerModalVisible}
                    onRequestClose={this.handleCloseModal}
                >
                    <AddLedgerEntry
                        {...bindActionCreators(accountsActions, dispatch)}
                        {...bindActionCreators(ledgerActions, dispatch)}
                        {...bindActionCreators(monthActions, dispatch)}
                        {...bindActionCreators(ledgerModalVisibilityActions, dispatch)}
                        monthCurrent={this.props.monthCurrent}
                    />
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {},
    list: {
        flex: 1,
    },
    add: {
        flex: 1,
    },
})

const mapStateToProps = state => ({
    accounts: state.accounts,
    ledgerEntries: sortByDate(state.ledgerEntries),
    // ledgerEntries: state.ledgerEntries.payload.filter(entry => {
    //     if (state.filter === VisibilityFilters.ALL) {
    //         return true
    //     }
    //     if (state.filter === VisibilityFilters.COMPLETED) {
    //         return entry.completed
    //     }
    //     if (state.filter === VisibilityFilters.INCOMPLETE) {
    //         return !entry.completed
    //     }
    //     return true
    // }),
    filter: state.filter,
    ledgerModalVisible: state.ledgerModal.visible,
    monthCurrent: state.month.monthCurrent,
})

export default connect(
    mapStateToProps,
    null,
)(LedgerContainer)

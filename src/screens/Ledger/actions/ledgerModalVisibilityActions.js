import * as actions from './actionTypes'

export function showModal() {
    return {
        type: actions.SET_LEDGER_MODAL_VISIBILITY,
        visible: true,
    }
}

export function hideModal() {
    return {
        type: actions.SET_LEDGER_MODAL_VISIBILITY,
        visible: false,
    }
}

export const SET_USER = 'SET_USER'
export const SET_LOADING = 'SET_LOADING'

const INITIAL_STATE = {
	loggedInUser: null,
	isLoading: false,
}

export function userReducer(state = INITIAL_STATE, action = {}) {
	switch (action.type) {
		case SET_USER:
			return {
				...state,
				loggedInUser: action.loggedInUser,
			}
		case SET_LOADING:
			return {
				...state,
				isLoading: action.isLoading,
			}
		default:
			return state
	}
}

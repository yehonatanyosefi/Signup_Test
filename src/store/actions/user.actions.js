import { userService } from '../../services/user.service'
import { SET_USER, SET_LOADING } from '../reducers/user.reducer'

const setLoading = { type: SET_LOADING, isLoading: true }
const setFinishedLoading = { type: SET_LOADING, isLoading: false }

export function doSignup(credentials) {
	return async (dispatch, getState) => {
		try {
			dispatch(setLoading)
			const user = await userService.signup(credentials)
			dispatch(setFinishedLoading)
			const action = {
				type: SET_USER,
				user,
			}
			dispatch(action)
		} catch (error) {
			console.error('error:', error)
			throw error
		}
	}
}

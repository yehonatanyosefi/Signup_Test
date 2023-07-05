import { httpService } from './http.service'
export const userService = {
	signup,
}

const API_KEY = 'auth/'

async function signup(credentials) {
	try {
		const preparedCredentials = _prepareCredentials(credentials)
		await httpService.post(API_KEY + 'signup', preparedCredentials)
	} catch (err) {
		throw err
	}
}

function _prepareCredentials(credentials) {
	const { username, password, firstName, lastName, emailAddress } = credentials
	const attributes = [
		{
			Name: 'email',
			Value: emailAddress,
		},
		{
			Name: 'given_name',
			Value: firstName,
		},
		{
			Name: 'family_name',
			Value: lastName,
		},
	]
	const preparedCredentials = {
		Username: username,
		Password: password,
		UserAttributes: attributes,
	}
	return preparedCredentials
}

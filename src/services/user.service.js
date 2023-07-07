import { httpService } from './http.service'
export const userService = {
	signup,
}

const API_KEY = 'auth/'

async function signup(unpreparedCredentials) {
	try {
		const preparedCredentials = _prepareCredentials(unpreparedCredentials)
		await httpService.post(API_KEY + 'signup', { credentials: preparedCredentials })
	} catch (err) {
		throw err
	}
}

function _prepareCredentials(credentials) {
	const { password, firstName, lastName, emailAddress } = credentials
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
		Username: emailAddress,
		Password: password,
		UserAttributes: attributes,
	}
	return preparedCredentials
}

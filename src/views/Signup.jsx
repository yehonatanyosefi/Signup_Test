import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { doSignup } from '../store/actions/user.actions'
import { useNavigate } from 'react-router-dom'
import { useCallbackState } from '../customHooks/useCallbackState'
import { SUCCESS } from '../services/routes.service'

import MainWrapper from '../cmps/MainWrapper'
import SignupForm from '../cmps/SignupForm'
import SignupWithSocial from '../cmps/SignupWithSocial'

import jwtDecode from 'jwt-decode'

// Regular expression to validate email addresses
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LOWERCASE_REGEX = /[a-z]/
const UPPERCASE_REGEX = /[A-Z]/
const SPECIAL_CHARACTER_REGEX = /[!@#$%^&*]/

function SignupSelector(props) {
	const [isManualSignup, setIsManualSignup] = useState(false)
	if (!isManualSignup) return <SignupWithSocial setIsManualSignup={setIsManualSignup} {...props} />
	return <SignupForm {...props} />
}

export default function Signup() {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const isLoading = useSelector((state) => state.userModule.isLoading)

	useEffect(() => {
		document.title = 'Eramorph - Signup'
	}, [])

	// Initial values for the user's registration information
	const blankFields = {
		firstName: '',
		lastName: '',
		emailAddress: '',
		password: '',
		confirmPassword: '',
	}
	const [isFloating, setIsFloating] = useState(true)
	// State for user's registration information
	const [credentials, setCredentials] = useCallbackState({ ...blankFields })
	// State for errors in the registration form
	const [errors, setErrors] = useState({ ...blankFields })
	// State for input fields and their meta information
	const [inputFields, setInputFields] = useState([
		{ type: 'text', placeholder: 'First Name', name: 'firstName', hasBeenChecked: false },
		{ type: 'text', placeholder: 'Last Name', name: 'lastName', hasBeenChecked: false },
		{ type: 'email', placeholder: 'Email Address', name: 'emailAddress', hasBeenChecked: false },
		{
			type: 'password',
			placeholder: 'Password',
			name: 'password',
			isVisible: false,
			hasBeenChecked: false,
		},
		{
			type: 'password',
			placeholder: 'Confirm Password',
			name: 'confirmPassword',
			isVisible: false,
			hasBeenChecked: false,
		},
	])
	// Helper variables to determine state of form
	const credentialsValues = Object.values(credentials)
	const areSomeFieldsEmpty = credentialsValues.some((field) => field === '')
	const errorsArr = Object.values(errors)
	const areThereErrors = errorsArr.some((field) => field !== '')

	// Function to check if a specific field in the form has an error
	function checkError(field, credentials) {
		const passwordQualifier =
			credentials.password.length < 6 ||
			!LOWERCASE_REGEX.test(credentials.password) ||
			!UPPERCASE_REGEX.test(credentials.password) ||
			!SPECIAL_CHARACTER_REGEX.test(credentials.password)
		const passwordErrorMsg =
			credentials.password.length < 6
				? 'Password needs to be 6 letters or longer.'
				: !LOWERCASE_REGEX.test(credentials.password)
				? 'Password needs to contain at least one lowercase letter.'
				: !UPPERCASE_REGEX.test(credentials.password)
				? 'Password needs to contain at least one uppercase letter.'
				: !SPECIAL_CHARACTER_REGEX.test(credentials.password)
				? 'Password needs to contain at least one special character.'
				: ''
		const validation = {
			firstName: {
				qualifier: credentials.firstName.length < 2,
				errorMsg: 'First name must be at least 2 characters.',
			},
			lastName: {
				qualifier: credentials.lastName.length < 2,
				errorMsg: 'Last name must be at least 2 characters.',
			},
			emailAddress: {
				qualifier: !EMAIL_REGEX.test(credentials.emailAddress),
				errorMsg: 'Please enter a valid email address.',
			},
			password: {
				qualifier: passwordQualifier,
				errorMsg: passwordErrorMsg,
			},
			confirmPassword: {
				qualifier: passwordQualifier || credentials.password !== credentials.confirmPassword,
				errorMsg: passwordErrorMsg || 'Passwords do not match.',
			},
		}

		// If there is a validation error, set the corresponding field in the errors state
		// Else, clear the corresponding field in the errors state
		setInputFields((prevInputFields) =>
			prevInputFields.map((inputField) => {
				if (inputField.name === field) {
					return { ...inputField, hasBeenChecked: true }
				}
				return inputField
			})
		)

		if (field === '') {
			setErrors((prevErrors) => ({ ...prevErrors, [field]: 'Please fill out this fields.' }))
			return true
		}

		if (validation[field].qualifier) {
			setErrors((prevErrors) => ({
				...prevErrors,
				[field]: validation[field].errorMsg,
			}))
			return true
		}

		setErrors((prevErrors) => ({
			...prevErrors,
			[field]: '',
		}))
		return false
	}

	// Function to determine if the form is valid
	function isValid() {
		setErrors(JSON.parse(JSON.stringify(blankFields)))
		if (areSomeFieldsEmpty) {
			setErrors((prevErrors) => ({ ...prevErrors, general: 'Please fill out all fields.' }))
			return false
		}

		const credentialsKeys = Object.keys(credentials)
		const isAnyInputInvalid = credentialsKeys.some((credential) => checkError(credential, credentials))
		if (isAnyInputInvalid) {
			return false
		}
		const hasSpaces = credentialsValues.find((field) => field.includes(' '))
		if (hasSpaces) {
			setErrors((prevErrors) => ({ ...prevErrors, general: 'Please remove spaces.' }))
			return false
		}
		return true
	}

	// Event handlers for input fields
	const handleChange = (ev) => {
		const { name, value } = ev.target
		setCredentials(
			(prevCredentials) => ({ ...prevCredentials, [name]: value }),
			(newCredentials) => checkError(name, newCredentials)
		)
	}

	const handleFocus = (ev) => {
		const { name } = ev.target
		checkError(name, credentials)
	}

	const handleBlur = (ev) => {
		const { name } = ev.target
		checkError(name, credentials)
	}

	const signupUser = useCallback(
		async (signupCredentials) => {
			try {
				dispatch(doSignup(signupCredentials))
				setErrors('')
				navigate(SUCCESS)
			} catch (err) {
				//TODO: ask vita if to show error message or move to another page
				console.log('Error in signup: ', err)
				// navigate(ERROR)
				setErrors('Error in signup request. Please try again.')
				throw err
			}
		},
		[dispatch, navigate]
	)

	// Event handler for the signup form
	const handleSignup = async (ev) => {
		ev.preventDefault()
		if (!isValid()) return
		const signupCredentials = credentials
		signupUser(signupCredentials)
	}

	// Function that toggles the visibility of the password inputs
	const togglePassVisibility = (name) => {
		setInputFields(
			inputFields.map((inputField) => {
				if (inputField.name === name) {
					return { ...inputField, isVisible: !inputField.isVisible }
				}
				return inputField
			})
		)
	}
	const handleFloatToggle = (ev) => {
		setIsFloating(!isFloating)
	}

	const handleGoogleAuthCallback = useCallback(
		(response) => {
			const credentials = jwtDecode(response.credential)
			// Google user object:
			// email: 'yehonatanmind@gmail.com'
			// family_name: 'Yosefi'
			// given_name: 'Yehonatan'
			// aud: '8715'
			// azp: '8715'
			// email_verified: true
			// exp: 16862
			// iat: 16562
			// iss: 'https://accounts.google.com'
			// jti: '4a470'
			// name: 'Yehonatan Yosefi'
			// nbf: 16862
			// picture: 'https://lhEZs=s96-c'
			// sub: '1011116746'

			// const user = userService.prepareData(userObject)
			signupUser(credentials)
		},
		[signupUser]
	)
	const handleFacebookSignup = useCallback(
		(response) => {
			if (!response.accessToken) return setErrors('Error in signup request. Please try again.')
			const credentials = response
			// {
			//     status: 'connected',
			//     authResponse: {
			//         accessToken: '...',
			//         expiresIn:'...',
			//         signedRequest:'...',
			//         userID:'...'
			//     }
			// }
			console.log(`credentials:`, credentials)
			signupUser(credentials)
		},
		[signupUser]
	)

	useEffect(() => {
		const script = document.createElement('script')
		script.src = `https://accounts.google.com/gsi/client`
		script.async = true

		script.onload = () => {
			// set state to update component after the script is loaded
			const googleAuth = window.google
			googleAuth.accounts.id.initialize({
				client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
				callback: handleGoogleAuthCallback,
			})

			googleAuth.accounts.id.renderButton(document.getElementById('google-signIn-div'), {
				theme: 'outline',
				size: 'large',
			})
		}

		document.body.appendChild(script)

		// Cleanup function to remove the script if the component unmounts
		return () => {
			document.body.removeChild(script)
		}
	}, [handleGoogleAuthCallback])

	if (isLoading)
		return (
			<MainWrapper>
				<div className="signup">Loading...</div>
			</MainWrapper>
		)

	return (
		<MainWrapper>
			<div className="signup">
				<SignupSelector
					credentials={credentials}
					errors={errors}
					inputFields={inputFields}
					handleChange={handleChange}
					handleFocus={handleFocus}
					handleBlur={handleBlur}
					handleSignup={handleSignup}
					togglePassVisibility={togglePassVisibility}
					isFloating={isFloating}
					handleFloatToggle={handleFloatToggle}
					areThereErrors={areThereErrors}
					areSomeFieldsEmpty={areSomeFieldsEmpty}
					handleFacebookSignup={handleFacebookSignup}
				/>
			</div>
		</MainWrapper>
	)
}

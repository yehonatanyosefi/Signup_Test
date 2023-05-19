import { useEffect, useState } from 'react'
// import { doesEmailAddressExist, signup } from '../services/user.service'
import { Link, useNavigate } from 'react-router-dom'
import { SvgIcon } from '../cmps/util/SvgIcon'
import { useCallbackState } from '../customHooks/useCallbackState'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
export default function Signup() {
	const navigate = useNavigate()

	useEffect(() => {
		document.title = 'Eramorph - Signup'
	}, [])

	// Regular expression to validate email addresses
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	// Initial values for the user's registration information
	const blankFields = {
		firstName: '',
		lastName: '',
		emailAddress: '',
		password: '',
		confirmPassword: '',
	}
	// State for user's registration information
	const [credentials, setCredentials] = useCallbackState(JSON.parse(JSON.stringify(blankFields)))
	// State for errors in the registration form
	const [errors, setErrors] = useState(JSON.parse(JSON.stringify(blankFields)))
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

	// TODO: ... Google login code here: 
	// const [profile, setProfile] = useState([])
	// const login = useGoogleLogin({
	// 	onSuccess: (codeResponse) => setUser(codeResponse),
	// 	onError: (error) => console.log('Login Failed:', error),
	// })

	// useEffect(() => {
	// 	if (user) {
	// 		axios
	// 			.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
	// 				headers: {
	// 					Authorization: `Bearer ${user.access_token}`,
	// 					Accept: 'application/json',
	// 				},
	// 			})
	// 			.then((res) => {
	// 				setProfile(res.data)
	// 			})
	// 			.catch((err) => console.log(err))
	// 	}
	// }, [user])

	// const logOut = () => {
	// 	googleLogout()
	// 	setProfile(null)
	// }
	// const login = useGoogleLogin({
	// 	onSuccess: async (codeResponse) => {
	// 		if (codeResponse && codeResponse.access_token) {
	// 			// setUser({ ...codeResponse, access_token: codeResponse.access_token })
	// 			// Fetch user profile data
	// 			axios
	// 				.get(
	// 					`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
	// 					{
	// 						headers: {
	// 							Authorization: `Bearer ${codeResponse.access_token}`,
	// 							Accept: 'application/json',
	// 						},
	// 					}
	// 				)
	// 				.then(async (res) => {
	// 					if (res.data) {
	// 						// setProfile(res.data)
	// 						// setFullname(res.data.name)
	// 						// await signupUser(res.data.name)
	// 					}
	// 					console.log('Profile data:', res.data)
	// 				})
	// 				.catch((err) => console.log(err))
	// 		} else {
	// 			console.error('Login Failed: codeResponse or accessToken is undefined')
	// 		}
	// 	},
	// 	onError: (error) => console.error('Login Failed:', error),
	// })

	// Function to check if a specific field in the form has an error
	function checkError(field, credentials) {
		const passwordQualifier =
			credentials.password.length < 6 ||
			!/[a-z]/.test(credentials.password) ||
			!/[A-Z]/.test(credentials.password) ||
			!/[!@#$%^&*]/.test(credentials.password)
		const passwordErrorMsg =
			credentials.password.length < 6
				? 'Password needs to be 6 letters or longer.'
				: !/[a-z]/.test(credentials.password)
				? 'Password needs to contain at least one lowercase letter.'
				: !/[A-Z]/.test(credentials.password)
				? 'Password needs to contain at least one uppercase letter.'
				: !/[!@#$%^&*]/.test(credentials.password)
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
				qualifier: !emailRegex.test(credentials.emailAddress),
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
		try {
			// const doesEmailAddressExist = await doesEmailAddressExist(username)
			// if (doesEmailAddressExist) {
			// 	setErrors((prevErrors)=>({...prevErrors,general:'That email address is already taken, please try another.'})
			// 	return false
			// }
		} catch (err) {
			setErrors((prevErrors) => ({
				...prevErrors,
				general: 'Error in signup request. Please try again.',
			}))
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

	// Event handler for the signup form
	const handleSignup = async (ev) => {
		ev.preventDefault()
		if (!isValid()) return
		try {
			// await signUp(credentials)
			navigate('/')
			setErrors('')
		} catch (err) {
			console.error('Error in signup: ', err)
			setErrors('Error in signup request. Please try again.')
		}
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

	return (
		<div className="signup">
			<SvgIcon iconName={'bg-mobile-rounded-svg'} className="bg-mobile-rounded-svg" />
			<div className="lines first-line"></div>
			<div className="lines second-line"></div>
			<div className="header">
				<Link to={'/'}>
					<SvgIcon iconName="logo" className="logo" alt="Eramorph logo" />
				</Link>
				<h1 className="signup-header">Eramorph</h1>
				<h5 className="sub-header">Evolve. Constantly.</h5>
			</div>
			<form onSubmit={handleSignup} method="POST">
				{inputFields.map((inputField, idx) => {
					let { type, placeholder, name, hasBeenChecked } = inputField
					let errorClass = ''
					if (hasBeenChecked) {
						if (errors[name]) errorClass = 'error'
						else if (!errors[name]) errorClass = 'success'
					}
					if (type === 'password' && inputField.isVisible) {
						type = 'text'
					}
					return (
						<div key={idx} className={`input-wrapper`}>
							<label htmlFor={name} hidden>
								{placeholder}
							</label>
							<input
								id={name}
								className={errorClass}
								type={type}
								placeholder={placeholder}
								aria-label={`Enter your ${placeholder}`}
								name={name}
								value={credentials[name]}
								onChange={(ev) => handleChange(ev)}
								onFocus={(ev) => handleFocus(ev)}
								onBlur={(ev) => handleBlur(ev)}
								aria-required="true"
								aria-invalid={!!errors[name]}
							/>
							{hasBeenChecked && (
								<SvgIcon
									iconName={errorClass}
									className={`error ${errorClass === 'error' ? '' : 'hide-icon'}`}
								/>
							)}
							{hasBeenChecked && (
								<SvgIcon
									iconName={errorClass}
									className={`success ${errorClass === 'success' ? '' : 'hide-icon'}`}
								/>
							)}
							{errors[name] && (
								<div className="error-msg" role="alert">
									{errors[name]}
								</div>
							)}
							{(type === 'password' || inputField?.isVisible) && (
								<SvgIcon
									iconName="eye"
									className={`toggle-eye ${inputField.isVisible ? '' : 'hide-icon'}`}
									onClick={() => togglePassVisibility(name)}
								/>
							)}
							{(type === 'password' || inputField?.isVisible) && (
								<SvgIcon
									iconName="eye-off"
									className={`eye-off toggle-eye ${inputField.isVisible ? 'hide-icon' : ''}`}
									onClick={() => togglePassVisibility(name)}
								/>
							)}
						</div>
					)
				})}
				<button
					type="submit"
					disabled={areThereErrors || areSomeFieldsEmpty}
					className={`submit-btn ${areThereErrors || areSomeFieldsEmpty ? 'disabled' : ''}`}>
					Sign up and start evolving
				</button>
				{errors.general && <p className="error-msg">{errors.general}</p>}
			</form>
		</div>
	)
}

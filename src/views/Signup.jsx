import { useEffect, useState } from 'react'
// import { doesEmailAddressExist, signup } from '../services/user.service'
// import { Link } from 'react-router-dom'
import { SvgIcon } from '../cmps/util/SvgIcon'
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//TODO update react router version
export default function Signup() {
	// const navigate = useNavigate()

	useEffect(() => {
		document.title = 'Eramorph - Signup'
	}, [])

	const blankFields = {
		firstName: '',
		lastName: '',
		emailAddress: '',
		password: '',
		confirmPassword: '',
	}
	const [credentials, setCredentials] = useState(JSON.parse(JSON.stringify(blankFields)))
	const [errors, setErrors] = useState(JSON.parse(JSON.stringify(blankFields)))
	const [successMsg, setSuccessMsg] = useState('') //TODO delete success msg - debug only
	//TODO add more password requirements
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
			qualifier: credentials.password.length < 6,
			errorMsg: 'Password needs to be 6 letters or longer.',
		},
		confirmPassword: {
			qualifier: credentials.password !== credentials.confirmPassword,
			errorMsg: 'Passwords do not match.',
		},
	}
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

	function areAllValuesBlank(obj) {
		for (let value of Object.values(obj)) {
			if (value !== null && value !== '') {
				return false
			}
		}
		return true
	}

	function checkError(field, validation) {
		if (!inputFields.find((inputField) => inputField.name === field).hasBeenChecked) {
			setInputFields((prevInputFields) =>
				prevInputFields.map((inputField) => {
					if (inputField.name === field) {
						return { ...inputField, hasBeenChecked: true }
					}
					return inputField
				})
			)
		}

		if (field === '') {
			setErrors((prevErrors) => ({ ...prevErrors, [field]: 'Please fill out all fields.' }))
			return true
		}

		if (validation.qualifier) {
			setErrors((prevErrors) => ({
				...prevErrors,
				[field]: validation.errorMsg,
			}))
			return true
		}

		setErrors((prevErrors) => ({
			...prevErrors,
			[field]: '',
		}))
		return false
	}

	function isValid() {
		setErrors(JSON.parse(JSON.stringify(blankFields)))
		const credentialsArr = Object.values(credentials)
		const areFieldsEmpty = credentialsArr.some((field) => field === '')
		if (areFieldsEmpty) {
			setErrors((prevErrors) => ({ ...prevErrors, general: 'Please fill out all fields.' }))
			return false
		}
		const isAnyInputInvalid = credentialsArr.some((credential) =>
			checkError(credential, validation[credential])
		)
		if (isAnyInputInvalid) {
			return false
		}
		const hasSpaces = credentialsArr.find((field) => field.includes(' '))
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

	const handleChange = (ev) => {
		const { name, value } = ev.target
		setCredentials((prevCredentials) => ({ ...prevCredentials, [name]: value }))
	}

	const handleBlur = (ev) => {
		const { name } = ev.target
		checkError(name, validation[name])
	}

	const handleSignup = async (ev) => {
		ev.preventDefault()
		setSuccessMsg('')
		if (!isValid()) return
		try {
			// signUp(credentials)
			// navigate('/')
			setSuccessMsg('Account created successfully.')
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

	//TODO: add link to home if possible to use app without sign in
	return (
		<div className="signup">
			{/* <Link to={'/'}> */}
			<div className="header">
				<SvgIcon iconName="logo" title="Eramorph Logo" className="logo" />
				<h1 className="signup-header">Eramorph</h1>
				<h2>Evolve Constantly</h2>
			</div>
			{/* </Link> */}
			<form onSubmit={handleSignup} method="POST">
				{inputFields.map((inputField, idx) => {
					let { type, placeholder, name, hasBeenChecked } = inputField
					let errorClass = ''
					if (hasBeenChecked && errors[name]) errorClass = 'error'
					else if (hasBeenChecked && !errors[name]) errorClass = 'success'
					if (type === 'password' && inputField.isVisible) {
						type = 'text'
					}
					return (
						<div key={idx} className={`input-wrapper`}>
							<input
								className={errorClass}
								type={type}
								placeholder={placeholder}
								aria-label={`Enter your ${placeholder}`}
								name={name}
								value={credentials[name]}
								onChange={(ev) => handleChange(ev)}
								onBlur={(ev) => handleBlur(ev)}
							/>
							{hasBeenChecked && <SvgIcon iconName={errorClass} />}
							{errors[name] && <div className="error-msg">{errors[name]}</div>}
							{(type === 'password' || inputField?.isVisible) && (
								<SvgIcon
									iconName={!inputField.isVisible ? 'eye' : 'eye-off'}
									className="toggle-password"
									onClick={() => togglePassVisibility(name)}
								/>
							)}
						</div>
					)
				})}
				<button
					type="submit"
					disabled={!areAllValuesBlank(errors) || areAllValuesBlank(credentials)}
					className={`submit-btn ${
						!areAllValuesBlank(errors) || areAllValuesBlank(credentials) ? 'disabled' : ''
					}`}>
					Sign up and start evolving
				</button>
				{errors.general && <p className="error-msg">{errors.general}</p>}
				{successMsg && <p className="success-msg">{successMsg}</p>}
			</form>
		</div>
	)
}

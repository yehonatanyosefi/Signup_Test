import { useEffect, useState } from 'react'
// import { doesEmailAddressExist, signup } from '../services/user.service'
import { Link } from 'react-router-dom'
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//TODO update react router version
export default function Signup() {
	// const navigate = useNavigate()

	const [credentials, setCredentials] = useState({
		firstName: '',
		lastName: '',
		emailAddress: '',
		password: '',
		confirmPassword: '',
	})
	const [error, setError] = useState('')
	const [successMsg, setSuccessMsg] = useState('') //TODO delete success msg - debug only

	function checkErrors() {
		const { emailAddress, password, confirmPassword } = credentials
		const areFieldsEmpty = Object.values(credentials).some((field) => field === '')
		if (areFieldsEmpty) {
			setError('Please fill out all fields.')
			return true
		}
		if (!emailRegex.test(emailAddress)) {
			setError('Please enter a valid email address.')
			return true
		}
          if (password !== confirmPassword) {
			setError('Passwords do not match.')
               return true
          }
		if (password.length < 6) { //TODO add more password requirements
			setError('Password must be at least 6 characters.')
			return true
		}
		if (Object.values(credentials).some(credential=>credential.includes(' '))) {
			setError('Please remove spaces.')
			return true
		}
		try {
			// const doesEmailAddressExist = await doesEmailAddressExist(username)
			// if (doesEmailAddressExist) {
			// 	setError('That email address is already taken, please try another.')
			// 	return true
			// }
		} catch (err) {
			setError('Error in signup request. Please try again.')
			return
		}
		return false
	}

	const handleSignup = async (ev) => {
		ev.preventDefault()
		setSuccessMsg('')
		if (checkErrors()) return
		try {
			// signUp(credentials)
			// navigate('/')
			setSuccessMsg('Account created successfully.')
			setError('')
		} catch (err) {
			console.error('Error in signup: ', err)
			setError('Error in signup request. Please try again.')
		}
	}

	useEffect(() => {
		document.title = 'Eramorph - Signup'
	}, [])

	const [inputFields, setInputFields] = useState([
		{ type: 'text', placeholder: 'First Name', value: 'firstName' },
		{ type: 'text', placeholder: 'Last Name', value: 'lastName' },
		{ type: 'email', placeholder: 'Email Address', value: 'emailAddress' },
		{ type: 'password', placeholder: 'Password', value: 'password', isVisible: false },
		{ type: 'password', placeholder: 'Confirm Password', value: 'confirmPassword', isVisible: false },
	])

	const toggleVisibility = (value) => {
		setInputFields(inputFields.map(inputField => {
			if (inputField.value === value) {
				return { ...inputField, isVisible: !inputField.isVisible }
			}
			return inputField
		}))
	}

	//TODO add link to home if possible to use app without sign in
	//TODO add link to login
	//TODO add password requirements to ui
	//TODO ask where to put errors and containerize them so they won't push down form
	return (
		<div className="signup">
			{/* <Link to={'/'}> */}
				<h1 className="">
					<img src="../assets/imgs/logo.png" alt="Eramorph Logo" className="" />
				</h1>
			{/* </Link> */}
			<form onSubmit={handleSignup} method="POST">
				{error && <p className="error">{error}</p>}
				{inputFields.map((inputField, idx) => {
					let { type, placeholder, value } = inputField
					if (type === 'password' && inputField.isVisible) {
						type = 'text'
					}
					return (
						<div key={idx} className="input-wrapper">
							<input
								type={type}
								placeholder={placeholder}
								aria-label={`Enter your ${placeholder}`}
								onChange={({ target }) => setCredentials({ ...credentials, [value]: target.value.trim() })}
								value={credentials[value]}
							/>
							{ (type === 'password' || inputField?.isVisible) && <i className='toggle-password' onClick={()=>toggleVisibility(value)}>E</i>}
						</div>
					)
				})}
				<button type='submit'>Sign up and start evolving</button>
				{successMsg && <p className="success">{successMsg}</p>}
			</form> 
			{/* <p className="text-sm">
                    Already have an account?{` `}
                    <Link to={LOGIN} className="text-blue-medium font-bold">
                         Login
                    </Link>
			</p> */}
		</div>
	)
}

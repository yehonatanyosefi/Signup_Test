import InputList from './signup/InputList'

export default function SignupForm(props) {
	const { areThereErrors, areSomeFieldsEmpty, errors, handleSignup } = props
	return (
		<form onSubmit={handleSignup} method="POST">
			<InputList {...props} />
			<button
				type="submit"
				disabled={areThereErrors || areSomeFieldsEmpty}
				className={`submit-btn ${areThereErrors || areSomeFieldsEmpty ? 'disabled' : ''}`}>
				Sign up and start evolving
			</button>
			{errors.general && <p className="error-msg">{errors.general}</p>}
		</form>
	)
}

import Logo from './Logo'
import InputList from './signup/InputList'

export default function SignupForm(props) {
	return (
		<>
			<Logo />
			<label htmlFor="float">
				Toggle Float
				<input
					name="float"
					id="float"
					type="checkbox"
					checked={props.isFloating}
					onChange={props.handleFloatToggle}
				/>
			</label>
			<form onSubmit={props.handleSignup} method="POST">
				<InputList {...props} />
				<button
					type="submit"
					disabled={props.areThereErrors || props.areSomeFieldsEmpty}
					className={`submit-btn ${props.areThereErrors || props.areSomeFieldsEmpty ? 'disabled' : ''}`}>
					Sign up and start evolving
				</button>
				{props.errors.general && <p className="error-msg">{props.errors.general}</p>}
			</form>
		</>
	)
}

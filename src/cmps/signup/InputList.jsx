import SignupInput from './SignupInput'

export default function InputList(props) {
	return props.inputFields.map((inputField) => (
		<SignupInput
			key={inputField.name}
			inputField={inputField}
			credentials={props.credentials}
			errors={props.errors}
			isFloating={props.isFloating}
			handleChange={props.handleChange}
			handleFocus={props.handleFocus}
			handleBlur={props.handleBlur}
			togglePassVisibility={props.togglePassVisibility}
		/>
	))
}

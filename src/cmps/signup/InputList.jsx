import SignupInput from './SignupInput'

export default function InputList({
	inputFields,
	errors,
	credentials,
	isFloating,
	handleChange,
	handleFocus,
	handleBlur,
	togglePassVisibility,
}) {
	return inputFields.map((inputField) => (
		<SignupInput
			key={inputField.name}
			inputField={inputField}
			credentials={credentials}
			errors={errors}
			isFloating={isFloating}
			handleChange={handleChange}
			handleFocus={handleFocus}
			handleBlur={handleBlur}
			togglePassVisibility={togglePassVisibility}
		/>
	))
}

import SignupInput from './signup/SignupInput'

export default function SignupWithSocial({
	setIsManualSignup,
	inputFields,
	credentials,
	errors,
	isFloating,
	handleChange,
	handleFocus,
	handleBlur,
	togglePassVisibility,
	handleFacebookSignup,
}) {
	return (
		<section className="social-signup">
			<h1>Create Your Account</h1>
			<p>
				Please note that phone verification is required for signup. Your number will be only used to
				verify your identity for security purposes
			</p>
			<SignupInput
				inputField={inputFields[0]}
				credentials={credentials}
				errors={errors}
				isFloating={isFloating}
				handleChange={handleChange}
				handleFocus={handleFocus}
				handleBlur={handleBlur}
				togglePassVisibility={togglePassVisibility}
			/>
			<button onClick={() => setIsManualSignup(true)} className="submit-btn">
				Continue
			</button>
			<p>OR</p>
			<div id="google-signIn-div" className="google-signup"></div>
			<button className="facebook-btn img-btn" onClick={handleFacebookSignup}>
				<img
					className="facebook-img"
					src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
					alt="facebook"
				/>
				Continue with Facebook
			</button>
		</section>
	)
}

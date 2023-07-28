import SignupInput from './signup/SignupInput'

// import { LoginSocialFacebook } from 'reactjs-social-login'
// import { FacebookLoginButton } from 'react-social-login-buttons'

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
	// handleFacebookSignup,
}) {
	// function handleReject(err) {
	// 	console.log(err)
	// }

	function handleSubmit(ev) {
		ev.preventDefault()
		setIsManualSignup(true)
	}

	return (
		<section className="social-signup">
			<h1 className="title">Create Your Account</h1>
			<form onSubmit={handleSubmit}>
				<SignupInput
					inputField={inputFields[2]}
					credentials={credentials}
					errors={errors}
					isFloating={isFloating}
					handleChange={handleChange}
					handleFocus={handleFocus}
					handleBlur={handleBlur}
					togglePassVisibility={togglePassVisibility}
				/>
				<button className="submit-btn">Continue</button>
				{errors.general && <p className="error-msg">{errors.general}</p>}
			</form>
			<div className="or">OR</div>
			<div id="google-signIn-div" className="signup-div"></div>
			{/* <div className="signup-div">
				<LoginSocialFacebook
					appId={process.env.REACT_APP_FACEBOOK_APP_ID}
					onResolve={handleFacebookSignup}
					onReject={handleReject}>
					<FacebookLoginButton className="facebook-button"></FacebookLoginButton>
				</LoginSocialFacebook>
			</div> */}
		</section>
	)
}

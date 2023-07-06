import SignupInput from './signup/SignupInput'

import { LoginSocialFacebook } from 'reactjs-social-login'
import { FacebookLoginButton } from 'react-social-login-buttons'

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
	function handleReject(err) {
		console.log(err)
	}

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
			{errors.general && <p className="error-msg">{errors.general}</p>}
			<p>OR</p>
			<div id="google-signIn-div" className="signup-div"></div>
			<div className="signup-div">
				<LoginSocialFacebook
					appId={process.env.REACT_APP_FACEBOOK_APP_ID}
					onResolve={handleFacebookSignup}
					onReject={handleReject}>
					<FacebookLoginButton className="facebook-button"></FacebookLoginButton>
				</LoginSocialFacebook>
				{/* <FacebookLogin
					appId={process.env.REACT_APP_FACEBOOK_APP_ID}
					autoLoad={true}
					fields="name,email,picture"
					scope="public_profile,user_friends"
					callback={handleFacebookSignup}
					icon="fa-facebook"
				/> */}
			</div>
		</section>
	)
}

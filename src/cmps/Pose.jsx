// Importing necessary hooks from React and machine learning model ml5
import { useState, useMemo, useRef, useEffect } from 'react'
// import * as ml5 from 'ml5'
import Sketch from 'react-p5'

// Define base URL for images and poses data
const PUBLIC_URL = process.env.PUBLIC_URL
const poses = [
	{ pose: 'Mountain', imgSrc: `${PUBLIC_URL}/imgs/mountain.svg` },
	{ pose: 'Tree', imgSrc: `${PUBLIC_URL}/imgs/tree.svg` },
	{ pose: 'Downward Dog', imgSrc: `${PUBLIC_URL}/imgs/dog.svg` },
	{ pose: 'Warrior I', imgSrc: `${PUBLIC_URL}/imgs/warrior1.svg` },
	{ pose: 'Warrior II', imgSrc: `${PUBLIC_URL}/imgs/warrior2.svg` },
	{ pose: 'Chair', imgSrc: `${PUBLIC_URL}/imgs/chair.svg` },
]

// Define constants for poses interval and duration
const POSES_INTERVAL = 100
const POSES_TIME = 10 * 1000
const TOTAL_POSES_CHECKS = POSES_TIME / POSES_INTERVAL

const Pose = () => {
	// Mounting ml5 minified
	useEffect(() => {
		const script = document.createElement('script')
		script.src = `${PUBLIC_URL}/lib/ml5.min.js`
		script.async = true

		script.onload = () => {
			// set state to update component after the script is loaded
			setIsMl5Loaded(true)
		}

		document.body.appendChild(script)

		// Cleanup function to remove the script if the component unmounts
		return () => {
			document.body.removeChild(script)
		}
	}, [])

	// Declare state variables for the component
	const [isMl5Loaded, setIsMl5Loaded] = useState(false)
	const [pose, setPose] = useState(null)
	const [skeleton, setSkeleton] = useState(null)
	const [video, setVideo] = useState(null)
	const [posesToDo, setPosesToDo] = useState([])
	const [posesTime, setPosesTime] = useState(POSES_TIME)
	const [currMessage, setCurrMessage] = useState('')
	const [isModelLoaded, setIsYogaLoaded] = useState(false)
	const [isPoseNetLoaded, setIsPoseNetLoaded] = useState(false)
	const [currPose, setCurrPose] = useState('')
	const [gamePhase, setGamePhase] = useState('loading')
	const [timerId, setTimerId] = useState(null)

	// useRef hooks to store mutable values that survive re-renders
	const posesArray = useRef([])
	const isGameOn = useRef(false)
	const brainRef = useRef(null)

	// useMemo hooks to optimize performance by memoizing complex computations
	const disabledBtn = useMemo(
		() => !isPoseNetLoaded || !isModelLoaded || gamePhase === 'Ended',
		[isPoseNetLoaded, isModelLoaded, gamePhase]
	)
	const btnTxt = useMemo(() => {
		if (!isPoseNetLoaded || !isModelLoaded) return 'Loading...'
		if (gamePhase === 'teaching') return 'Start Teaching'
		return 'Start Game'
		// Conditionals for button text based on model loading status and game phase
	}, [isPoseNetLoaded, isModelLoaded, gamePhase])

	// Handles the setup of the poses
	const handlePosesSetup = () => {
		setPosesToDo(posesArray.current)
		posesArray.current = []
		setCurrMessage(`Let's start, you need to repeat the last video`)
	}

	// useEffect to initialize game phase
	useEffect(() => {
		setGamePhase('teaching')
	}, [])

	// Handles start of the game/teaching phase
	const handleStart = () => {
		if (!isPoseNetLoaded || !isModelLoaded) return setCurrMessage('Still Loading...')
		console.log(gamePhase)
		if (gamePhase === 'teaching') {
			// If we're in the 'teaching' phase, transition to 'testing'
			setCurrMessage(`Let's start, you have 10 seconds to do any pose you like`)
			setGamePhase('testing')
			classifyPose()
		} else if (gamePhase === 'testing') {
			// If we're in the 'testing' phase, start the game
			isGameOn.current = true
			setCurrMessage(`Game started! You have 10 seconds to repeat the poses`)
			setGamePhase('Started')
			classifyPose()
		}
	}

	// Sets up video and PoseNet model
	const setup = (p5, canvasParentRef) => {
		p5.createCanvas(640, 480).parent(canvasParentRef)
		let video = p5.createCapture(p5.VIDEO)
		video.hide()
		setVideo(video)

		let poseNet = window.ml5.poseNet(video, onModelLoad)
		poseNet.on('pose', (poses) => {
			if (poses.length > 0) {
				setPose(poses[0].pose)
				setSkeleton(poses[0].skeleton)
			}
		})

		let options = {
			inputs: 34,
			outputs: 6,
			task: 'classification',
			debug: true,
		}

		brainRef.current = window.ml5.neuralNetwork(options)
		const modelInfo = {
			model: `${PUBLIC_URL}/models/model2.json`,
			metadata: `${PUBLIC_URL}/models/model_meta2.json`,
			weights: `${PUBLIC_URL}/models/model.weights2.bin`,
		}
		brainRef.current.load(modelInfo, onYogaLoad)
	}

	// Draws the pose on canvas
	const draw = (p5) => {
		//NO useState here
		p5.background(0)
		p5.push()
		p5.translate(video.width, 0)
		p5.scale(-1, 1)
		p5.image(video, 0, 0, video.width, video.height)
		if (pose) {
			for (let i = 0; i < skeleton.length; i++) {
				let a = skeleton[i][0]
				let b = skeleton[i][1]
				p5.strokeWeight(2)
				p5.stroke(244, 194, 194)
				p5.line(a.position.x, a.position.y, b.position.x, b.position.y)
			}
		}
		p5.pop()
	}

	// Callback functions for when the models are loaded
	const onYogaLoad = () => {
		setIsYogaLoaded(true)
	}
	const onModelLoad = () => {
		setIsPoseNetLoaded(true)
	}

	// Classifies the current pose
	const classifyPose = () => {
		try {
			if (pose && skeleton.length) {
				let inputs = []
				for (let i = 0; i < pose.keypoints.length; i++) {
					let x = pose.keypoints[i].position.x
					let y = pose.keypoints[i].position.y
					inputs.push(x)
					inputs.push(y)
				}
				brainRef.current.classify(inputs, gotResults).catch((error) => {
					console.error('Classification error:', error)
				})
			} else {
				// console.log('Pose not found')
				setCurrPose('Not found')
				posesArray.current = [...posesArray.current, null]
			}
			handleGameTik()
		} catch (error) {
			console.log('Caught Error', error)
		}
	}

	// Handles the game timer tick
	const handleGameTik = () => {
		setPosesTime((prevPosesTime) => {
			const newPoseTime = prevPosesTime - POSES_INTERVAL

			if (newPoseTime <= 0) {
				clearTimeout(timerId)
				if (!isGameOn.current) handlePosesSetup()
				else handleGameOver()
				return POSES_TIME
			} else {
				const newTimerId = setTimeout(classifyPose, POSES_INTERVAL)
				setTimerId(newTimerId)
				return newPoseTime
			}
		})
	}

	// Handles game over state
	const handleGameOver = () => {
		const successNumber = posesToDo.reduce((acc, curr, i) => {
			if (curr === posesArray.current[i]) return acc + 1
			return acc
		}, 0)
		const successRate = Math.round((successNumber / TOTAL_POSES_CHECKS) * 100)
		setCurrMessage(`Game ended, your success rate is: ${successRate}%`)
		isGameOn.current = false
		setGamePhase('Ended')
	}

	// Handles the pose classification results
	const gotResults = (error, results) => {
		// console.log(`results:`, results)
		if (error || !results) {
			posesArray.current = [...posesArray.current, null]
			return
		}
		if (results[0].confidence < 0.7) {
			setCurrPose('Pose not found')
			posesArray.current = [...posesArray.current, null]
		} else {
			const poseNum = parseInt(results[0].label)
			const pose = poses[poseNum]
			// console.log(`pose:`, pose)
			setCurrPose(pose.pose)
			posesArray.current = [...posesArray.current, pose]
		}
	}

	return (
		<div className="pose-display">
			<div className="pose-list">
				{poses.map((pose) => (
					<div key={pose.pose} className="pose-item">
						<img src={pose.imgSrc} className="pose-img" />
						<div className="pose-name">{pose.pose}</div>
					</div>
				))}
			</div>
			{(isGameOn.current || gamePhase === 'testing') && <p className="current-pose">Pose: {currPose}</p>}
			{isMl5Loaded && <Sketch setup={setup} draw={draw} className="pose-canvas" />}
			<p className="message">{currMessage}</p>
			{(isGameOn.current || gamePhase === 'testing') && <p className="time">{posesTime}</p>}
			<button
				onClick={handleStart}
				disabled={disabledBtn}
				className={`start-button ${disabledBtn ? 'disabled' : ''}`}>
				{btnTxt}
			</button>
			{/* <img src={`${PUBLIC_URL}/imgs/allow.png`} className="instruction-img" /> */}
		</div>
	)
}

export default Pose

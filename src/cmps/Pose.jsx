import { useState, useMemo, useRef, useEffect } from 'react'
import * as ml5 from 'ml5'
import Sketch from 'react-p5'

const PUBLIC_URL = process.env.PUBLIC_URL
const poses = [
	{ pose: 'Mountain', imgSrc: `${PUBLIC_URL}/imgs/mountain.svg` },
	{ pose: 'Tree', imgSrc: `${PUBLIC_URL}/imgs/tree.svg` },
	{ pose: 'Downward Dog', imgSrc: `${PUBLIC_URL}/imgs/dog.svg` },
	{ pose: 'Warrior I', imgSrc: `${PUBLIC_URL}/imgs/warrior1.svg` },
	{ pose: 'Warrior II', imgSrc: `${PUBLIC_URL}/imgs/warrior2.svg` },
	{ pose: 'Chair', imgSrc: `${PUBLIC_URL}/imgs/chair.svg` },
]
const POSES_INTERVAL = 100
const POSES_TIME = 10 * 1000
const TOTAL_POSES_CHECKS = POSES_TIME / POSES_INTERVAL
const POSES_TO_DO_DEMO = Array(TOTAL_POSES_CHECKS)
	.fill()
	.map(() => 'Mountain')

const Pose = () => {
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

	const posesArray = useRef([])
	const isGameOn = useRef(false)
	const brainRef = useRef(null)

	const disabledBtn = useMemo(
		() => !isPoseNetLoaded || !isModelLoaded || gamePhase === 'Ended',
		[isPoseNetLoaded, isModelLoaded, gamePhase]
	)
	const btnTxt = useMemo(() => {
		if (!isPoseNetLoaded || !isModelLoaded) return 'Loading...'
		if (gamePhase === 'teaching') return 'Start Teaching'
		return 'Start Game'
	}, [isPoseNetLoaded, isModelLoaded, posesToDo.length, gamePhase])

	const handlePosesSetup = () => {
		setPosesToDo(posesArray.current)
		posesArray.current = []
		setCurrMessage(`Let's start, you need to repeat the last video`)
	}

	useEffect(() => {
		setGamePhase('teaching')
	}, [])

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

	const setup = (p5, canvasParentRef) => {
		p5.createCanvas(640, 480).parent(canvasParentRef)
		let video = p5.createCapture(p5.VIDEO)
		video.hide()
		setVideo(video)

		let poseNet = ml5.poseNet(video, onModelLoad)
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

		brainRef.current = ml5.neuralNetwork(options)
		const modelInfo = {
			model: '/models/model2.json',
			metadata: '/models/model_meta2.json',
			weights: '/models/model.weights2.bin',
		}
		brainRef.current.load(modelInfo, onYogaLoad)
	}

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

	const onYogaLoad = () => {
		setIsYogaLoaded(true)
	}

	const onModelLoad = () => {
		setIsPoseNetLoaded(true)
	}

	const classifyPose = () => {
		if (pose) {
			let inputs = []
			for (let i = 0; i < pose.keypoints.length; i++) {
				let x = pose.keypoints[i].position.x
				let y = pose.keypoints[i].position.y
				inputs.push(x)
				inputs.push(y)
			}
			brainRef.current.classify(inputs, gotResult)
		} else {
			// console.log('Pose not found')
			setCurrPose('Not found')
			posesArray.current = [...posesArray.current, null]
		}
		handleGameTik()
	}

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

	const gotResult = (error, results) => {
		if (error) {
			posesArray.current = [...posesArray.current, null]
			return console.error(error)
		}
		const pose = results[0].label
		setCurrPose(pose)
		posesArray.current = [...posesArray.current, pose]
		// if (results[0].confidence < 0.7) {
		// 	posesArray.current = [...posesArray.current, null]
		// } else {
		// 	posesArray.current = [...posesArray.current, pose]
		// }
	}

	return (
		<div className="pose-display">
			<Sketch setup={setup} draw={draw} className="pose-canvas" />
			<p className="message">{currMessage}</p>
			{(isGameOn.current || gamePhase === 'testing') && <p className="time">{posesTime}</p>}
			{(isGameOn.current || gamePhase === 'testing') && <p className="current-pose">Pose: {currPose}</p>}
			<button
				onClick={handleStart}
				disabled={disabledBtn}
				className={`start-button ${disabledBtn ? 'disabled' : ''}`}>
				{btnTxt}
			</button>
			{/* <img src={`${PUBLIC_URL}/imgs/allow.png`} className="instruction-img" /> */}
			<div className="pose-list">
				{poses.map((pose) => (
					<div key={pose.pose} className="pose-item">
						<img src={pose.imgSrc} className="pose-img" />
						<div className="pose-name">{pose.pose}</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Pose

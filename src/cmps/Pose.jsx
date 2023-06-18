import { useState, useMemo, useRef } from 'react'
import * as ml5 from 'ml5'
import Sketch from 'react-p5'

const posesArray = ['Mountain', 'Tree', 'Downward Dog', 'Warrior I', 'Warrior II', 'Chair']
const imgArray = [
	'imgs/mountain.svg',
	'imgs/tree.svg',
	'imgs/dog.svg',
	'imgs/warrior1.svg',
	'imgs/warrior2.svg',
	'imgs/chair.svg',
]
const POSES_INTERVAL = 100
const POSES_TIME = 10 * 1000
const TOTAL_POSES_CHECKS = POSES_TIME / POSES_INTERVAL
const repeat = (str, times) => {
	return Array(times)
		.fill()
		.map(() => str)
}
const POSES_TO_DO_DEMO = [repeat('Mountain', TOTAL_POSES_CHECKS)]

const Pose = () => {
	const [pose, setPose] = useState(null)
	const [skeleton, setSkeleton] = useState(null)
	const [video, setVideo] = useState(null)
	const [poseNet, setPoseNet] = useState(null)
	const [posesArray, setPosesArray] = useState(POSES_TO_DO_DEMO)
	const [posesToDo, setPosesToDo] = useState([])
	const [posesTime, setPosesTime] = useState(POSES_TIME)
	const [currMessage, setCurrMessage] = useState('')
	const [isModelLoaded, setIsModelLoaded] = useState(false)
	const [isPoseNetLoaded, setIsPoseNetLoaded] = useState(false)
	const [isGameOn, setIsGameOn] = useState(false)

	const brainRef = useRef(null)

	const disabledBtn = useMemo(() => !isPoseNetLoaded || !isModelLoaded, [isPoseNetLoaded, isModelLoaded])
	const btnTxt = useMemo(() => {
		if (!isPoseNetLoaded || !isModelLoaded) return 'Loading...'
		if (posesToDo.length === 0) return 'Start'
		return 'Next'
	}, [isPoseNetLoaded, isModelLoaded, posesToDo.length])

	const handlePosesSetup = () => {
		setPosesToDo(posesArray)
		setPosesArray([])
	}

	const handleStart = () => {
		if (!isPoseNetLoaded || !isModelLoaded) return setCurrMessage('Still Loading...')
		setCurrMessage('Game started, you have 10 seconds to do a pose')
		handlePosesSetup()
		setIsGameOn(true)
		classifyPose()
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
		setPoseNet(poseNet)

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
		setIsModelLoaded(true)
		// setCurrMessage(isPoseNetLoaded ? 'You can start now' : 'Model loaded')
	}

	const onModelLoad = () => {
		setIsPoseNetLoaded(true)
		// setCurrMessage(isModelLoaded ? 'You can start now' : 'poseNet loaded')
	}

	const classifyPose = () => {
		if (pose) {
			console.log(`pose:`, pose)
			let inputs = []
			for (let i = 0; i < pose.keypoints.length; i++) {
				let x = pose.keypoints[i].position.x
				let y = pose.keypoints[i].position.y
				inputs.push(x)
				inputs.push(y)
			}
			brainRef.current.classify(inputs, gotResult)
		} else {
			console.log('Pose not found')
			setPosesArray((prevPosesArray) => [...prevPosesArray, null])
		}
		handleGameTik()
	}

	const handleGameTik = () => {
		setPosesTime((prevPosesTime) => prevPosesTime - POSES_INTERVAL)
		if (posesTime <= 0 + POSES_INTERVAL) return handleGameOver()
		setTimeout(classifyPose, POSES_INTERVAL)
	}

	const handleGameOver = () => {
		const successNumber = posesToDo.reduce((acc, curr, i) => {
			if (curr === posesArray[i]) return acc + 1
			return acc
		}, 0)
		const successRate = Math.round((successNumber / TOTAL_POSES_CHECKS) * 100)
		setCurrMessage(`Game over, your success rate is: ${successRate}`)
		setIsGameOn(false)
		setPosesTime(POSES_TIME)
	}

	const gotResult = (error, results) => {
		if (error) return console.error(error)
		console.log(`pose:`, results[0].label)
		if (results[0].confidence < 0.7) {
			setPosesArray((prevPosesArray) => [...prevPosesArray, null])
		} else {
			setPosesArray((prevPosesArray) => [...prevPosesArray, results[0].label])
		}
	}

	return (
		<div>
			<Sketch setup={setup} draw={draw} />
			<p>{currMessage}</p>
			<button onClick={handleStart} disabled={disabledBtn} className={disabledBtn ? 'disabled' : ''}>
				{btnTxt}
			</button>
		</div>
	)
}

export default Pose

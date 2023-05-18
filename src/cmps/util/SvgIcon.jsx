import { useState, useEffect } from 'react'
import { getSvg } from '../../services/svg.service'

const SvgMarkup = ({ markup, ...rest }) => {
  return <span dangerouslySetInnerHTML={{ __html: markup }} {...rest} />
}

export const SvgIcon = ({ iconName, ...rest }) => {
  const [svgMarkup, setSvgMarkup] = useState(null)

  useEffect(() => {
    const fetchSvg = () => {
      const markup = getSvg(iconName)
      setSvgMarkup(markup)
    }
    fetchSvg()
  }, [iconName])

  if (!svgMarkup) {
		return <span>Loading...</span>
	}
	return <SvgMarkup markup={svgMarkup} className="svg-icon" {...rest} />
}

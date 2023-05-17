// import { getSvg } from '../../services/svg.service'

// export const SvgIcon = ({ iconName }) => {
//      const svgMarkup = getSvg(iconName)
//      return <span dangerouslySetInnerHTML={{ __html: svgMarkup }} className="svg-icon" ></span>
// }
// src/components/SvgIcon.js
import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { getSvg } from '../../services/svg.service'

const SvgMarkup = ({ markup, ...rest }) => {
  return <span dangerouslySetInnerHTML={{ __html: markup }} {...rest} />
}

export const SvgIcon = ({ iconName, ...rest }) => {
  const [svgMarkup, setSvgMarkup] = useState(null)

  useEffect(() => {
    const fetchSvg = async () => {
      const markup = await getSvg(iconName)
      setSvgMarkup(markup)
    }
    fetchSvg()
  }, [iconName])

  const MemoizedSvgMarkup = useMemo(
    () => <SvgMarkup markup={svgMarkup} className="svg-icon" />,
    [svgMarkup]
  )

  return (
    <Suspense fallback={<span>Loading...</span>}>{svgMarkup && MemoizedSvgMarkup}</Suspense>
  )
}

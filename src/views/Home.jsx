// External imports
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect} from 'react'

// Internal imports
import { AnimateWord } from '../cmps/util/AnimateWord';
import { AtomLoader } from '../cmps/util/AtomLoader'
import { SvgIcon } from '../cmps/util/SvgIcon'
import { loadUser } from '../store/actions/user.actions'

const MOVES_NUMBER = 10

function useHomeLogic() {
  const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadUser())
  }, [])

  useEffect(() => {
    if (!loggedInUser) return
  }, [loggedInUser])

  return { loggedInUser }
}

export function Home() {
  const { loggedInUser } = useHomeLogic()

  useEffect(() => {
    document.title = 'Eramorph - Home'
  }, [])
  
  if (!loggedInUser) return <AtomLoader />

    return (
      <>
        <div className="home">
          
          </div>
        </>
    )
}
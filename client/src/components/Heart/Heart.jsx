// import React, { useContext, useEffect, useState } from 'react'
// import {AiFillHeart} from 'react-icons/ai'
// import useAuthCheck from '../../hooks/useAuthCheck';
// import { useMutation } from 'react-query';
// import { userDetailContext } from '../Context/userDetailContext';
// import { useAuth0 } from '@auth0/auth0-react';
// import { updateFavorites } from '../../utils/common';
// import { toFav } from '../../utils/api';
// const Heart = (id) => {
//     // console.log();
//     const [heartColor,setHeartColor]=useState("white");
//     const {validateLogin}=useAuthCheck();
//     const {user} = useAuth0();
//     const {userDetails:{token,favorites},setUserDetails} = useContext(userDetailContext);
    

// //     useEffect(()=> {
// //         // setHeartColor(()=> checkFavorites(id, favorites))
// //         try {
// //             favorites?.includes(id)
// //         } catch (error) {
            
// //         }
// //   },[favorites])

//     const {mutate} = useMutation({
//         mutationFn:()=>toFav(id.id,user?.email,token),
//         onSuccess:()=>{
//             setUserDetails((prev)=>({
//                 ...prev,
//                 favorites:updateFavorites(id,prev.favorites)
//             }))
//         }
//     })
//     const handleLike =()=>{
//         if(validateLogin()){
//             mutate()
//             setHeartColor((prev)=> prev === "#fa3e5f" ? "white": "#fa3e5f")

//         }
//     }
//   return (
//     <div className='heart'>
//         <AiFillHeart size={24} color={heartColor} onClick={(e)=>{
//             e.stopPropagation()
//             handleLike()
//         }}/>
//     </div>
//   )
// }

// export default Heart


import { useContext, useEffect, useState } from "react"
import { AiFillHeart } from "react-icons/ai"
import useAuthCheck from "../../hooks/useAuthCheck"
import { useMutation } from "react-query"
import { useAuth0 } from "@auth0/auth0-react"
import { userDetailContext } from '../Context/userDetailContext';
import { checkFavorites, updateFavorites } from "../../utils/common"
import { toFav } from "../../utils/api"

const Heart = ({id}) => {

    const [heartColor, setHeartColor] = useState("white")
    const {validateLogin} = useAuthCheck()
    const {user} = useAuth0()

    const {
        userDetails: { favorites, token },
        setUserDetails,
      } = useContext(userDetailContext);

      useEffect(()=> {
            setHeartColor(()=> checkFavorites(id, favorites))
      },[favorites])


    const {mutate} = useMutation({
        mutationFn: () => toFav(id, user?.email, token),
        onSuccess: ()=> {
            setUserDetails((prev)=> (
                {
                    ...prev,
                    favorites: updateFavorites(id, prev.favorites)
                }
            ))
        }
    })

    const handleLike = () => {
        if(validateLogin())
        {
            mutate()
            setHeartColor((prev)=> prev === "#fa3e5f" ? "white": "#fa3e5f")
        }
    }

  return (
    <AiFillHeart size={24} color={heartColor} onClick={(e)=> {
        e.stopPropagation()
        handleLike()
    }}/>
  )
}

export default Heart
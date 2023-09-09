import React, { useContext, useEffect } from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";
import { userDetailContext } from '../Context/userDetailContext'
import { useMutation } from 'react-query'
import { createUser } from '../../utils/api'
import useFavorite from '../../hooks/useFavorite';
import useBookings from '../../hooks/useBookings';


const Layout = () => {
  useFavorite();
  useBookings();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  // console.log(user);
  const {setUserDetails} = useContext(userDetailContext);

  const {mutate} = useMutation({
    mutationKey:[user?.email],
    mutationFn:(token)=>createUser(user?.email,token)
  })

  useEffect(() => {
    const getTokenAndRegsiter = async () => {

      try {
        const res = await getAccessTokenSilently({
        authorizationParams: {
          audience: "http://localhost:8000",
          scope: "openid profile email",
        },
      });
    
      localStorage.setItem("access_token", res);
      setUserDetails((prev) => ({ ...prev, token: res }));
      mutate(res);
      } catch (error) {
        console.error("Error getting access token:", error);
      }
      
      // mutate(res)
    };


    isAuthenticated && getTokenAndRegsiter();
  }, [isAuthenticated]);

  return (
    <>
    <div style={{background:"var(--black)", overflow:"hidden"}}>
      <Header />
      <Outlet />
    </div>
    <Footer/>
    </>
  )
}

export default Layout
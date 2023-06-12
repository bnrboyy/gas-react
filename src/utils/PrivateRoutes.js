import { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import jwt_decode from "jwt-decode";
import { Outlet, Navigate } from 'react-router-dom';
import { authActions } from '../store/auth-slice';
import MainLayout from '../components/main';
import axios from 'axios';
import { appActions } from '../store/app-slice';

const PrivateRoutes = () =>  {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
    const authToken = useSelector((state) => state.auth.authToken)
    const adminId = useSelector((state) => state.auth.adminId)
    const language = useSelector((state) => state.app.language)
    const multilingual = useSelector((state) => state.app.features.multilingual)

    useEffect(() => { 
      if(isLoggedIn) {
        tokenHandler();
      }
    }, [isLoggedIn]) 

    const userInfoHandler = () => {
      dispatch(appActions.isBounceActive(true)) 
      return axios({
        url: `account/settings`,
        method: "post",
      }).then(response => { 
        let data = response.data.data;
        dispatch(authActions.authSettings({ data: data, multilingual: multilingual }))
        dispatch(appActions.frontOffifcePageInit(data.menu))
        dispatch(appActions.changeLanguage(data.defaultLanguage))
      }, (error) => {
        dispatch(authActions.logout())
      }).then(()=> {
        dispatch(appActions.isBounceActive(false))
      })
    }

    const getNewOrders = () => {
      return axios({
        url: `order/data/pending`,
        method: "GET"
      })
    }

    useEffect(() => {
      getNewOrders().then((response) => {
        dispatch(appActions.setNewOrders(response.data.data))
      });
    }, [])

    const tokenHandler = () => {

      /* เช็คทุก 3 วินาที token expired จะสั่ง logout */
      try { 

        if(authToken !== undefined ) { 
          let tokenInfo = jwt_decode(authToken); 
          let tokenExpiration = tokenInfo.exp * 1000; 
          let checkTokenExpire = setInterval(() => {
            if(localStorage.getItem("authToken") && tokenExpiration < new Date().getTime() ){
              clearInterval(checkTokenExpire);
              dispatch(authActions.logout())
            }
          }, 1000)
 
          if(!adminId) { 
            getNewOrders();
            userInfoHandler() 
          } else {
            setTimeout(()=> {
              dispatch(appActions.isBounceActive(false))
            }, 1500)
          }

        } else {
          console.log('invalid credentials')
          dispatch(authActions.logout())
        }
    
      } catch (error){
        console.log('invalid authorization')
        dispatch(authActions.logout())
      } 
    }
    
    if(isLoggedIn && !adminId) {
      return <></>
    }
    return (
      <MainLayout> 
        {isLoggedIn? <Outlet/> : <Navigate to="/login" />}
      </MainLayout> 
    )
}

export default PrivateRoutes
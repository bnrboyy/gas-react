import { createSlice } from '@reduxjs/toolkit';
import appConfig from './settings';
 
const initialAppState = { 
    pageData: {
        page: "",
        data: []
    },
    editData: null,
    isDevMode: appConfig.isDevMode,
    isBounceActive: false,
    isSpawnActive: false,
    isNavsideCollapse: false,
    defaultLanguage: appConfig.language,
    language: (localStorage.i18nextLng)?localStorage.i18nextLng:appConfig.language,
    languageAvailable: appConfig.languageAvailable,
    timeZone: appConfig.timeZone,
    apiPath: appConfig.apiPath,
    uploadPath: appConfig.uploadPath,
    webPath: appConfig.webPath,
    randomString: "",
    pages: appConfig.pages,
    features: appConfig.features,
    newOrders: 0,
    followNewOrders: 0,
    frontOffice: {
        pageAvailable: []
    }
}
 
const appSlice = createSlice({
    name: "app",
    initialState: initialAppState,
    reducers: {
        setPageData(state, action) {
            state.pageData = {
                page: action.payload[0],
                data: action.payload[1]
            }
        },
        setNewOrders(state, action) {
            state.newOrders = action.payload
        },
        setFollowNewOrders(state, action) {
            state.followNewOrders = action.payload
        },
        setEditData(state, action) {
            state.editData = action.payload
        },
        changeLanguage(state, action) {
            state.language = action.payload
        },
        frontOffifcePageInit(state, action) {
            state.frontOffice.pageAvailable = action.payload
        },
        toggleNavsideCollapse(state, action) {
            if(action.payload !== undefined) {
                state.isNavsideCollapse = action.payload
            } else {
                state.isNavsideCollapse = !state.isNavsideCollapse
            }
        
        },
        isBounceActive(state, action) { 
            if(action.payload !== undefined) {
                state.isBounceActive = action.payload
            } else {
                state.isBounceActive = !state.isBounceActive
            }
        },
        isSpawnActive(state, action) {
            if(action.payload !== undefined) {
                state.isSpawnActive = action.payload
            } else {
                state.isSpawnActive = !state.isSpawnActive
            }
        }, 
        momentFormat(state, action) {
            return action.payload
        },
        randomString(state, action) {
            let string = "";
            let length = action.payload.length;
            let characters = `${action.payload.text}ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
            let charactersLength = characters.length;
            for ( let i = 0; i < length; i++ ) { 
                string += characters.charAt(Math.floor(Math.random() * charactersLength)); 
            }
            state.randomString = string.replaceAll(" ", "");
        }
    }
})


export const appActions = appSlice.actions;
export default appSlice;

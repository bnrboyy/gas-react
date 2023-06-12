import { createSlice } from '@reduxjs/toolkit';
 
const initialAuthState = { 
    isLoggedIn: !!localStorage.authToken,
    authToken: localStorage.authToken,
    adminId: null,
    userRoleName: null,
    userRoleId: null,
    keepLogin: (!!localStorage.keepLogin)?localStorage.keepLogin:false,
    activateLanguage: [],
    tokenCount: 0,
    profile: {
        username: "",
        email: "",
        displayName: "",
        adminNote: "",
        profileImage: "",
        coverImage: ""
    },
    userPermission: {
        superAdmin: false,
        admin: false,
        officer: false,
        user: false,
    }
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
            state.adminId = null;
            localStorage.removeItem('authToken')
            localStorage.setItem('authToken', action.payload.token)
            state.authToken = action.payload.token
            state.keepLogin = action.payload.keepLogin
            state.isLoggedIn = true;
        },
        logout(state) {
            state.tokenCount = 0;
            state.keepLogin = false;
            state.authToken = null;
            state.authToken = null;
            state.isLoggedIn = false;
            localStorage.removeItem('authToken')
            localStorage.removeItem('rft')
        },
        authSettings(state, action)  {
            let obj = action.payload.data;
            // if(localStorage.getItem('i18nextLng') === "en") {
                localStorage.removeItem('i18nextLng')
                localStorage.setItem('i18nextLng', obj.defaultLanguage)
            // }
            state.userRoleId = obj.userRoleId
            state.userRoleName = obj.userRoleName 
            state.adminId = obj.adminId
            let langList= obj.activateLanguage.split(',').filter(l=> (l!==""))
            /* ถ้าไม่มี Language รองรับเลย สั่งให้ logout เพราะต้องระบุอย่างน้อง 1 ภาษา */
            if(langList.length === 0) {
                authSlice.caseReducers.logout(state, action)
            }
            if(action.payload.multilingual) {
                state.activateLanguage = langList;
            } else {
                state.activateLanguage = [langList[0]]
            }
            const setPermission = [false,false,false,false];
            const userPermission = setPermission.map((row,index) => (state.userRoleId <= (index + 1)))
            state.userPermission = {
                superAdmin: userPermission[0],
                admin: userPermission[1],
                officer: userPermission[2],
                user: userPermission[3],
            } 
            state.profile = {
                username: obj.profile.username,
                email: obj.profile.email,
                displayName: obj.profile.displayName,
                adminNote: obj.profile.adminNote,
                profileImage: (obj.profile.profileImage)?obj.profile.profileImage:"",
                coverImage:  (obj.profile.coverImage)?obj.profile.coverImage:"",
            }
        }
    }
})

export const authActions = authSlice.actions;
export default authSlice;

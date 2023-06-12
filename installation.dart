ReactJs Installation Tutorial : Version18
-----------------------------------------------------------------------------
Topic /* */ หัวเรื่อง
#!! npm install
@fileName ชื่อไฟล์ (คำอธิบาย) 
  /* children = ข้อมูลทั้งหมดในไฟล์นี้ */  
  /* Some Coding Here */
-----------------------------------------------------------------------------

Topic /* สร้างโปรเจค */
#!! npx create-react-app my-app 

Topic /* ติดตั้ง scss */
#!! npm i node-sass

Topic /* ติดตั้ง ReactRouterDom */  
#!! npm i react-router-dom
  @fileName index.js () /* 
    import { BrowserRouter } from "react-router-dom";
    root.render( <BrowserRouter> <App /> </BrowserRouter> );
  */
  @fileName index.js () /* 
    const functionName = () => {
      let appRoute = useRoutes([
        { path: "/", element: <DashboardPage /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/register", element: <RegisterPage /> },
      ]);
      return ( <div className="App"> {appRoute} </div> );
    }
  */

Topic /* ติดตั้ง i18next */
#!! npm install react-i18next i18next --save
#!! npm install i18next-http-backend i18next-browser-languagedetector --save
  @fileName i18n.js () /* children */ 
  @fileName index.js ()/* 
    import './i18n';
  */
  @fileName Components/pages/dashboard/dashboard.js ( useTranslation("ns") กำหนดชื่อไฟล์ )/* 
    import { useTranslation } from 'react-i18next';
    const functionName = () => {
      const { t, i18n } = useTranslation("ns");
      return (
        <div>
          <button onClick={()=> i18n.changeLanguage('en')} >EN</button>
          <button onClick={()=> i18n.changeLanguage('th')} >TH</button>
          <p>{t('homeH1')} : {t("interpolation.example", { what: " I want something to eat " })}</p>
        </div>
      )
    }
  */
  @fileName public/locales/en/ns.json (สร้างไฟล์ที่ต้องการใช้แปรภาษา) /* children */
 
Topic /* ติดตั้ง @ReduxToolkit */
#!! npm i react-redux
#!! npm install @reduxjs/toolkit
  @fileName store/index.js () /* children */ 
  @fileName store/app-slice.js () /* children */  
  @fileName index.js () /* 
    import { Provider } from 'react-redux';
    import store from './store/index';
    root.render(
        <Provider store={store}>  
          <App />
        </Provider>
    );
  */ 
  @fileName page.js () /* 
    import { useSelector } from 'react-redux';
    import { appActions } from '/store/app-slice';
    const selectedLanguage = useSelector((state:any) => state.app.language) 
     
     appActions.changeLanguage('th');
  */




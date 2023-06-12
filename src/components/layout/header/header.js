import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './header.scss';

const HeaderComponent = () => {
  const selectedLanguage = useSelector((state) => state.app.language) 

  useEffect(()=> {

  },[]) 
  
  return (
    <header>
      header
    </header>
  )
}

export default HeaderComponent;
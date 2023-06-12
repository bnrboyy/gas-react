import { faSignsPost } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useTranslation } from 'react-i18next';
import HeadPageComponent from '../../components/layout/headpage/headpage';
import './menu.scss';

const MenuPage = () => {
    const { t } = useTranslation(["menu-page"]);
  return (
    <section id="menu-page">
        <HeadPageComponent
            h1={"menuPage"} 
            icon={<FontAwesomeIcon icon={faSignsPost} />} 
            breadcrums={[
                {title: "menuPage", link: false }
            ]} 
        />
    </section>
  )
}

export default MenuPage
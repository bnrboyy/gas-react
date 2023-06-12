import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useTranslation } from 'react-i18next';
import HeadPageComponent from '../../components/layout/headpage/headpage';
import './inbox.scss';

const InboxPage = () => {
    const { t } = useTranslation(["menu-page"]);
  return (
    <section id="menu-page">
        <HeadPageComponent
            h1={"inboxPage"} 
            icon={<FontAwesomeIcon icon={faInbox} />} 
            breadcrums={[
                {title: "inboxPage", link: false }
            ]} 
        />
    </section>
  )
}

export default InboxPage
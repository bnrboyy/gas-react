import React from 'react'
import { useTranslation } from 'react-i18next';

import './navbar.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faArrowRightFromBracket, faBars, faBarsStaggered, faUser } from "@fortawesome/free-solid-svg-icons";
import { faBell, faComments } from '@fortawesome/free-regular-svg-icons';
import { Fab , Badge} from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../../store/auth-slice'; 

const NavbarComponent = (props) => {
  const { t } = useTranslation("sidebar")
  const dispatch = useDispatch();
  const { displayName,email,profileImage } = useSelector(state => state.auth.profile)
  const userRoleName = useSelector(state => state.auth.userRoleName)

  const OnSignOutHandler = () => {
    dispatch(authActions.logout());
  }
  return (
    <nav className='navbar'>
        <div className='nav-body'> 
          <Fab size="small" color="secondary"  className='btn-toggle-sidebar' onClick={() => props.collapseHandler()} >
            { props.isCollapsed && (
              <FontAwesomeIcon icon={faBars} />
            )}
            { !props.isCollapsed && (
              <FontAwesomeIcon icon={faBarsStaggered} />
            )}
          </Fab>
          <div className='blog-right'>
            {/* <figure className='fig-menu-icon'>
              <Badge badgeContent={4} className="fig-badge badge-danger" color="primary">
                <FontAwesomeIcon icon={faComments} />
              </Badge>
            </figure>
            <figure className='fig-menu-icon'>
              <Badge badgeContent={4}  className="fig-badge badge-warning" color="primary">
                <FontAwesomeIcon icon={faBell}  />
              </Badge>
            </figure> */}
            <figure className='fig-menu-icon user-profile'>
                <img className='fig-badge btn-profile' src={profileImage?profileImage: "/images/icons/user.png"} onError={(e) => (e.target.setAttribute("src", "/images/icons/user.png")) } />
                <div className='card-profile'>
                  <figure className="fig-profile">
                    <img src={profileImage?profileImage: "/images/icons/user.png"} onError={(e) => (e.target.setAttribute("src", "/images/icons/user.png")) } />
                    <div className='details'>
                      <p className='display'>{displayName} - <span>{userRoleName}</span></p>
                      <p className='email'>{email}</p>
                    </div>
                  </figure>
                  <div className='action-body'>
                    {/* <Link to="/profile" className='profile' >
                      <figure className="faIcon">
                        <FontAwesomeIcon icon={faUser} />
                      </figure>
                      <span className="menu-title">{t("My Account")}</span>
                    </Link> */}
                    <a className="signout "
                      title={t("signOut")}
                      onClick={OnSignOutHandler}  >
                      <figure className="faIcon">
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                      </figure>
                      <span className="menu-title">{t("signOut")}</span>
                    </a>
                  </div>
                </div>
            </figure>
          </div>
        </div>
    </nav>
  )
}

export default NavbarComponent;
 
import React, { FC, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { XCircle } from 'react-bootstrap-icons';
import { useCookies } from 'react-cookie';
import './Sidebar.scss'
import DefaultAvatar from '../../asset/default-avatar.png';
import { Button } from 'react-bootstrap';

import { useAppSelector, useAppDispatch } from '../..//store/hooks';
import { setSidebarStatus } from '../../store/slices/uiSlice';

const SideBar: FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const showSidebar = useAppSelector(state => state.ui.sidebarOpen);
  const [cookies, setCookie] = useCookies(['user']);
  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');

  let isLoggedIn = cookies.hasOwnProperty('user');

  useEffect(() => {
    // if the user is logged in
    if (isLoggedIn) {
      setName(cookies.user.name);
      setPicture(cookies.user.picture);
    }
  })

  let toggleMenu = () => {
    dispatch(setSidebarStatus(false));
  }

  let links = <div className='sidebar-links'>
    <ul>
      <li><NavLink to='/' activeClassName='sidebar-active' isActive={(match, location) => {
        let splitLocation = location.pathname.split('/');
        return splitLocation.length > 1 && ['search', 'course', 'professor'].includes(splitLocation[1]);
      }}>
        <div>
          <Icon name='list alternate outline' size='large' />
        </div>
        <span>
          Catalogue
        </span>
      </NavLink></li>
      <li><NavLink to='/roadmap' activeClassName='sidebar-active'>
        <div>
          <Icon name='map outline' size='large' />
        </div>
        <span>
          Peter's Roadmap
        </span>
      </NavLink></li>
    </ul>
  </div>

  
  if (!showSidebar) {
    return <div className='sidebar mini'>
      {links}
    </div>
  }
  return (
    <div className='sidebar'>
      {/* Close Button */}
      <div className='sidebar-close'>
        <XCircle className='sidebar-close-icon' onClick={toggleMenu} />
      </div>

      {/* Profile Icon and Name */}
      <div className='sidebar-profile'>
        <img src={picture ? picture : DefaultAvatar} />
        <p>
          {name ? name : 'Anonymous Peter'}
        </p>
      </div>

      {/* Links */}
      {links}

      {/* Login/Logout */}
      <div className='sidebar-login'>
        {isLoggedIn && <a href='/users/logout'>
          <Button variant='light'>
            <span className='sidebar-login-icon'>
              <Icon name='sign out' className='sidebar-login-icon' />
            </span>
            Log Out
          </Button>
        </a>}
        {!isLoggedIn && <a href='/users/auth/google'>
          <Button variant='light'>
            <span className='sidebar-login-icon'>
              <Icon name='sign in' className='sidebar-login-icon' />
            </span>
            Log In
          </Button>
        </a>}
      </div>
    </div>
  )
}

export default SideBar;

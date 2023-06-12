import React from 'react'
import { Link } from 'react-router-dom';
import MainLayout from '../components/main';

const NotFoundPage = () => {
  return (
    <Link to="/"> 404 Page Not Found</Link>
  )
}

export default NotFoundPage;
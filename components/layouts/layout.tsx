import React from 'react'
import Main from './components/main';
import Navbar from './components/navbar';

interface LayoutProps {
    children: React.ReactNode;
  }

  
export default function Layout({children} : LayoutProps) {
  return (
    <>
    <Navbar />
    <Main>{children}</Main>
    </>
  )
}

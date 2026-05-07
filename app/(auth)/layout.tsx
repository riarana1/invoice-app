import React from 'react'

import Header from '@/components/shared/header/navbar'
import Footer from '@/components/shared/footer'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default Layout

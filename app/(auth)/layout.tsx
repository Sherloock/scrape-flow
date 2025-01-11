import React from 'react'
import Logo from '../../components/Logo'
function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex-center flex-col h-screen gap-4'>
		<Logo />
		{children}
		</div>
	)
}

export default layout
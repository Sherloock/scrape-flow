import Logo from "@/components/Logo";
import React from "react";
function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex-center h-screen flex-col gap-4">
			<Logo />
			{children}
		</div>
	);
}

export default layout;

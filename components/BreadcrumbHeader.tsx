"use client";

import { MobileSidebar } from "@/components/Sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

function BreadcrumbHeader() {
	const pathName = usePathname();
	const paths = pathName === "/" ? [""] : pathName.split("/");
	return (
		<div className="flex-start flex items-center">
			<MobileSidebar />

			<Breadcrumb>
				<BreadcrumbList>
					{paths.map((path, index) => (
						<React.Fragment key={index}>
							<BreadcrumbItem>
								<BreadcrumbLink className="capitalize" href={`/${path}`}>
									{path === "" ? "Home" : path}
								</BreadcrumbLink>
							</BreadcrumbItem>
						</React.Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}

export default BreadcrumbHeader;

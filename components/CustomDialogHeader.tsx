'use client';

import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';

interface Props {
	title?: string;
	subtitle?: string;
	icon?: React.ElementType;
	iconClassName?: string;
	titleClassName?: string;
	subtitleClassName?: string;
}
function CustomDialogHeader({
	title,
	subtitle,
	icon,
	iconClassName,
	titleClassName,
	subtitleClassName,
}: Props) {
	return (
		<DialogHeader>
			<DialogTitle className={titleClassName}>{title}</DialogTitle>

			<div className=''></div>
			<DialogDescription className={subtitleClassName}>
				{subtitle}
			</DialogDescription>
		</DialogHeader>
	);
}

export default CustomDialogHeader;

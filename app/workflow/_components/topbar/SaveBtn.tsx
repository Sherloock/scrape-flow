"use client";

import { Button } from '@/components/ui/button';
import { useReactFlow } from '@xyflow/react';
import { CheckIcon, SaveIcon } from 'lucide-react';
import React from 'react';

function SaveBtn() {

	const { toObject } = useReactFlow();
	return (
		<Button variant='outline' className='flex items-center gap-1' onClick={() => {
			alert(JSON.stringify(toObject()));
		}}>
			<CheckIcon size={16} className='stroke-green-400' />
			<p>Save</p>
		</Button>
	)
}

export default SaveBtn
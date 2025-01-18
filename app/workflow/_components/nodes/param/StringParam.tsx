"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ParamProps } from '@/types/appNode';
import React, { useId, useState } from 'react';


function StringParam({ param, value, updateNodeParamValue }: ParamProps) {

	const [internalValue, setInternalValue] = useState(value || '');
	const id = useId();
	return (
		<div className='space-y-1 p-1 w-full'>
			<Label htmlFor={id} className='text-xs flex'>{param.name}
				{param.required && <span className='text-red-400 px-2'>*</span>}
			</Label>
			<Input id={id}
				className='text-xs'

				placeholder="Enter value" value={internalValue}
				onChange={(e) => setInternalValue(e.target.value)}
				onBlur={(e) => updateNodeParamValue(e.target.value)}
			/>

			{param.helperText && <p className='px-2 text-xs text-muted-foreground'>{param.helperText}</p>}

		</div>
	)
}

export default StringParam
'use client';

import CustomDialogHeader from '@/components/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { Layers2Icon } from 'lucide-react';
import React, { useState } from 'react';

function CreateWorkflowDialog({ triggerText }: { triggerText?: string }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button>{triggerText ?? 'Create workflow'}</Button>
				</DialogTrigger>
				<DialogContent className='px-0'>
					<CustomDialogHeader
						icon={Layers2Icon}
						title='Create workflow'
						subtitle='Start building your workflow'
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default CreateWorkflowDialog;

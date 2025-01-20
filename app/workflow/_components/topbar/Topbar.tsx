"use client";

import ExecuteBtn from '@/app/workflow/_components/topbar/ExecuteBtn';
import SaveBtn from '@/app/workflow/_components/topbar/SaveBtn';
import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Props {
	title: string;
	subtitle?: string;
	workflowId: string;
}

function Topbar({ title, subtitle, workflowId }: Props) {
	const router = useRouter();
	return (
		<header className='flex justify-between w-full bg-background p-2 border-b-2 sticky h-[60px] top-0 z-10'>
			<div className='flex flex-1 gap-2'>
				<TooltipWrapper content='Back'>
					<Button variant='ghost' size='icon' onClick={() => router.back()}>
						<ChevronLeftIcon size={20} />
					</Button>
				</TooltipWrapper>

				<div>
					<p className="font-bold text-ellipsis truncate "> {title}</p>
					{subtitle && <p className="text-xs text-muted-foreground truncate text-ellipsis">{subtitle}</p>}
				</div>
			</div>


			<div className="flex gap-1 flex-1 justify-end ">
				<ExecuteBtn workflowId={workflowId}></ExecuteBtn>
				<SaveBtn workflowId={workflowId}></SaveBtn>
			</div>
		</header>
	)
}

export default Topbar
"use client";

import { createWorkflow } from "@/actions/workflows/createWorkflow";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	createWorkflowSchema,
	createWorkflowSchemaType,
} from "@/schema/workflows";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Layers2Icon, Loader2, Loader2Icon } from "lucide-react";
import React, { useCallback, useState } from "react";
import { Form, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

function CreateWorkflowDialog({ triggerText }: { triggerText?: string }) {
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm<createWorkflowSchemaType>({
		resolver: zodResolver(createWorkflowSchema),
		defaultValues: {},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: createWorkflow,
		onSuccess: () => {
			toast.success("Workflow created successfully!", {
				id: "create-workflow",
			});
		},
		onError: (error) => {
			toast.error("Failed to create workflow!", { id: "create-workflow" });
		},
	});

	const onSubmit = useCallback(
		(data: createWorkflowSchemaType) => {
			toast.loading("Creating workflow...", { id: "create-workflow" });
			mutate(data);
		},
		[mutate]
	);

	const { isValid } = form.formState;

	return (
		<div>
			<Dialog
				open={isOpen}
				onOpenChange={(open) => {
					form.reset();
					setIsOpen(open);
				}}
			>
				<DialogTrigger asChild>
					<Button>{triggerText ?? "Create workflow"}</Button>
				</DialogTrigger>
				<DialogContent className='px-0' aria-describedby='dialog-description'>
					<CustomDialogHeader
						icon={Layers2Icon}
						title='Create workflow'
						subtitle='Start building your workflow'
					/>

					<div id='dialog-description' className='p-6'>
						<FormProvider {...form}>
							<form
								className='w-full space-y-8'
								onSubmit={form.handleSubmit(onSubmit)}
							>
								{/* Name */}
								<FormField
									control={form.control}
									name='name'
									render={({ field, fieldState }) => (
										<FormItem>
											<FormLabel className='flex items-center gap-1'>
												Name
												<p className='text-xs text-primary'>(required)</p>
											</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormDescription>
												Choose a descriptive and unique name
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Description */}
								<FormField
									control={form.control}
									name='description'
									render={({ field }) => (
										<FormItem>
											<FormLabel className='flex items-center gap-1'>
												Description
												<p className='text-xs text-muted-foreground'>
													(optional)
												</p>
											</FormLabel>
											<FormControl>
												<Textarea className='resize-none' {...field} />
											</FormControl>
											<FormDescription>
												Provide a brief description of the workflow.
												<br />
												This is optional but can help you remember its purpose.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* save button */}
								<Button
									type='submit'
									className='w-full'
									disabled={/*!isValid ||*/ isPending}
								>
									{!isPending && "Proceed"}
									{isPending && <Loader2 className='animate-spin' />}
								</Button>
							</form>
						</FormProvider>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default CreateWorkflowDialog;

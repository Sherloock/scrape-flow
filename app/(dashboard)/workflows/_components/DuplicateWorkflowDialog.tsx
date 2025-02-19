"use client";

import { duplicateWorkflow } from "@/actions/workflows/duplicateWorkflow";
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
import { cn } from "@/lib/utils";
import {
	DuplicateWorkflowSchema,
	DuplicateWorkflowSchemaType,
} from "@/schema/workflows";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CopyIcon, Layers2Icon, Loader2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

function DuplicateWorkflowDialog({ workflowId }: { workflowId: string }) {
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm<DuplicateWorkflowSchemaType>({
		resolver: zodResolver(DuplicateWorkflowSchema),
		defaultValues: {
			workflowId,
			name: "",
			description: "",
		},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: duplicateWorkflow,
		onSuccess: () => {
			toast.success("Workflow duplicated successfully!", {
				id: "duplicate-workflow",
			});

			setIsOpen((prev) => !prev);
		},
		onError: (_error) => {
			toast.error("Failed to duplicate workflow!", {
				id: "duplicate-workflow",
			});
		},
	});

	const onSubmit = useCallback(
		(data: DuplicateWorkflowSchemaType) => {
			toast.loading("Duplicating workflow...", { id: "duplicate-workflow" });
			mutate(data);
		},
		[mutate]
	);

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
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"ml-2 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
						)}
					>
						<CopyIcon
							size={16}
							className="cursor-pointer text-muted-foreground"
						/>
					</Button>
				</DialogTrigger>
				<DialogContent className="px-0" aria-describedby="dialog-description">
					<CustomDialogHeader
						icon={Layers2Icon}
						title="Duplicate workflow"
						subtitle="Duplicate your workflow to create a new one"
					/>

					<div id="dialog-description" className="p-6">
						<FormProvider {...form}>
							<form
								className="w-full space-y-8"
								onSubmit={form.handleSubmit(onSubmit)}
							>
								{/* Name */}
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-1">
												Name
												<p className="text-xs text-primary">(required)</p>
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
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-1">
												Description
												<p className="text-xs text-muted-foreground">
													(optional)
												</p>
											</FormLabel>
											<FormControl>
												<Textarea className="resize-none" {...field} />
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
								<Button type="submit" className="w-full" disabled={isPending}>
									{!isPending && "Proceed"}
									{isPending && <Loader2 className="animate-spin" />}
								</Button>
							</form>
						</FormProvider>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default DuplicateWorkflowDialog;

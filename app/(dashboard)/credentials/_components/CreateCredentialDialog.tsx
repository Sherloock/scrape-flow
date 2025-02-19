"use client";

import { createCredential } from "@/actions/credentials/createCredential";
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
	CreateCredentialSchema,
	CreateCredentialSchemaType,
} from "@/schema/credentials";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { Layers2Icon, Loader2, ShieldEllipsis } from "lucide-react";
import React, { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

function CreateCredentialDialog({ triggerText }: { triggerText?: string }) {
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm<CreateCredentialSchemaType>({
		resolver: zodResolver(CreateCredentialSchema),
		defaultValues: {
			name: "",
			value: "",
		},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: createCredential,
		onSuccess: () => {
			toast.success("Credential created successfully", {
				id: "create-credential",
			});
			setIsOpen(false);
		},
		onError: (error) => {
			toast.error(error.message, { id: "create-credential" });
		},
	});

	const onSubmit = useCallback(
		(data: CreateCredentialSchemaType) => {
			toast.loading("Creating credential...", { id: "create-credential" });
			mutate(data);
		},
		[mutate]
	);

	// const { isValid } = form.formState;

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
					<Button>{triggerText ?? "Create"}</Button>
				</DialogTrigger>
				<DialogContent className="px-0" aria-describedby="dialog-description">
					<CustomDialogHeader icon={ShieldEllipsis} title="Create credential" />

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
												Enter a unique and descriptive name for the credential{" "}
												<br />
												This will be used to identify the credential in the
												future <br />
												Example: "OPENAI_API_KEY",
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Value */}
								<FormField
									control={form.control}
									name="value"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-1">
												Value
												<p className="text-xs text-primary">(required)</p>
											</FormLabel>
											<FormControl>
												<Textarea className="resize-none" {...field} />
											</FormControl>
											<FormDescription>
												Enter the value of the credential.
												<br />
												This value will be encrypted and stored securely.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* save button */}
								<Button
									type="submit"
									className="w-full"
									disabled={/*!isValid ||*/ isPending}
								>
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

export default CreateCredentialDialog;

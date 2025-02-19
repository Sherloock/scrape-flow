"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { deleteCredential } from "@/actions/credentials/deleteCredentials";

interface Props {
	name: string;
}

function DeleteCredentialDialog({ name }: Props) {
	const [confirmText, setConfirmText] = useState("");
	const [open, setOpen] = useState(false);

	const deleteMutation = useMutation({
		mutationFn: deleteCredential,
		onSuccess: () => {
			toast.success("Credential deleted successfully!", {
				id: name,
			});
			setConfirmText("");
			// setOpen(false);
		},
		onError: () => {
			toast.error("Failed to delete credential!", {
				id: name,
			});
		},
	});

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant={"destructive"} size={"icon"}>
					<XIcon size={18} />
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="">
				<AlertDialogHeader className="">
					<AlertDialogTitle className="text-lg font-semibold text-destructive">
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription className="">
						If you delete this credential, you will not be able to recover it.
						<div className="flex flex-col gap-2 py-4">
							<p>
								If you are sure, enter <b>{name}</b> to confirm:
							</p>
							<Input
								placeholder={name}
								value={confirmText}
								onChange={(e) => setConfirmText(e.target.value)}
								className="w-full"
							/>
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel
						onClick={() => {
							setConfirmText("");
						}}
					>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={confirmText !== name || deleteMutation.isPending}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						onClick={() => {
							toast.loading("Deleting credential...", {
								id: name,
							});
							deleteMutation.mutate(name);
						}}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default DeleteCredentialDialog;

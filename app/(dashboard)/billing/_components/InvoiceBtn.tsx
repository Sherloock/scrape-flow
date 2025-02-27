"use client";

import { downloadInvoice } from "@/actions/billing/downloadInvoice";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { FileDownIcon, Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function InvoiceBtn({ id }: { id: string }) {
	const mutation = useMutation({
		mutationFn: downloadInvoice,
		onSuccess: (data) => {
			window.location.href = data as string;
		},
		onError: (_error) => {
			toast.error("Something went wrong");
		},
	});

	return (
		<Button
			variant="ghost"
			size="sm"
			className="gap-2 px-1 text-muted-foreground"
			disabled={mutation.isPending}
			onClick={() => mutation.mutate(id)}
		>
			<FileDownIcon className="size-4" />
			Invoice
			{mutation.isPending && <Loader2 className="size-4 animate-spin" />}
		</Button>
	);
}

export default InvoiceBtn;

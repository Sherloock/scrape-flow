import React, { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserCredentials } from "@/actions/credentials/getUserCredentials";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CreateCredentialDialog from "@/app/(dashboard)/credentials/_components/CreateCredentialDialog";
import { formatDistanceToNow } from "date-fns";
import DeleteCredentialDialog from "@/app/(dashboard)/credentials/_components/DeleteCredentialDialog";
export default function CredentialsPage() {
	return (
		<div className="flex h-full flex-1 flex-col">
			<div className="flex justify-between">
				<div className="flex flex-col">
					<h1 className="text-3xl font-bold">Credentials</h1>
					<p className="text-muted-foreground">Manage your credentials</p>
				</div>

				<CreateCredentialDialog />
			</div>

			<div className="h-full space-y-6 py-6">
				<Alert>
					<ShieldIcon className="stroke-primary" size={16} />
					<AlertTitle className="text-primary">Encryption</AlertTitle>
					<AlertDescription>
						All information is securely encrypted, ensuring your data is
						protected.
					</AlertDescription>
				</Alert>

				<Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
					<UserCredentials />
				</Suspense>
			</div>
		</div>
	);
}

async function UserCredentials() {
	const credentials = await getUserCredentials();

	if (!credentials) {
		return <div className="text-muted-foreground">Something went wrong</div>;
	}

	if (credentials.length === 0) {
		return (
			<Card className="w-full p-4">
				<div className="flex flex-col items-center justify-center gap-4">
					<div className="flex size-20 items-center justify-center rounded-full bg-accent">
						<ShieldOffIcon size={40} className="stroke-primary" />
					</div>

					<div className="flex flex-col gap-1 text-center">
						<p className="text-bold">No credentials found</p>
						<p className="text-sm text-muted-foreground">
							Click the button below to create your first credential
						</p>
					</div>
					<CreateCredentialDialog triggerText="Create your first credential" />
				</div>
			</Card>
		);
	}

	return (
		<div className="flex flex-wrap gap-2">
			{credentials.map((credential) => {
				const createdAt = formatDistanceToNow(new Date(credential.createdAt), {
					addSuffix: true,
				});
				return (
					<Card key={credential.id} className="flex w-full justify-between p-4">
						<div className="flex items-center gap-2">
							<div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
								<LockKeyholeIcon size={18} className="stroke-primary" />
							</div>

							<div>
								<p className="font-bold">{credential.name}</p>
								<p className="text-sm text-muted-foreground">{createdAt}</p>
							</div>
						</div>

						<DeleteCredentialDialog name={credential.name} />
					</Card>
				);
			})}
		</div>
	);
}

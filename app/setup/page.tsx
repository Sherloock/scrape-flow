import { setupUser } from "@/actions/billing/setupUser";

async function SetupPage() {
	return await setupUser();
}

export default SetupPage;

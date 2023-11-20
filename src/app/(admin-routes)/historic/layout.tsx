import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { nextAuthOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import TopBar from "@/components/TopBar";

interface PrivateLayoutProps {
	children: ReactNode
}

export default async function PrivateLayout({ children }: PrivateLayoutProps){
	const session = await getServerSession(nextAuthOptions)

	if (!session) {
		redirect('/')
	}

	return <>
	<TopBar imageUrl={session?.user.avatar_url} name={session?.user.name} username={session?.user.userTag} id={session?.user.id}
		token={session?.user.token}/>
	{children}</>
}
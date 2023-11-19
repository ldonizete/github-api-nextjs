"use client"
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route"
import ButtonLogout from "@/components/ButtonLogout"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { SetStateAction, useState } from "react"
import { MdList, MdSearch } from "react-icons/md"


export default  function Admin(){
	
	const [inputText, setInputText] = useState('');

	const handleInputChange = (event: { target: { value: SetStateAction<string> } }) => {
	  setInputText(event.target.value);
	};
	

	return (
		<div className="w-full h-screen flex flex-col items-center justify-center">
			<div className="flex">
				<input 
					type="text" 
					className="text-black p-2"
					placeholder="Digite o nome do usuário e clique em buscar" 
					value={inputText}
					onChange={handleInputChange}
				/>
				<Link href={`/repos?username=${inputText}`}>
					<button className="bg-red-700 p-2 rounded-sm ml-2 flex items-center"><MdSearch/>BUSCAR</button>
				</Link>
			</div>
			
			<Link href={`/historic?username=${sessionStorage.getItem('sessionUserName')}`}>
				<button className="bg-green-700 p-2 rounded-sm ml-2 flex items-center mt-10"><MdList/>Histórico</button>
			</Link>
		</div>
	)
}
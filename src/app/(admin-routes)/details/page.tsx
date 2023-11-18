"use client"
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { useState, useEffect } from "react";

interface UserData {
    name?: string;
    login?: string;
    followers?: number;
    following?: number;
    public_repos?: number;
    bio?: string;
    twitter_username?: string;
    company?: string;
    blog?: string;
    email?: string;
    avatar_url?: string;
  }


export default  function Admin(){
	// const session =  getServerSession(nextAuthOptions)
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const fetchUserInfo = () => {
          // Extrair o nome de usuário da URL
          const urlParams = new URLSearchParams(window.location.search);
          const username = urlParams.get('username'); // Supondo que o parâmetro seja 'username'
    
          // Verificar se o username está presente na URL
          if (username) {
            fetch('http://127.0.0.1:5000/users/userinfo', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username }),
            })
              .then(response => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error('Falha ao buscar informações do usuário');
              })
              .then(userData => {
                setUserData(userData);
              })
              .catch(error => {
                console.error(error);
              });
          } else {
            console.error('Nome de usuário ausente na URL');
          }
        };
    
        fetchUserInfo();
      }, []);
	

	return (
		<div className="flex justify-center flex-col items-center">
			<div className="flex justify-around w-full">
                <div className="flex">
                    <img
                        className="h-20 w-20 rounded-full mr-2"
                        src={userData?.avatar_url}
                        alt="Ícone"
                    />
                    <div className="flex flex-col ml-4">
                        <span>{userData?.name}</span>
                        <span>{userData?.login}</span>
                    </div>
                </div>
                <div className="flex">
                    <div>
                        <span>{userData?.followers}</span>
                        <span className="ml-2">Seguidores</span>
                    </div>
                    <div className="ml-4">
                        <span>{userData?.following}</span>
                        <span className="ml-2">Seguindo</span>
                    </div>
                    <div className="ml-4">
                        <span>{userData?.public_repos}</span>
                        <span className="ml-2">Respositorios</span>
                    </div>
                </div>
                <span>Icone Editar</span>
            </div>
            <textarea 
                className="w-44 text-black" 
                value= {userData?.bio}
                rows={6}
                cols={50}
            />
           
            
            <div className="flex justify-between mt-14">
                <div>
                    <span>icone email</span>
                    <span>{userData?.email}</span>
                </div>
                <div className="ml-4">
                    <span>icone twitter</span>
                    <span className="ml-2">{userData?.twitter_username}</span>
                </div>
                <div className="ml-4">
                    <span>icone companyr</span>
                    <span className="ml-2">{userData?.company}</span>
                </div>
                <div className="ml-4">
                    <span>icone blog</span>
                    <span className="ml-2">{userData?.blog}</span>
                </div>
            </div>
		</div>
	)
}
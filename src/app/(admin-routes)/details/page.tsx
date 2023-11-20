"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { MdApartment, MdClose, MdEdit, MdListAlt, MdMail, MdRssFeed } from "react-icons/md";

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
	  const [userData, setUserData] = useState<UserData | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserInfo = () => {
          
          const urlParams = new URLSearchParams(window.location.search);
          const username = urlParams.get('username'); 
          setUserName(username)
    
          if (username) {
            fetch('http://127.0.0.1:5000/users/userinfo', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
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
                    <div className="ml-4 ">
                        <Link className="flex items-center" href={`/repos?username=${userName}`}>
                          <span>{userData?.public_repos}</span>
                          <span className="ml-2">Respositorios</span>
				                  <MdListAlt className="ml-4 "/>
			                 </Link>
                    </div>
                </div>
                <Link href={`/update`}>
                  <span className="flex items-center"><MdEdit className="mr-2"/> Editar</span>
			          </Link>
                
            </div>
            
            <div>
              <h2 className="text-center text-2xl">Biogarfia</h2>
              <div className="bg-gray-200 p-5 mt-10 rounded-lg">
                <p className="text-xl text-gray-800">
                  {
                    userData?.bio ? userData?.bio : "Usuário não tem biografia configurada no Github"
                  }
                </p>
              </div>
            </div>
                      
            <div className="flex justify-between mt-14 absolute bottom-0">
              {
                userData?.email ?
                <div className="flex items-center text-lg">
                    <span><MdMail/></span>
                    <span className="ml-2">{userData?.email}</span>
                </div> : ''
              }
              {
                userData?.twitter_username ?
                <div className="flex items-center text-lg ml-4">
                    <span><MdClose/></span>
                    <span className="ml-2">{userData?.twitter_username}</span>
                </div> : ''
              }
              {
                userData?.company ?
                <div className="flex items-center text-lg  ml-4">
                    <span><MdApartment/></span>
                    <span className="ml-2">{userData?.company}</span>
                </div> : ''
              }
                 {
                userData?.blog ?
                <div className="flex items-center text-lg  ml-4">
                    <span><MdRssFeed/></span>
                    <span className="ml-2">{userData?.blog}</span>
                </div> : ''
              }
            </div>
		</div>
	)
}
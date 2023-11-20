"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { MdInfo, MdSearch } from "react-icons/md";

interface Repositories {
    name?: string;
    description?: string;
    language?: string;
    link: string ;
  }


export default  function Admin(){
	  
    const [repos, setRepos] = useState<Repositories[]>([]);
    const [totalRepos, setTotalRepos] = useState(0);
    const [userName, setUserName] = useState<string | null>(null);
    const [status, setStatus] = useState(false);
    const [historicPosted, setHistoricPosted] = useState(false);

  useEffect(() => {
    const fetchUserInfo = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const username = urlParams.get('username');

      setUserName(username);

      if (username) {
        fetch('http://127.0.0.1:5000/users/repositories', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        })
          .then(response => {
            if (response.ok) {
              setStatus(true);
              return response.json();
            }
            throw new Error('Falha ao buscar informações do usuário');
          })
          .then(userData => {
            console.log(userData);
            setTotalRepos(userData.repositories.totalRepositories);
            setRepos(userData.repositories.repositories);
            setHistoricPosted(true); 
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

  useEffect(() => {
    if (historicPosted) {
      const postDataToHistoric = () => {
        const data = {
          username: userName,
          status: status,
          repositories: totalRepos,
          sessionUsername: sessionStorage.getItem('sessionUserName') || '',
        };

        fetch('http://127.0.0.1:5000/historic', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Falha ao enviar dados para o histórico');
            }
            return response.json();
          })
          .catch(error => {
            console.error(error);
          });
      };

      postDataToHistoric();
    }
  }, [historicPosted, userName, status, totalRepos]);

	return (
		<div className="flex justify-center flex-col items-center mt-16">
      <div className="flex justify-around w-full">
        <div>
         <span className="flex text-2xl">
            Repositórios do usuário: 
            <Link className="flex items-center" href={`/details?username=${userName}`}>
              <p className="text-yellow-300 ml-4">{userName}</p>
              <MdInfo />
            </Link>
          </span>
          <span>Total repositórios encontrados: {totalRepos}</span>
        </div>
        <Link href={`/admin`}>
          <span className="flex text-2xl items-center"><MdSearch/> Pesquisar</span>     
        </Link>
      </div>
      <div className="mt-10">
        <h2 className="text-center text-2xl">Lista de Repositórios</h2>
        <ul className="mt-10">
          <hr className="my-2" />
          {
           totalRepos > 0 ?
            repos.map((repo, index) => (
              <li key={index} className="mb-4">
                <a href={repo.link} target="_blank">
                  <h3>Titulo: {repo.name}</h3>
                  <p>Descrição: {repo.description ?? 'Sem descrição'}</p>
                  <p>Linguagem: {repo.language ?? 'Não especificada'}</p>
                  <hr className="my-2" />
                </a>
                
              </li>
          ))
          :
          <div>
            <p className="text-red-700 ml-4 text-2xl">Não foi encontrado nenhum repositório para esse usuário tente pesquisar novamente</p>
            <hr className="my-2" />
          </div>    
        }
        </ul>
      </div>     
		</div>
	)
}
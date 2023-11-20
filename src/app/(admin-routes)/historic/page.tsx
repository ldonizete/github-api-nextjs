"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { MdDelete, MdInfo, MdListAlt, MdSearch } from 'react-icons/md';

interface Historics {
    id: number;
    username?: string;
    sessionUsername?: string;
    status?: boolean;
    repositories: number ;
    date: string
  }


export default  function Admin(){
	  
    const [hitoric, setHitoric] = useState<Historics[]>([]);
    const [userName, setUserName] = useState<string | null>(null);


  useEffect(() => {
    const fetchUserInfo = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const username = urlParams.get('username');

      setUserName(username);

      if (username) {
        fetch('http://127.0.0.1:5000/historic/lastTwenty', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`
          },
          
        })
          .then(response => {
            if (response.ok) {
              
              return response.json();
            }
            throw new Error('Falha ao buscar informações do usuário');
          })
          .then(data => {
            setHitoric(data)
            
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

  const filteredHistoric = hitoric.filter(histo => histo.sessionUsername === userName);

  function formatDateTime(dateString: string | number | Date) {
    const formattedDate = new Date(dateString);
  
    const day = formattedDate.getDate();
    const month = formattedDate.getMonth() + 1; 
    const year = formattedDate.getFullYear();
  
    const hours = formattedDate.getHours();
    const minutes = formattedDate.getMinutes();
  
    const formattedDateTime = `${day}/${month}/${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
    return formattedDateTime;
  }

  function deleteItem(id: number) {
    return new Promise((resolve, reject) => {
      fetch(`http://127.0.0.1:5000/historic/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`
        },
      })
      .then(response => {
        if (response.ok) {
          resolve(`Item com ID ${id} deletado com sucesso.`);
        } else {
          reject(`Falha ao deletar o item com ID ${id}.`);
        }
      })
      .catch(error => {
        reject(`Erro ao tentar deletar o item: ${error}`);
      });
    });
  }

  function deleteItemAndUpdateList(id: number) {
    deleteItem(id)
      .then(successMessage => {
        console.log(successMessage);
        const updatedList = hitoric.filter(item => item.id !== id);
        setHitoric(updatedList);
      })
      .catch(errorMessage => console.error(errorMessage));
  }

	return (
		<div className="flex justify-center flex-col items-center mt-16">
      <div className="flex items-center w-full justify-around mb-20">
        <h1 className="text-3xl">Total pesquisado {filteredHistoric.length}</h1>
        <Link href={`/admin`}>
          <span className="flex items-center text-2xl"><MdSearch className="mr-2"/> Pesquisar</span>     
        </Link>
      </div>
      <div>
        <h2 className="text-center text-2xl">Lista de histórico pesquisado</h2>
        <ul className="mt-10">
          <hr className="my-2" />
          {
           filteredHistoric.map((histo, index) => (
              <li key={index} className="mb-4">
                <div className="flex items-center">
                  <div>
                    <div className="flex items-center mb-4">
                      <h1 className="mr-2 text-2xl">{histo.username}</h1>
                      <Link href={`/details?username=${histo.username}`}>
                        <MdInfo/>
                      </Link>
                    </div>
                    <p className="mb-4">Pesquisado às {formatDateTime(histo.date)}  {histo.status ? 'com sucesso' : 'não encontrado'}</p>
                    <div className="flex items-center">
                      <p className="mr-2">Total de repositórios encontrados: {histo.repositories}</p>
                      <Link href={`/repos?username=${histo.username}`}>
				                <MdListAlt/>
			                </Link>
                    </div>                  
                  </div>
                  <button className="flex items-center ml-10" onClick={() => deleteItemAndUpdateList(histo.id)}><MdDelete /> Deletar</button>
                </div>
                <hr className="my-2" />
              </li>
            ))
          }
        </ul>
      </div>     
		</div>
	)
}
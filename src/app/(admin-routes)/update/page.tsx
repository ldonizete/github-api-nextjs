'use client'

import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')

  const router = useRouter()

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()

    const data = {
      userTag: username,
      email: email,
      password: password
    };

    try {
      const response = await fetch(`http://127.0.0.1:5000/users/update/${sessionStorage.getItem('sessionUserNameId')}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // A requisição foi bem-sucedida
        console.log('Usuário criado com sucesso!');
        // Redireciona para a página inicial ('/')
        router.push('/');
      } else {
        // Se a resposta não estiver ok (ex: erro 404, 500 etc.)
        console.error('Falha ao criar usuário');
      }
    } catch (error) {
      console.error('Ocorreu um erro ao processar a requisição:', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl mb-6">Editar Usuário</h1>

      <form className="w-[400px] flex flex-col gap-6" onSubmit={handleSubmit}>
        <input 
          className="h-12 rounded-md p-2 bg-transparent border border-gray-300"
          type="text" 
          name="username" 
          placeholder="Digite seu username do github" 
          onChange={(e) => setUsername(e.target.value)}
        />

        <input 
          className="h-12 rounded-md p-2 bg-transparent border border-gray-300"
          type="text" 
          name="email" 
          placeholder="Digite seu e-mail" 
          onChange={(e) => setEmail(e.target.value)}
        />

        <input 
          className="h-12 rounded-md p-2 bg-transparent border border-gray-300"
          type="password" 
          name="password" 
          placeholder="Digite sua senha" 
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="h-12 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
        >
          Salvar
        </button>
      </form>
    </div>
  )
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Titulo } from "./components";

function Inclusao() {
  const { register, handleSubmit, reset } = useForm();
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function criarNovoTime(data) {
    setCarregando(true);
    try {
      const resposta = await fetch("http://localhost:3000/times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          nomeTime: data.nomeTime,
          trainerId: data.trainerId,
          classe: data.classe,
          genero: data.genero,
          imagem: "/trainers/red.png",
          pokemons: [],
        }),
      });

      if (resposta.ok) {
        const novoTime = await resposta.json();
        // Salva o novo time como ativo e envia para o Home
        localStorage.setItem("timeattivoId", novoTime.id);
        localStorage.setItem("trainerData", JSON.stringify(novoTime));
        localStorage.setItem("team", JSON.stringify(novoTime.pokemons || []));
        alert("Novo time criado com sucesso! Redirecionando...");
        reset();
        // Redireciona para Home com o novo treinador
        navigate("/", { state: { novoTime } });
      } else {
        alert("Erro ao criar o novo time.");
      }
    } catch (erro) {
      console.error("Erro na requisição:", erro);
      alert("Erro ao conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <Titulo />
      <main className="flex flex-col items-center p-6 gap-8">
        <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-gray-200 shadow-md">
          <h2 className="font-bold text-slate-700 text-2xl border-b pb-3 mb-6">Criar Novo Time</h2>

          <form onSubmit={handleSubmit(criarNovoTime)} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Nome do Treinador</label>
              <input
                type="text"
                {...register("nome", { required: "Nome obrigatório" })}
                className="w-full border rounded-lg p-2 mt-1 text-sm bg-slate-50 focus:outline-none focus:border-blue-500 text-gray-700"
                placeholder="Ex: Ash"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Nome do Time</label>
              <input
                type="text"
                {...register("nomeTime", { required: "Nome do time obrigatório" })}
                className="w-full border rounded-lg p-2 mt-1 text-sm bg-slate-50 focus:outline-none focus:border-blue-500 text-gray-700"
                placeholder="Ex: Equipe Indigo"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Trainer ID</label>
                <input
                  type="text"
                  {...register("trainerId")}
                  className="w-full border rounded-lg p-2 mt-1 text-sm bg-slate-50 focus:outline-none focus:border-blue-500 text-gray-700"
                  placeholder="Ex: 00005"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Classe</label>
                <input
                  type="text"
                  {...register("classe")}
                  className="w-full border rounded-lg p-2 mt-1 text-sm bg-slate-50 focus:outline-none focus:border-blue-500 text-gray-700"
                  defaultValue="Treinador"
                  placeholder="Ex: Treinador"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Gênero</label>
              <select
                {...register("genero")}
                className="w-full border rounded-lg p-2 mt-1 text-sm bg-slate-50 focus:outline-none focus:border-blue-500 text-gray-700"
              >
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Não-Binário">Não-Binário</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg text-sm shadow"
            >
              {carregando ? "Criando..." : "Criar Novo Time"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default Inclusao;

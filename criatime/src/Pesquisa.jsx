import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Titulo, CardTime } from "./components";

function Pesquisa() {
  const { register, handleSubmit } = useForm();
  const [times, setTimes] = useState([]);

  async function buscarTodosTimes() {
    try {
      const resposta = await fetch("http://localhost:3000/times");
      if (!resposta.ok) throw new Error("Erro ao consultar os times");
      const dados = await resposta.json();
      setTimes(dados);
    } catch (erro) {
      console.log("Erro: ", erro.message);
    }
  }

  useEffect(() => {
    buscarTodosTimes();
  }, []);

  async function pesquisaTimes(data) {
    try {
      const resposta = await fetch("http://localhost:3000/times");
      if (!resposta.ok) throw new Error("Erro ao consultar os times");
      const dados = await resposta.json();
      const filtro = data.pesquisa.toUpperCase();
      const dados2 = dados.filter(
        (time) =>
          time.nome.toUpperCase().includes(filtro) ||
          time.nomeTime.toUpperCase().includes(filtro) ||
          (time.genero && time.genero.toUpperCase().includes(filtro)) ||
          (time.pokemons && time.pokemons.some((poke) => poke.name.toUpperCase().includes(filtro))),
      );
      if (dados2.length === 0) {
        alert("Não há times com a palavra-chave no nome, time, gênero ou pokémon");
      } else {
        setTimes(dados2);
      }
    } catch (erro) {
      console.log("Erro: ", erro.message);
    }
  }

  const listaTimes = times.map((time) => <CardTime key={time.id} treinador={time} time={time.pokemons || []} />);

  return (
    <>
      <Titulo />
      <h2 className="text-2xl my-2 p-3 font-bold">Pesquisa de Times</h2>
      <form className="text-center" onSubmit={handleSubmit(pesquisaTimes)}>
        <input
          type="text"
          className="text-sm w-96 rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-violet-200"
          required
          placeholder="Palavra chave do título ou gênero"
          {...register("pesquisa")}
        />
        <input
          type="submit"
          value="Pesquisar"
          className="p-3 border-0 text-white text-sm font-bold cursor-pointer rounded-lg bg-violet-700 ml-2"
        />
      </form>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3 p-3">{listaTimes}</section>
    </>
  );
}

export default Pesquisa;

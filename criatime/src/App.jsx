import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CardTime, Titulo } from "./components";

const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  ice: "#98D8D8",
  fight: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
  default: "#777777",
};

function App() {
  const getTrainerImagePath = (imagem) => {
    if (!imagem) return "/trainers/red.png";
    if (imagem.startsWith("/trainers/")) return imagem;
    if (imagem.startsWith("http://") || imagem.startsWith("https://")) return imagem;
    return `/trainers/${imagem}`;
  };

  const location = useLocation();
  const [pokemon, setPokemon] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [imagemTreinador, setImagemTreinador] = useState([]);

  const [treinador, setTreinador] = useState(() => {
    const novoTime = location.state?.novoTime;
    if (novoTime) {
      return { ...novoTime, imagem: getTrainerImagePath(novoTime.imagem) };
    }
    const stored = localStorage.getItem("trainerData");
    const timeattivoId = localStorage.getItem("timeattivoId") || "1";

    if (stored) {
      try {
        const dadosLocais = JSON.parse(stored);
        if (String(dadosLocais.id) === String(timeattivoId)) {
          return { ...dadosLocais, imagem: getTrainerImagePath(dadosLocais.imagem) };
        }
      } catch (error) {
        console.error("Erro ao ler trainerData do localStorage:", error);
      }
    }

    return {
      id: 1,
      nome: "",
      nomeTime: "",
      genero: "Masculino",
      classe: "Treinador",
      trainerId: "",
      imagem: "/trainers/red.png",
      pokemons: [],
    };
  });

  const [team, setTeam] = useState(() => {
    const novoTime = location.state?.novoTime;
    if (novoTime) {
      return novoTime.pokemons || [];
    }
    const stored = localStorage.getItem("trainerData");
    if (stored) {
      try {
        const dadosLocais = JSON.parse(stored);
        return dadosLocais.pokemons || [];
      } catch (error) {
        console.error("Erro ao ler team do localStorage:", error);
      }
    }
    return [];
  });

  useEffect(() => {
    const timeattivoId = location.state?.novoTime?.id || localStorage.getItem("timeattivoId") || "1";

    async function carregarDadosIniciais() {
      try {
        const resPokemon = await fetch("http://localhost:3000/pokedex");
        const dadosPokemon = await resPokemon.json();
        setPokemon(dadosPokemon);

        if (location.state?.novoTime) {
          setTreinador({ ...location.state.novoTime, imagem: getTrainerImagePath(location.state.novoTime.imagem) });
          setTeam(location.state.novoTime.pokemons || []);
          return;
        }

        const resTreinador = await fetch(`http://localhost:3000/times/${timeattivoId}`);
        if (resTreinador.ok) {
          const dadosTreinador = await resTreinador.json();
          if (dadosTreinador && dadosTreinador.nome) {
            setTreinador({ ...dadosTreinador, imagem: getTrainerImagePath(dadosTreinador.imagem) });
            setTeam(dadosTreinador.pokemons || []);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do servidor:", error);
      }
    }
    carregarDadosIniciais();
  }, [location.state]);

  useEffect(() => {
    async function carregarImagensTreinador() {
      try {
        const resposta = await fetch("/trainers/trainerList.json");
        if (!resposta.ok) return;
        const lista = await resposta.json();
        setImagemTreinador(lista);
      } catch (error) {
        console.error("Erro ao carregar lista de trainers:", error);
      }
    }
    carregarImagensTreinador();
  }, []);

  const handleTrainerImageChange = (imagem) => {
    setTreinador({ ...treinador, imagem: getTrainerImagePath(imagem) });
  };

  useEffect(() => {
    const dadosParaSalvar = { ...treinador, pokemons: team };
    localStorage.setItem("trainerData", JSON.stringify(dadosParaSalvar));
    localStorage.setItem("team", JSON.stringify(team));
    localStorage.setItem("timeattivoId", String(dadosParaSalvar.id || 1));
  }, [team, treinador]);

  const salvarTreinador = async (e) => {
    e.preventDefault();
    try {
      const treinadorParaSalvar = {
        ...treinador,
        pokemons: team,
        id: treinador.id || parseInt(localStorage.getItem("timeattivoId") || "1"),
      };

      const resposta = await fetch(`http://localhost:3000/times/${treinadorParaSalvar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(treinadorParaSalvar),
      });
      if (resposta.ok) {
        localStorage.setItem("trainerData", JSON.stringify(treinadorParaSalvar));
        localStorage.setItem("team", JSON.stringify(treinadorParaSalvar.pokemons));
        localStorage.setItem("timeattivoId", String(treinadorParaSalvar.id));
        alert("Dados do treinador salvos no db.json com sucesso!");
      } else {
        alert("Erro ao salvar os dados no servidor.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const addToTeam = (poke) => {
    if (team.length >= 6) return alert("Seu time já está cheio (máximo 6)!");
    if (team.some((p) => p.number === poke.number)) return alert("Esse Pokémon já está no time!");
    setTeam([...team, poke]);
  };

  const removeFromTeam = (pokeNumber) => {
    setTeam(team.filter((p) => p.number !== pokeNumber));
  };

  const getTypeColor = (type) => {
    let t = type?.toLowerCase();
    if (t === "fight") t = "fight";
    return typeColors[t] ?? typeColors.default;
  };

  const pokemonFiltrados = pokemon.filter((poke) => {
    const termo = termoBusca.toLowerCase();
    return (
      poke.name.toLowerCase().includes(termo) ||
      poke.type1.toLowerCase().includes(termo) ||
      (poke.type2 && poke.type2.toLowerCase().includes(termo))
    );
  });

  const listaPokemon = pokemonFiltrados.map((poke) => {
    const background = poke.type2
      ? `linear-gradient(${getTypeColor(poke.type1)}, ${getTypeColor(poke.type2)})`
      : getTypeColor(poke.type1);

    return (
      <div
        key={poke.number}
        className="flex flex-col justify-center items-center p-4 text-white font-semibold rounded-2xl w-full max-w-40 text-sm shadow-md transition-transform hover:-translate-y-1"
        style={{ background }}
      >
        <p className="text-xs opacity-75">#{poke.number}</p>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.number}.png`}
          alt={poke.name}
          className="w-20 h-20 object-contain"
        />
        <p className="capitalize truncate w-full text-center">{poke.name}</p>
        <p className="text-[10px] text-white/80 uppercase tracking-wider mt-1 text-center">
          {poke.type2 ? `${poke.type1} / ${poke.type2}` : poke.type1}
        </p>
        <button
          onClick={() => addToTeam(poke)}
          className="mt-2 w-full bg-white/20 hover:bg-white/40 text-white text-xs py-1 rounded-lg font-bold transition-colors"
        >
          Selecionar
        </button>
      </div>
    );
  });

  return (
    <div className="bg-slate-100 min-h-screen font-sans">
      <Titulo termoBusca={termoBusca} setTermoBusca={setTermoBusca} />

      <main className="flex flex-col items-center p-6 gap-8">
        <section className="flex flex-col md:flex-row gap-6 w-full max-w-6xl items-start justify-center">
          <form
            onSubmit={salvarTreinador}
            className="w-full md:w-1/2 lg:w-1/3 bg-white p-5 rounded-2xl border border-gray-200 shadow-md flex flex-col gap-3"
          >
            <h3 className="font-bold text-slate-700 text-lg border-b pb-2 mb-1">Registro de Licença</h3>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Nome do Treinador</label>
              <input
                type="text"
                value={treinador.nome}
                onChange={(e) => setTreinador({ ...treinador, nome: e.target.value })}
                className="w-full border rounded-lg p-2 mt-1 text-sm bg-slate-50 focus:outline-none focus:border-blue-500 text-gray-700"
                placeholder="Ex: Red"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Nome do Time</label>
              <input
                type="text"
                value={treinador.nomeTime}
                onChange={(e) => setTreinador({ ...treinador, nomeTime: e.target.value })}
                className="w-full border rounded-lg p-2 mt-1 text-sm bg-slate-50 focus:outline-none focus:border-blue-500 text-gray-700"
                placeholder="Ex: Os Pesados de Kanto"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Trainer ID</label>
                <input
                  type="text"
                  value={treinador.trainerId}
                  onChange={(e) => setTreinador({ ...treinador, trainerId: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1 text-sm bg-slate-50 focus:outline-none focus:border-blue-500 text-gray-700"
                  placeholder="Ex: 00001"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Classe</label>
                <input
                  type="text"
                  value={treinador.classe}
                  onChange={(e) => setTreinador({ ...treinador, classe: e.target.value })}
                  className="w-full border rounded-lg p-2 mt-1 text-sm bg-slate-50 focus:outline-none focus:border-blue-500 text-gray-700"
                  placeholder="Ex: Elite Four"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Gênero</label>
              <select
                value={treinador.genero}
                onChange={(e) => setTreinador({ ...treinador, genero: e.target.value })}
                className="w-full border rounded-lg p-2 mt-1 text-sm bg-slate-50 focus:outline-none focus:border-blue-500 text-gray-700"
              >
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Não-Binário">Não-Binário</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-sm shadow transformation-colors"
            >
              Emitir Cartão de Treinador
            </button>
          </form>

          <div className="w-full md:w-1/2 lg:w-2/3 flex justify-center">
            <CardTime
              treinador={treinador}
              time={team}
              onRemovePokemon={removeFromTeam}
              trainerImages={imagemTreinador}
              onTrainerImageChange={handleTrainerImageChange}
            />
          </div>
        </section>

        <h2 className="font-extrabold text-xl text-slate-700 border-t w-full max-w-6xl pt-6 text-center tracking-wide uppercase">
          Escolha Seus Membros
        </h2>
        <section className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-items-center w-full max-w-6xl pb-12">
          {listaPokemon}
        </section>
      </main>
    </div>
  );
}

export default App;

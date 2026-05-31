import { useState } from "react";

const getTrainerImagePath = (imagem) => {
  if (!imagem) return "/trainers/red.png";
  if (imagem.startsWith("/trainers/")) return imagem;
  if (imagem.startsWith("http://") || imagem.startsWith("https://")) return imagem;
  return `/trainers/${imagem}`;
};

export default function CardTime({ treinador, time, onRemovePokemon, trainerImages = [], onTrainerImageChange }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const slots = Array.from({ length: 6 }, (_, index) => time[index] || null);
  const filledSlots = time.filter(Boolean).length;
  const availableSlots = 6 - filledSlots;

  const pokemonAce = time[0] || null;

  return (
    <div className="w-full max-w-2xl bg-slate-800 text-white border-4 border-slate-700 rounded-3xl shadow-2xl p-6 relative overflow-hidden font-sans">
      <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-slate-700/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center border-b-2 border-slate-700 pb-3 mb-4">
        <h2 className="text-2xl font-black tracking-wide text-yellow-400 uppercase">
          {treinador.nomeTime || "Nome do Time"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
        <div className="flex flex-col items-center justify-center bg-slate-800 p-2 rounded-xl border border-slate-700 min-h-30">
          {treinador.imagem ? (
            <button
              type="button"
              onClick={() => setPickerOpen((open) => !open)}
              className="inline-flex flex-col items-center gap-2 focus:outline-none"
            >
              <img
                src={getTrainerImagePath(treinador.imagem)}
                alt={treinador.nome}
                className="w-24 h-24 object-contain pixelated"
              />
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Clique para trocar</span>
            </button>
          ) : (
            <div className="text-slate-500 text-xs text-center">Sem Foto</div>
          )}

          {pickerOpen && trainerImages.length > 0 && (
            <div className="mt-3 w-full max-w-[18rem] max-h-64 overflow-y-auto p-2 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-inner">
              <div className="grid grid-cols-4 gap-2">
                {trainerImages.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => {
                      onTrainerImageChange?.(img);
                      setPickerOpen(false);
                    }}
                    className="rounded-xl overflow-hidden border border-slate-700 hover:border-yellow-400"
                  >
                    <img
                      src={getTrainerImagePath(img)}
                      alt={img.replace(/\.(png|jpg|jpeg)$/, "")}
                      className="w-full h-16 object-contain bg-slate-800"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-2 flex flex-col justify-between gap-1 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Treinador</p>
              <p className="text-base font-semibold text-slate-200 capitalize">{treinador.nome || "---"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Trainer ID</p>
              <p className="text-base font-mono font-semibold text-red-400">ID: {treinador.trainerId || "00000"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Classe</p>
              <p className="text-sm text-slate-300 capitalize">{treinador.classe || "---"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Gênero</p>
              <p className="text-sm text-slate-300 capitalize">{treinador.genero || "---"}</p>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-700 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded text-[10px] font-bold uppercase tracking-wider">
              Pokémon Ace
            </span>
            <p className="text-sm font-bold text-yellow-400 capitalize">
              {pokemonAce ? pokemonAce.name : "Nenhum ainda"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 p-4 bg-slate-900/70 rounded-3xl border border-slate-700">
        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-3">Resumo do Time</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-200">
          <div className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700">
            <p className="text-[10px] uppercase text-slate-400 tracking-wider">Pokémons no time</p>
            <p className="font-bold text-lg">{filledSlots} de 6</p>
          </div>
          <div className="rounded-2xl bg-slate-800/80 p-3 border border-slate-700">
            <p className="text-[10px] uppercase text-slate-400 tracking-wider">Slots disponíveis</p>
            <p className="font-bold text-lg">{availableSlots}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Sua Equipe</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 justify-items-center">
          {slots.map((pokemon, index) => {
            if (pokemon) {
              const isAce = index === 0;

              return (
                <div
                  key={`${pokemon.number}-${index}`}
                  className={`flex flex-col items-center bg-slate-900 p-2 rounded-xl border relative group w-full transition-all hover:scale-105 ${
                    isAce ? "border-yellow-400 shadow-md shadow-yellow-500/10" : "border-slate-700"
                  }`}
                >
                  {isAce && (
                    <span className="absolute -top-2 bg-yellow-400 text-slate-900 text-[8px] font-black px-1 rounded-sm shadow-sm uppercase tracking-tight z-10">
                      ★ ACE
                    </span>
                  )}

                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.number}.png`}
                    alt={pokemon.name}
                    className="w-16 h-16 object-contain"
                  />
                  <p className="text-[10px] font-bold text-slate-300 truncate w-full text-center capitalize">
                    {pokemon.name}
                  </p>
                  <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-1 text-center">
                    {pokemon.type2 ? `${pokemon.type1} / ${pokemon.type2}` : pokemon.type1}
                  </p>

                  <button
                    onClick={() => onRemovePokemon(pokemon.number)}
                    className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="Remover do time"
                  >
                    ✕
                  </button>
                </div>
              );
            }

            return (
              <div
                key={`empty-${index}`}
                className="w-full aspect-3/4 sm:h-24 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center bg-slate-900/30"
              >
                <div className="w-6 h-6 rounded-full border-2 border-slate-700/50 relative before:content-[''] before:absolute before:w-full before:h-0.5 before:bg-slate-700/50 before:top-1/2 before:-translate-y-1/2"></div>
                <p className="text-[9px] text-slate-500 font-medium mt-1">Vazio</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

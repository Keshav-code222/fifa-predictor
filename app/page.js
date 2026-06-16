export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-400 mb-2">⚽ FIFA World Cup Predictor</h1>
          <p className="text-gray-400">Enter the official lineups and get an AI powered match prediction</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          
          <div className="bg-gray-900 rounded-2xl p-5">
            <h2 className="text-green-400 font-semibold mb-3">Team 1</h2>
            <input
              className="w-full bg-gray-800 rounded-lg p-3 text-white placeholder-gray-500 mb-3"
              placeholder="Country name e.g. Brazil"
            />
            <textarea
              className="w-full bg-gray-800 rounded-lg p-3 text-white placeholder-gray-500 h-40"
              placeholder="Starting XI, one player per line"
            />
          </div>

          <div className="bg-gray-900 rounded-2xl p-5">
            <h2 className="text-green-400 font-semibold mb-3">Team 2</h2>
            <input
              className="w-full bg-gray-800 rounded-lg p-3 text-white placeholder-gray-500 mb-3"
              placeholder="Country name e.g. Argentina"
            />
            <textarea
              className="w-full bg-gray-800 rounded-lg p-3 text-white placeholder-gray-500 h-40"
              placeholder="Starting XI, one player per line"
            />
          </div>

        </div>

        <button className="w-full mt-6 bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl transition-colors">
          Predict Match
        </button>

      </div>

    </main>
  )
}
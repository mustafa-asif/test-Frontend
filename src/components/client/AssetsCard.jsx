export const AssetsCard = () => {
    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 p-5 shadow-lg rounded-xl"
            style={{ "boxShadow": "0px 0px 30px rgba(16, 185, 129, 0.1), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.2)" }}>
            <h2 className="text-gray-700 text-xl font-semibold">{"Bénéfices"}</h2>
            <p className="p-3 text-gray-800">
                20 commandes → 40 dh<br />
                50 commandes → 60 dh<br />
                100 commandes → 100 dh<br />
                500 commandes → 300 dh<br />
                1000 commandes → 500 dh<br />
                2000 commandes → 1000 dh<br />
                <span className="text-green-500 text-lg font-semibold">Bénéfice total → 2000 dh</span>
            </p>

            <h2 className="text-gray-700 text-lg font-semibold">{"Ressources"}</h2>
            <p className="text-gray-500 p-3">les ressources utiles à utiliser en marketing (images, vidéos, scripts...) seront partagées ici</p>
        </div>
    );
};
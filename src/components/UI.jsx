import React, { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { instruments } from '../data/instruments';
import GameScene from './GameScene';

export const StartScreen = () => null; // Skipped

export const MenuScreen = () => {
    const setMode = useGameStore(s => s.setMode);

    // Pick random instrument for display
    const randomInstrument = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * instruments.length);
        return instruments[randomIndex];
    }, []);

    return (
        <div className="flex h-full w-full animate-fade-in pointer-events-none">
            {/* Left Side: Menu */}
            <div className="w-1/2 h-full flex flex-col justify-center z-10 pointer-events-auto" style={{ paddingLeft: '10rem' }}>
                <h1 className="text-4xl font-black text-slate-700 tracking-tight leading-none mb-8 uppercase max-w-md mikalea-title" style={{ paddingLeft: '16px' }}>
                    TEBAK ALAT MUSIK<br />TRADISIONAL
                </h1>

                <div className="flex flex-col gap-2 items-start">
                    <button onClick={() => setMode('audio')} className="btn-menu">SUARA</button>
                    <button onClick={() => setMode('visual')} className="btn-menu">GAMBAR</button>
                    <button onClick={() => setMode('dual')} className="btn-menu">SUARA DAN GAMBAR</button>
                    <button onClick={() => useGameStore.getState().openAbout()} className="btn-menu">TENTANG</button>
                </div>
            </div>

            {/* Right Side: 3D Visualization */}
            <div className="w-1/2 h-full relative z-0">
                <div className="absolute inset-0">
                    <GameScene
                        key={randomInstrument.id}
                        modelPath={randomInstrument.modelPath}
                        scale={randomInstrument.scale * 0.8}
                    />
                </div>
            </div>
        </div>
    );
};

export const GameScreen = ({ children }) => {
    const { questions, currentQuestionIndex, submitAnswer, returnToMenu, score } = useGameStore();
    const currentQuestion = questions[currentQuestionIndex];

    const options = useMemo(() => {
        if (!currentQuestion) return [];
        const otherOptions = questions.filter(q => q.id !== currentQuestion.id);
        const shuffledOthers = otherOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
        return [...shuffledOthers, currentQuestion].sort(() => 0.5 - Math.random());
    }, [currentQuestion]);

    if (!currentQuestion) return null;

    return (
        <div className="h-full flex flex-col relative w-full pointer-events-none">
            {/* Top Bar - Minimalist */}
            <div className="absolute top-0 left-0 right-0 p-8 pointer-events-auto" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <button onClick={returnToMenu} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    backgroundColor: '#a94600',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'absolute',
                    left: '2rem',
                    top: '2rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(169, 70, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#8a3a00';
                    e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#a94600';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
                >
                    BACK
                </button>
                <div className="font-normal text-3xl tracking-widest uppercase" style={{ color: '#334155', textAlign: 'center' }}>
                    SCORE: {score}
                </div>
            </div>

            {/* Middle Spacer for 3D Model */}
            <div style={{ flex: 1 }}></div>

            {/* Bottom Panel - Solid Box */}
            <div className="w-full pointer-events-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '1rem 2rem 2rem 2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', maxWidth: '56rem' }}>
                    <h3 className="text-center text-3xl font-bold mb-8" style={{ color: '#ECB248', marginBottom: '3rem' }}>
                        PILIH ALAT MUSIK YANG TEPAT
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.5rem 8rem', /* Reduced gap to bring items closer to center if needed, or keeping it wide but centered */
                        width: '100%',
                        maxWidth: '48rem',
                        justifyContent: 'center',
                        margin: '0 auto'
                    }}>
                        {options.map((opt, idx) => (
                            <button
                                key={opt.id}
                                onClick={() => submitAnswer(opt.id)}
                                className="text-center text-4xl font-bold py-2 transition-colors"
                                style={{
                                    color: 'white',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fed7aa'}
                                onMouseLeave={(e) => e.target.style.color = 'white'}
                            >
                                {opt.name.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const FeedbackScreen = () => {
    const { questions, currentQuestionIndex, nextQuestion, feedbackStatus, isCorrect } = useGameStore(); // isCorrect added in store update
    const currentQuestion = questions[currentQuestionIndex];
    // Fallback if isCorrect is null (legacy support if needed, but store was updated)
    const correctlyAnswered = isCorrect === true || feedbackStatus === 'correct';

    return (
        <div className="flex items-center justify-center h-full w-full animate-fade-in pointer-events-auto">
            <div style={{
                width: '600px',
                maxWidth: '90%',
                backgroundColor: 'white',
                borderRadius: '0', // Image looks like sharp or slight radius, keeping simple
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    backgroundColor: correctlyAnswered ? '#74d174' : '#d26b6b', // Soft Green / Red 
                    padding: '1rem',
                    textAlign: 'center'
                }}>
                    <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.8rem', margin: 0 }}>
                        {correctlyAnswered ? 'Benar' : 'Salah'}
                    </h2>
                </div>

                {/* Body */}
                <div style={{ padding: '2rem 3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '200px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#333', fontWeight: 'normal' }}>
                        {currentQuestion.name}
                    </h3>

                    <p style={{ margin: 0, color: '#444', fontSize: '1.1rem', lineHeight: '1.5' }}>
                        {currentQuestion.description}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <strong style={{ color: '#333' }}>Asal :</strong>
                        <span style={{ color: '#555' }}>{currentQuestion.origin}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <strong style={{ color: '#333' }}>Fun Fact :</strong>
                        <span style={{ color: '#555' }}>{currentQuestion.funFact}</span>
                    </div>

                    {/* Spacer to push button down if needed, but flex gap handles it */}

                    {/* Button */}
                    <div style={{ alignSelf: 'flex-end', marginTop: 'auto', paddingTop: '1rem' }}>
                        <button
                            onClick={nextQuestion}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#666',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            className="hover:text-black transition-colors"
                        >
                            selanjutnya &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const GameOverScreen = () => {
    const { score, restartGame, returnToMenu } = useGameStore();
    return (
        <div className="flex flex-col items-center justify-center h-full animate-fade-in w-full pointer-events-auto">
            <div style={{
                backgroundColor: 'white',
                padding: '3rem 4rem',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h2 className="text-2xl font-black mb-6 tracking-widest text-black uppercase">TOTAL SCORE</h2>
                {/* Enlarged Score */}
                <div className="font-bold mb-12" style={{ color: '#32D74B', fontSize: '6rem', lineHeight: '1' }}>{score}</div>

                <div className="w-full flex flex-col gap-4 items-center text-gray-400 text-xl font-medium">
                    <button
                        onClick={restartGame}
                        style={{
                            backgroundColor: '#a94600',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '1rem 3rem',
                            borderRadius: '50px',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(169, 70, 0, 0.3)',
                            minWidth: '250px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#8a3a00';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#a94600';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        RESTART
                    </button>
                    <button
                        onClick={returnToMenu}
                        style={{
                            backgroundColor: '#a94600',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '1rem 3rem',
                            borderRadius: '50px',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(169, 70, 0, 0.3)',
                            minWidth: '250px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#8a3a00';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#a94600';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        MENU
                    </button>
                </div>
            </div>
        </div>
    );
};
export const AboutScreen = () => {
    const returnToMenu = useGameStore(s => s.returnToMenu);
    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            zIndex: 50,
            pointerEvents: 'auto',
            backgroundImage: 'url("/assets/images/background.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            {/* Back Button */}
            <button onClick={returnToMenu} style={{
                position: 'fixed',
                top: '2rem',
                left: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#a94600',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(169, 70, 0, 0.3)',
                zIndex: 51
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#8a3a00';
                e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#a94600';
                e.currentTarget.style.transform = 'scale(1)';
            }}
            >
                BACK
            </button>

            {/* Content */}
            <div style={{ 
                width: '100%', 
                maxWidth: '700px', 
                textAlign: 'center',
                padding: '4rem 3rem 2rem 3rem'
            }}>
                <h2 className="text-3xl font-black mb-6 text-slate-800 uppercase border-b-2 border-slate-200 pb-4">TENTANG</h2>

                <h3 className="text-xl font-bold mb-2 text-slate-700">Mini Game "Menebak Alat Musik Tradisional"</h3>
                <p className="mb-4 text-slate-600 leading-relaxed">
                    Sebuah permainan interaktif berbasis web untuk menebak alat musik tradisional Indonesia, dibangun dengan React, Three.js, dan teknologi web modern.
                </p>
                <p className="mb-6 text-slate-600 leading-relaxed">
                    Aplikasi ini bersifat edukatif dan menghibur, membantu pengguna mempelajari alat musik tradisional Indonesia melalui pengalaman 3D yang interaktif.
                </p>

                <h4 className="text-lg font-bold mb-2 text-slate-700">Fitur Utama</h4>
                <div className="list-disc list-inside mb-6 text-slate-600 space-y-1 inline-block">
                    <p>Visualisasi 3D Interaktif (Three.js & React Three Fiber)</p>
                    <p>Animasi Halus (Framer Motion)</p>
                    <p>Manajemen State (Zustand)</p>
                    <p>Desain Responsif</p>
                    <p>Konten Edukatif Warisan Budaya</p>
                </div>

                <h4 className="text-lg font-bold mb-2 text-slate-700 mt-6">Kredit Aset 3D</h4>
                <div className="text-sm text-slate-500 mb-8 space-y-1">
                    <p>"Gendang Bulo" (https://skfb.ly/oBU9H) by WandrModeling (CC BY 4.0)</p>
                    <p>"Kecapi" (https://skfb.ly/oPtPo) by NandaAyu (CC BY 4.0)</p>
                    <p>"Framed Gong" (https://skfb.ly/onXAC) by tewlwolow (CC BY-NC 4.0)</p>
                    <p>"Suling" (https://skfb.ly/oQsrC) by Sya_asyaaaa (CC BY 4.0)</p>
                </div>

                <h4 className="text-lg font-bold mb-2 text-slate-700">Kontributor</h4>
                <div className="list-disc list-inside mb-8 text-slate-600 inline-block">
                    <p>Airin Tenriani</p>
                    <p>Putra Ramadhani Makmur</p>
                    <p>Farel Anugrah Tandilino</p>
                </div>
            </div>
        </div>
    );
};

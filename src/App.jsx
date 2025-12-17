import React from 'react';
import { useGameStore } from './store/gameStore';
import GameScene from './components/GameScene';
import { StartScreen, MenuScreen, GameScreen, FeedbackScreen, GameOverScreen, AboutScreen } from './components/UI';

function App() {
    const { gameState, questions, currentQuestionIndex, feedbackStatus, mode } = useGameStore();
    const currentInstrument = questions[currentQuestionIndex];
    const bgMusicRef = React.useRef(null);
    const [showVolumeSlider, setShowVolumeSlider] = React.useState(false);
    const [volume, setVolume] = React.useState(0.3);

    // Control background music based on game state and mode
    React.useEffect(() => {
        if (bgMusicRef.current) {
            // Set volume from state
            bgMusicRef.current.volume = volume;

            // Mute when in audio mode during playing state, otherwise unmute
            if (gameState === 'playing' && mode === 'audio') {
                bgMusicRef.current.muted = true;
            } else if (gameState === 'playing' || gameState === 'feedback' || gameState === 'menu') {
                bgMusicRef.current.muted = false;
                // Force play if not playing
                if (bgMusicRef.current.paused) {
                    bgMusicRef.current.play().catch(e => console.log("Audio play failed:", e));
                }
            } else {
                // Pause music when not in game
                bgMusicRef.current.pause();
                bgMusicRef.current.currentTime = 0;
            }
        }
    }, [gameState, mode, volume]);

    const showModel = React.useMemo(() => {
        if (gameState === 'start' || gameState === 'menu' || gameState === 'finished') return false;
        if (!currentInstrument) return false;

        if (gameState === 'playing') {
            return currentInstrument.type === 'visual' || currentInstrument.type === 'dual';
        }

        if (gameState === 'feedback') {
            return true;
        }

        return false;
    }, [gameState, currentInstrument]);

    return (
        <div className="relative w-full h-screen">
            {/* Background 3D Layer */}
            <div className="absolute inset-0 z-0">
                {showModel && (
                    <div className={`w-full h-full transition-all duration-500 ${gameState === 'feedback' ? 'scale-75 translate-y-[-10%]' : ''}`}>
                        <GameScene
                            key={currentInstrument?.id}
                            modelPath={currentInstrument?.modelPath}
                            scale={currentInstrument?.scale || 1}
                        />
                    </div>
                )}
            </div>



            {/* Audio Player (Invisible, for Audio or Dual mode) */}
            {gameState === 'playing' && (currentInstrument?.type === 'audio' || currentInstrument?.type === 'dual') && (
                <audio src={currentInstrument.audioPath} autoPlay loop className="hidden" />
            )}

            {/* Background Music */}
            <audio
                ref={bgMusicRef}
                src="assets/images/backsound.mp3"
                autoPlay
                loop
                className="hidden"
            />

            {/* UI Layer */}
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                {gameState === 'start' && <StartScreen />}
                {gameState === 'menu' && <MenuScreen />}
                {gameState === 'about' && <AboutScreen />}
                {gameState === 'playing' && <GameScreen />}
                {gameState === 'feedback' && <FeedbackScreen />}
                {gameState === 'finished' && <GameOverScreen />}
            </div>

            {/* Volume Control Button - Always visible unless in audio mode */}
            {mode !== 'audio' && (
                <div
                    className="absolute pointer-events-auto"
                    style={{
                        top: '39rem',
                        left: '2rem',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}
                >
                    <button
                        onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            width: '60px',
                            height: '60px',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            transition: 'all 0.2s',
                            zIndex: 9999
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'}
                    >
                        <img
                            src="assets/images/volume.png"
                            alt="Volume"
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                        />
                    </button>

                    {/* Volume Slider */}
                    {showVolumeSlider && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            padding: '0.5rem 1rem',
                            borderRadius: '50px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            animation: 'slideInRight 0.3s ease-out',
                            zIndex: 9999
                        }}>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="volume-slider"
                                style={{
                                    width: '150px',
                                    height: '6px',
                                    cursor: 'pointer'
                                }}
                            />
                            <span style={{
                                fontSize: '0.9rem',
                                color: '#333',
                                fontWeight: '600',
                                minWidth: '35px'
                            }}>
                                {Math.round(volume * 100)}%
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;

import { create } from 'zustand';
import { instruments } from '../data/instruments';

function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export const useGameStore = create((set, get) => ({
    gameState: 'menu', // 'start', 'menu', 'playing', 'feedback', 'finished'
    mode: null, // 'visual', 'audio', 'dual'
    score: 0,
    currentQuestionIndex: 0,
    questions: [],
    questionStartTime: 0,
    isCorrect: null, // 'correct', 'incorrect', null

    startGame: () => set({ gameState: 'menu' }),
    openAbout: () => set({ gameState: 'about' }),

    setMode: (mode) => {
        let shuffled = shuffle(instruments);
        if (mode === 'dual') {
            shuffled = shuffled.map(q => ({ ...q, type: 'dual' }));
        } else {
            shuffled = shuffled.map(q => ({ ...q, type: mode }));
        }

        set({
            mode,
            questions: shuffled,
            currentQuestionIndex: 0,
            score: 0,
            gameState: 'playing',
            questionStartTime: Date.now(),
            isCorrect: null
        });
    },

    submitAnswer: (answerId) => {
        const { questions, currentQuestionIndex, score, gameState } = get();
        const currentQuestion = questions[currentQuestionIndex];

        if (gameState !== 'playing') return;

        if (currentQuestion.id === answerId) {
            // Calculate Score
            let points = 10; // Default min score

            // Apply dynamic scoring for Visual and Dual modes (as requested)
            if (currentQuestion.type === 'visual' || currentQuestion.type === 'dual') {
                const startTime = get().questionStartTime || Date.now();
                const elapsed = Date.now() - startTime;
                const timeWindow = 5000; // 5 seconds

                if (elapsed < timeWindow) {
                    // Linear interpolation: 0ms = 100pts, 5000ms = 10pts
                    const bonus = Math.floor(90 * ((timeWindow - elapsed) / timeWindow));
                    points = 10 + bonus;
                }
            } else {
                points = 10; // Standard score for audio only
            }

            set({ score: score + points, gameState: 'feedback', isCorrect: true });
        } else {
            set({ gameState: 'feedback', isCorrect: false });
        }

        // Delay next question REMOVED. Waiting for manual trigger.
    },

    nextQuestion: () => {
        // This function is now largely replaced by the setTimeout in submitAnswer
        // However, if there's a path to call nextQuestion directly (e.g., skip),
        // it should still handle state transitions.
        const { questions, currentQuestionIndex } = get();
        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex >= questions.length) {
            set({ gameState: 'finished' });
        } else {
            set({
                currentQuestionIndex: nextIndex,
                gameState: 'playing',
                questionStartTime: Date.now(), // Ensure timer is set if called directly
                isCorrect: null
            });
        }
    },

    returnToMenu: () => set({ gameState: 'menu', score: 0, currentQuestionIndex: 0, mode: null, questionStartTime: null, isCorrect: null }),

    restartGame: () => {
        const { mode } = get();
        if (mode) {
            get().setMode(mode);
        } else {
            set({ gameState: 'menu', score: 0, currentQuestionIndex: 0, mode: null });
        }
    }
}));

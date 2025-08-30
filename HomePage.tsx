
import React from 'react';

interface HomePageProps {
    onGetStarted: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center p-4 text-white font-sans">
            <div className="text-center max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                    Welcome to Office Pal
                </h1>
                <p className="text-lg md:text-xl text-indigo-200 mb-8 max-w-lg mx-auto">
                    Tired of awkward small talk by the coffee machine? Connect with colleagues who share your real interests, from rock climbing to retro board games.
                </p>
                <button
                    onClick={onGetStarted}
                    className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-300"
                >
                    Get Started
                </button>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/20">
                    <h3 className="text-xl font-bold mb-2">Discover</h3>
                    <p className="text-indigo-200 text-sm">Find people in your building with similar hobbies and passions.</p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/20">
                    <h3 className="text-xl font-bold mb-2">Match</h3>
                    <p className="text-indigo-200 text-sm">Anonymously like profiles. If they like you back, it's a match!</p>
                </div>
                 <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/20">
                    <h3 className="text-xl font-bold mb-2">Connect</h3>
                    <p className="text-indigo-200 text-sm">Chat with your matches using our AI-powered icebreakers.</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

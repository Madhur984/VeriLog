import { Button } from '../components/ui/button';
import { User, UserPlus, CheckCircle } from 'lucide-react';

export const LoginScreen = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-background-primary relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-5" />
            <div className="z-10 flex flex-col items-center gap-8 bg-background-secondary/80 p-12 rounded-3xl border border-accent-cyan/30 backdrop-blur-xl shadow-2xl">
                <div className="w-24 h-24 bg-accent-cyan rounded-full flex items-center justify-center shadow-[0_0_30px_#00d9ff] mb-4">
                    <CheckCircle size={48} color="#0a0e27" />
                </div>
                <h2 className="text-4xl text-white font-heading">Amazing Work!</h2>
                <p className="text-neutral text-lg text-center max-w-md">You've mastered the basics of digital logic.<br />Want to save your progress and unlock the next chapter?</p>
                <div className="flex gap-4 mt-4">
                    <Button variant="secondary" className="px-8">Continue as Guest <User size={20} className="ml-2" /></Button>
                    <Button className="px-8">Create Account <UserPlus size={20} className="ml-2" /></Button>
                </div>
            </div>
        </div>
    );
};
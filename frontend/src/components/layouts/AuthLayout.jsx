import React from 'react';
import CODE_COLLAB from "/images/Code.jpg";  // Replace with a relevant image
import { SiCodingninjas } from "react-icons/si";

const StatsInfoCard = ({ icon, label, value, color }) => {
    return (
        <div className='flex gap-6 bg-white rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10 p-4'>
            <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl my-auto`}>
                {icon}
            </div>
            <div>
                <h6 className='text-xs text-gray-500 my-1'>{label}</h6>
                <span className='text-[20px]'>{value}</span>
            </div>
        </div>
    );
}

export const AuthLayout = ({ children }) => {
    return (
        <div className='flex'>
            {/* Right Side - Image & Info */}
            <div className='w-1/2 h-screen bg-blue-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative'>
                <div className='w-48 h-48 rounded-[40px] bg-blue-700 absolute -top-7 -left-5'/>
                <div className='w-48 h-48 rounded-[40px] border-[20px] border-cyan-600 absolute top-[30%] -right-10'/>
                <div className='w-48 h-48 rounded-[40px] bg-indigo-700 absolute -bottom-7 -left-5'/>

                <div className='grid grid-cols-1 z-20'>
                    <StatsInfoCard 
                        icon={<SiCodingninjas 
                            className='text-black my-auto ml-3 bg-blue-700 p-2 w-full h-auto rounded-full'
                        />}
                        label="Live Code Collaboration Sessions"
                        value="12,500+"
                        color="bg-primary"
                    />
                </div>

                <img 
                    src={CODE_COLLAB} 
                    alt="RealTimeCodeCollab" 
                    className='ml-6 w-48 h-[54%] lg:w-[80%] absolute bottom-10 shadow-lg shadow-blue-400/15 rounded-xl'
                />
            </div>

            {/* Left Side - Content */}
            <div className='w-1/2 h-screen px-24 pt-8 pb-12'>
                <h2 className='text-4xl font-medium text-black'>SyncIDE</h2>
                {children}
            </div>
        </div>
    )
}
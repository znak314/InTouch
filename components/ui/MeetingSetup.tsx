"use client"
import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './button'

const MeetingSetup = ( { setIsSetupComplete }: {setIsSetupComplete: (value: boolean) => void}) => {
    const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false)
    const call = useCall();
    
    if(!call) {
        throw new Error("Not correct")
    }

    useEffect(() => {
        if(isMicCamToggledOn){
            call?.camera.disable();
            call?.camera.disable();
        } else {
            call?.camera.enable();
            call?.camera.enable();
        }

    }, [isMicCamToggledOn, call?.camera, call?.microphone])

    return (
        <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-black'>
            <h1 className='text-2xl font-bold text-white'>Setup</h1>
            <VideoPreview />

            <div className="flex h-16 items-center justify-center gap-3">
                <label className='flex items-center justify-center gap-2 font-medium text-white'>
                    <input 
                    type = "checkbox"
                    checked ={isMicCamToggledOn}
                    onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
                    />
                    Join muted and without a video
                </label>

                <DeviceSettings />
            </div>

            <Button className='rounded-mg bg-green-500 px=4 py-2.5'
                onClick={() => {call.join(); 
                setIsSetupComplete(true);
            }}>
                Join meeting
            </Button>
        </div>
    )
}

export default MeetingSetup
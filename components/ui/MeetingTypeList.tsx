"use client"

import { useState } from "react"
import HomeCard from "./homecard"
import { useRouter } from "next/navigation"
import MeetingModal from "./MeetingModal"
import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "./textarea"
import ReactDatePicker from 'react-datepicker'
import { Input } from "@/components/ui/input"


const MeetingTypeList = () => {
    const router = useRouter()
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
    
    const { user } = useUser();
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    })

    const [callDetails, setCallDetails] = useState<Call>()
    const { toast } = useToast()
    let meetingLink = ""
    
    const createMeeting = () => {
        if(!client || !user) return;
        
        try{
            if(!values.dateTime) {
                toast({title: "Select a date and time"})
                return;
            }
            const id = crypto.randomUUID();
            const call = client.call('default', id);

            if(!call) throw new Error('Failed to create call')
            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'Instant meeting';

            (async () => {
                await call.getOrCreate({
                    data: {
                        starts_at: startsAt,
                        custom: {
                            description,
                        },
                    },
                });
            })();
            

            setCallDetails(call);

            if (!values.description) {
                router.push(`/meeting/${call.id}`);
                meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`
            }
            
            toast({title: "Meeting created"})
        } catch(error) {
            console.log(error);
            toast({title: "Failed to create meeting"})
        }
      };

      //const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

    return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2 min-h-[80vh] place-items-center">
        <HomeCard 
            title = "New meeting"
            description = "Start an instant meeting"
            handleClick = {() => setMeetingState('isInstantMeeting')}
        />
        <HomeCard 
            title = "My recordings"
            description = "See your recordings"
            handleClick = {() => router.push('/recordings')}
        />
        <HomeCard 
            title = "Schedule meeting"
            description = "Plan your meeting"
            handleClick = {() => setMeetingState('isScheduleMeeting')}
        />
        <HomeCard
            title = "Join meeting"
            description = "Use your invitation link"
            handleClick = {() => setMeetingState('isJoiningMeeting')}
        />

        {!callDetails? (
            <MeetingModal
                isOpen={meetingState ==='isScheduleMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Create meeting"
                handleClick={createMeeting}
            >
                <div className="flex flex-col gap-2.5">
                    <label className="text-base text-normal leading-[22px] text-sky-2">Description</label>
                    <Textarea className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    onChange={(e) => {
                        setValues({...values, description: e.target.value})
                    }}/>
                </div>

                <div className="flex w-full flex-col gap-2.5">
                    <label className="text-base text-normal leading-[22px] text-sky-2">Select Date and time</label>
                    <ReactDatePicker
                        selected={values.dateTime}
                        onChange={(date) => setValues({ ...values, dateTime: date! })}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="w-full rounded bg-gray p-2 focus:outline-none"
                        minDate={new Date()} // Дозволити лише майбутні дати
                        minTime={new Date().getHours() === values.dateTime?.getHours() ? new Date() : undefined} // Дозволити лише майбутній час для поточного дня
                        maxTime={new Date(new Date().setHours(23, 59, 59))} // Максимально доступний час на день
                    />
                </div>
            </MeetingModal>
        ) : (
            <MeetingModal
                isOpen={meetingState ==='isScheduleMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Meeting scheduled!"
                className="text-center"
                //handleClick={() => {navigator.clipboard.writeText(meetingLink); toast({title: 'Link copied!'})}}
                handleClick={() => {navigator.clipboard.writeText(meetingLink); toast({title: 'Link copied!'})}}
                image="/icons/created_meeting.svg"
                buttonText = "Copy Meeting link"
            />
        )}

        <MeetingModal
            isOpen={meetingState ==='isInstantMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Start an Instant Meeting"
            className="text-center"
            buttonText="Start meeting"
            handleClick={createMeeting}
        />

        <MeetingModal
            isOpen={meetingState ==='isJoiningMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="Type your link here :)"
            className="text-center"
            buttonText="JoinMeeting"
            handleClick={() => router.push(values.link)}
        >
            <Input 
            placeholder="Meeting link"
            className="border-none bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(e) => setValues({...values, link: e.target.value})}/>
        </MeetingModal>
    </section>
  )
}

export default MeetingTypeList
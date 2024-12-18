// @ts-nocheck
"use client" 
import { useGetCalls } from '@/hooks/useGetCalls'
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { useToast } from './use_toast_2';
import { CallRecording, CallRecordingList } from "@stream-io/video-react-sdk";

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls';
      case 'upcoming':
        return 'No Upcoming Calls';
      case 'recordings':
        return 'No Recordings';
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
      );

      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);
      setRecordings(recordings);
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (!calls) {
    console.log("calls is falsy (null, undefined, false, or other falsy value)");
  } else if (!(calls.length > 0)) {
    console.log("calls exists but calls.length is not greater than 0");
  } else {
    console.log("Both conditions are true: calls exists and has a length greater than 0");
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls
          .filter((meeting: Call | CallRecording) => {
            if (type === 'upcoming') {
              const startDate =
                (meeting as Call).state?.startsAt ||
                (meeting as CallRecording).start_time;
  
              // Додаємо 15 хвилин до поточного часу
              const currentTimeWithBuffer = new Date();
              currentTimeWithBuffer.setMinutes(currentTimeWithBuffer.getMinutes() + 15);
  
              return startDate && new Date(startDate) > currentTimeWithBuffer;
            }
            return true; // для інших типів залишаємо всі мітинги
          })
          .map((meeting: Call | CallRecording) => (
            <MeetingCard
              key={(meeting as Call).id}
              icon={
                type === 'ended'
                  ? '/icons/Previous.svg'
                  : type === 'upcoming'
                  ? '/icons/Upcoming.svg'
                  : '/icons/video.svg'
              }
              title={
                (meeting as Call).state?.custom?.description ||
                (meeting as CallRecording).filename?.substring(0, 20) ||
                'No Description'
              }
              date={
                type === 'ended'
                  ? `Ended at: ${ (meeting as Call).state?.endedAt?.toLocaleString() }`
                  : `Starts at: ${ (meeting as Call).state?.startsAt?.toLocaleString() || (meeting as CallRecording).start_time?.toLocaleString() }`
              }                      
              isPreviousMeeting={type === 'ended'}
              link={
                type === 'recordings'
                  ? (meeting as CallRecording).url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
              }
              buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
              buttonText={type === 'recordings' ? 'Play' : 'Start'}
              handleClick={
                type === 'recordings'
                  ? () => router.push(`${(meeting as CallRecording).url}`)
                  : () => router.push(`/meeting/${(meeting as Call).id}`)
              }
              height={type === 'ended' ? "175px" : "230px"}
            />
          ))
      ) : (
        <h1 className="text-2xl font-bold text-black">{noCallsMessage}</h1>
      )}
    </div>
  );  
};

export default CallList;
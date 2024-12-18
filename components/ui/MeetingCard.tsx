"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useToast } from "./use_toast_2";
import { toast } from '@/hooks/use-toast';

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
  height?: string; 
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
  height,
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
      <section
        className="flex flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8"
        style={{ minHeight: height, flexBasis: "calc(33.33% - 20px)" }} // 33% ширини контейнера
      >
        <article className="flex flex-col gap-5">
        <Image src={icon} alt="upcoming" width={28} height={28} />
        <div className="flex justify-between text-black">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-base font-normal">{date}</p>
          </div>
        </div>
      </article>
      <article className={cn("flex justify-center relative", {})}>
        {!isPreviousMeeting && (
          <div className="flex gap-2">
            <Button onClick={handleClick} className="rounded bg-blue-1 px-6">
              {buttonIcon1 && (
                <Image src={buttonIcon1} alt="feature" width={20} height={20} />
              )}
              &nbsp; {buttonText}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: "Link Copied",
                  backgroundColor: "#ff0000"
                });
              }}
              className="bg-black px-6 active:bg-gray-700 active:scale-95 transition-all duration-100"
            >
              <Image
                src="/icons/copy.svg"
                alt="feature"
                width={20}
                height={20}
              />
              &nbsp; Copy Link
            </Button>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;

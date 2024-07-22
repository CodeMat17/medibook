"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import dayjs from "dayjs";
import { Calendar, MinusIcon, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  params: { phone: string };
};

const Success = ({ params }: Props) => {
  const phone = params.phone;
  const decodedPhoneNo = decodeURIComponent(phone);

  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");

  const supabase = createClient();

  useEffect(() => {
    getAppointmentDetails();
  }, [decodedPhoneNo, supabase]);

  const getAppointmentDetails = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("patients")
      .select("appointmentDate, doctor")
      .eq("phone", decodedPhoneNo)
      .single();

    if (data) {
      setDoctor(data.doctor);
      setAppointmentDate(data.appointmentDate);
    }
    setLoading(false);
  };

  return (
    <div className='flex flex-col p-8 items-center justify-center w-full h-[30rem]'>
      <div className='w-32 aspect-square rounded-full overflow-hidden'>
        <video loop autoPlay muted playsInline>
          <source src='/success_loader.mp4' type='video/mp4' />
        </video>
      </div>
      <div className='mt-6 text-center max-w-md space-y-2'>
        <h1 className='text-2xl font-medium '>
          Your <span className='text-sky-500'>appointment request</span> has
          been submitted successfully!
        </h1>
        <p className='text-gray-400'>
          Once your appointment is confirmed, you will be notified.
        </p>
      </div>
      <div className='flex items-center justify-center gap-6 text-sm mt-6'>
        {loading ? (
          <div className='flex items-center border rounded-xl px-7 py-4'>
            <MinusIcon className='animate-spin text-sky-600 mr-4' />{" "}
            <p className='text-sky-600'>Wait for details...</p>
          </div>
        ) : (
          <div className='flex flex-col sm:flex-row w-full gap-1 sm:gap-4 text-sky-600'>
            <p className="sm:text-center pb-1 sm:pb-0 uppercase ">Request details:</p>{" "}
            <div className='flex items-center'>
              <UserCircle2 className='w-4 h-4 mr-2' /> {doctor}
            </div>{" "}
            <div className='flex items-center'>
              <Calendar className='w-4 h-4 mr-2' />
              {dayjs(appointmentDate).format("MMM DD, YYYY HH:mm:ss")}
            </div>
          </div>
        )}
      </div>
      {!loading && <div className="mt-6">
        <Button asChild variant='outline'>
          <Link href='/'>DONE</Link>
        </Button>
      </div>}
     
    </div>
  );
};

export default Success;

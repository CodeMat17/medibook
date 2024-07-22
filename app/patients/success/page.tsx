"use client";

import { createClient } from "@/utils/supabase/client";
import dayjs from "dayjs";
import { MinusIcon } from "lucide-react";
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
          Once your appointment is confirmed, you will be notified......
        </p>
      </div>
      {/* <div className='flex items-center justify-center gap6 text-sm mt-6'>
        {loading ? (
          <MinusIcon />
        ) : (
          <>
            <p>Request details:</p> <div>{doctor}</div>{" "}
            <div>{dayjs(appointmentDate).format("MMM DD, YYYY")}</div>
          </>
        )}
      </div> */}
    </div>
  );
};

export default Success;

import CancelAppointments from "@/components/CancelAppointment";
import ConfirmAppointment from "@/components/ConfirmAppointment";
import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import advanceFormat from "dayjs/plugin/advancedFormat";
import { MinusIcon } from "lucide-react";
import Image from "next/image";

dayjs.extend(advanceFormat);

const cards = [
  { id: 1, title: "New Appointments", count: 12, img: "/scheduled.gif" },
  { id: 2, title: "Pending Appointments", count: 5, img: "/pending.gif" },
  { id: 3, title: "Cancelled Appointments", count: 2, img: "/cancelled.gif" },
];

const AdminPage = async () => {
  const supabase = createClient();

  const { data: appointments, error } = await supabase
    .from("patients")
    .select("id, username, doctor, appointmentDate, status")
    .not("appointmentDate", "is", null)
    // .eq('status', 'pending')
    .order("booked_on", { ascending: true });

  return (
    <div className='w-full max-w-6xl mx-auto min-h-screen px-4 py-8 flex flex-col gap-8'>
      <div>
        <div className='flex items-center gap-3'>
          <h1 className='text-2xl'>Welcome </h1>
          <Image
            alt='icon'
            priority
            width={30}
            height={30}
            src='/hand.gif'
            className=''
          />
        </div>
        <p className='text-sm text-gray-400'>
          View, accept, or decline appointments in real-time.
        </p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-8'>
        {cards.map((card) => (
          <div
            key={card.id}
            className='bg-gradient-to-br from-sky-700 via-sky-500/30 to-gray-950 p-4 rounded-xl'>
            <div className='flex items-center gap-3'>
              <Image
                alt=''
                priority
                width={35}
                height={35}
                src={card.img}
                className='rounded-md'
              />
              <p className='text-3xl'>{card.count}</p>
            </div>
            <h2 className='mt-1'>{card.title}</h2>
          </div>
        ))}
      </div>
      <div>
        <h2 className='text-2xl'>Recent Appointments</h2>

        <div className='my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {appointments && appointments.length < 1 ? (
            <div className='w-full py-32 flex justify-center items-center'>
              <MinusIcon className='mr-4 animate-spin' /> Loading...
            </div>
          ) : (
            appointments?.map((item) => (
              <div
                key={item.id}
                className='relative bg-gray-900 p-5 rounded-xl w-full mx-auto'>
                <h2 className='text-xl font-medium mb-2 mt-4'>
                  {item.username}
                </h2>
                <hr />
                <div className='mt-2'>
                  {/* <p className='text-gray-400'>
                    Doctor: {item.doctor} <br />
                    Date: {dayjs(item.appointmentDate).format("MMM DD, YYYY")} |
                    Time: {dayjs(item.appointmentDate).format("HH:mm:ss")}
                    <br />
                    Time: {dayjs(item.appointmentDate).format("HH:mm:ss")}
                  </p> */}
                  <div className='text-gray-400'>
                    <p> Doctor: {item.doctor} </p>
                    <div className='flex sm:flex-col lg:flex-row gap-3 sm:gap-0 lg:gap-3'>
                      <p>
                        {" "}
                        Date:{" "}
                        {dayjs(item.appointmentDate).format("MMM DD, YYYY")}
                      </p>
                      <p className='sm:hidden lg:block'>|</p>
                      <p>
                        {" "}
                        Time: {dayjs(item.appointmentDate).format("hh:mm:ss A")}
                      </p>
                    </div>
                  </div>
                </div>
                {item.status === "pending" && (
                  <div className='flex gap-1 items-center absolute -top-2.5 right-4 text-xs bg-gray-900 border-4 border-gray-950 pr-3 rounded-full overflow-hidden'>
                    {/* <Hourglass className='w-3 h-3' /> */}
                    <Image
                      alt=''
                      priority
                      width={23}
                      height={23}
                      src='/sand.gif'
                    />
                    <span className='text-amber-500'> Pending</span>
                  </div>
                )}

                {item.status === "confirmed" && (
                  <div className='flex gap-1 items-center absolute -top-2.5 right-4 text-xs bg-gray-900 border-4 border-gray-950 pr-3 rounded-full overflow-hidden'>
                    {/* <Hourglass className='w-3 h-3' /> */}
                    <Image
                      alt=''
                      priority
                      width={23}
                      height={23}
                      src='/confirmed.gif'
                    />
                    <span className='text-green-500'> Scheduled</span>
                  </div>
                )}

                {item.status === "adjusted" && (
                  <div className='flex gap-1 items-center absolute -top-2.5 right-4 text-xs bg-gray-900 border-4 border-gray-950 pr-3 rounded-full overflow-hidden'>
                    {/* <Hourglass className='w-3 h-3' /> */}
                    <Image
                      alt=''
                      priority
                      width={23}
                      height={23}
                      src='/adjust.gif'
                    />
                    <span className='text-green-500'> Adjusted & scheduled</span>
                  </div>
                )}

                <div className='mt-4 flex gap-3 justify-between'>
                  <CancelAppointments
                    id={item.id}
                    name={item.username}
                    date={item.appointmentDate}
                  />

                  <ConfirmAppointment
                    id={item.id}
                    username={item.username}
                    doctor={item.doctor}
                    appointmentDate={item.appointmentDate}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

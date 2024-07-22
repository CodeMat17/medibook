"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import {
  CalendarIcon,
  MessageCirclePlusIcon,
  UsersRoundIcon,
} from "lucide-react";

import { TimePicker } from "@/components/time-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, NotebookTabsIcon, SendIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "react-phone-number-input/style.css";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  doctor: z.string().min(12, {
    message: "Select a doctor.",
  }),
  reason: z
    .string()
    .min(5, {
      message: "Reason for appointment must be at least 12 characters.",
    })
    .max(200, {
      message: "Reason for appointment must not be longer than 200 characters.",
    }),
  comment: z
    .string()
    .min(5, {
      message: "Comment must be at least 12 characters.",
    })
    .max(200, {
      message: "Comment must not be longer than 200 characters.",
    }),
  appointmentDate: z.date({
    required_error: "Appointment date is required.",
  }),
});

type Props = {
  params: { phone: string };
};

const Appointment = ({ params }: Props) => {
  const phone = params.phone;
  const decodedPhoneNo = decodeURIComponent(phone).replace(/\s/g, "+");

  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const [username, setUsername] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const booked_on = new Date().toISOString();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctor: "",
      reason: "",
      comment: "",
      // appointmentDate: date,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      setErrorMsg("");
      setLoading(true);

      const { data, error } = await supabase
        .from("patients")
        .update({ ...values, status: "pending", booked_on })
        .eq("phone", decodedPhoneNo)
        .select();

      if (error) {
        setErrorMsg(error.message);
      }

      if (data) {
        toast("Appointment booking successful!");
        router.push(`/patients/success/${phone}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen w-full max-w-5xl mx-auto flex flex-col md:flex-row md:justify-around pb-12'>
      <div className='w-full sm:max-w-xl md:max-w-2xl mx-auto'>
        {errorMsg && (
          <p className='text-sm text-red-500 bg-red-50 p-5 text-center'>
            {errorMsg}
          </p>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 flex-1 px-4 z-40 mt-6'>
            <section className='text-lg'>
              <h1 className='capitalize text-xl'>Appointment Form</h1>
              <p className='text-gray-300'>
                Book an appointment with your favourite doctor.
              </p>
            </section>

            <FormField
              control={form.control}
              name='doctor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sky-500/60'>
                    Select Doctor
                  </FormLabel>
                  <div className='flex items-center'>
                    <UsersRoundIcon className='mr-4 text-sky-500' />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select your favourite doctor.' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Dr. Maynard Tolu'>
                          Dr. Maynard Tolu
                        </SelectItem>
                        <SelectItem value='Dr. Ambrose Ibe'>
                          Dr. Ambrose Ibe
                        </SelectItem>
                        <SelectItem value='Dr. Nuhu Gidado'>
                          Dr. Nuhu Gidado
                        </SelectItem>
                        <SelectItem value='Dr. Enya Ideba'>
                          Dr. Enya Ideba
                        </SelectItem>
                        <SelectItem value='Dr. Chijioke Asogwa'>
                          Dr. Chijioke Asogwa
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-col md:flex-row gap-4 items-center justify-center'>
              <FormField
                control={form.control}
                name='reason'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-sky-500/60'>Reason</FormLabel>
                    <FormControl>
                      <div className='flex items-center '>
                        <NotebookTabsIcon className='mr-4 text-sky-500 shrink-0' />
                        <Textarea
                          placeholder='Enter the reason for your appointment'
                          className='resize-none'
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='comment'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-sky-500/60'>
                      Additional Comments
                    </FormLabel>
                    <FormControl>
                      <div className='flex items-center'>
                        <MessageCirclePlusIcon className='mr-4 text-sky-500 shrink-0' />
                        <Textarea
                          placeholder='Enter additional comments'
                          className='resize-none'
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='appointmentDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className='text-sky-500/60'>
                    Appointment Date
                  </FormLabel>
                  <div className='flex items-center pt-1'>
                    <CalendarIcon className='mr-4 text-sky-500' />
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}>
                            {field.value ? (
                              dayjs(field.value).format("MMM DD, YYYY | hh:mm A")
                            ) : (
                              <span className='text-left'>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date <= new Date()}
                          initialFocus
                        />
                        <div className='px-4 py-3 border-t border-border'>
                          <TimePicker
                            date={field.value}
                            setDate={field.onChange}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              variant='ghost'
              type='submit'
              className='w-full bg-sky-500 text-white'>
              {loading ? "Booking..." : "Book Appointment"}

              {loading ? (
                <Minus className='animate-spin ml-4' />
              ) : (
                <SendIcon className='w-4 h-4 ml-4 ' />
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div className='hidden justify-center items-center shrink-0'>
        <Image
          alt='logo'
          priority
          width={300}
          height={300}
          src='/svg/doctors.svg'
          className='w-[300px] lg:max-w-[420px] xl:max-w-[600px] aspect-square shrink-0'
        />
      </div>
    </div>
  );
};

export default Appointment;

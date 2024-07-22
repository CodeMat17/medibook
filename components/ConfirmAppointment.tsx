"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/utils/cn";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Minus } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { TimePicker } from "./time-picker";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
  doctor: z.string().min(2).max(50),
  appointmentDate: z.date({
    required_error: "Appointment date is required.",
  }),
});

type Props = {
  id: string;
  username: string;
  doctor: string;
  appointmentDate: Date;
};

const ConfirmAppointment = ({
  id,
  username,
  doctor,
  appointmentDate,
}: Props) => {
  const supabase = createClient();
  const [adjust, setAdjust] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [adjustLoading, setAdjustLoading] = useState(false);

  const confirmAppointment = async () => {
    try {
      setConfirmLoading(true);
      const { data, error } = await supabase
        .from("patients")
        .update({ status: "confirmed" })
        .eq("id", id)
        .select();

      if (error) {
        toast(`Error confirming appointment: ${error.message}`);
      }

      if (!error) {
        toast("Appointment confirmed successfully!");
        setOpen(false);
        await fetch("/api/emails", {
          method: "POST",
          body: JSON.stringify({
            email: data[0].email,
            date: data[0].appointmentDate,
            doctor: data[0].doctor,
            patient: data[0].username,
          }),
        });
        toast("Confirmation email sent successfully!");
        revalidatePath("/admin");
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctor: doctor,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setAdjustLoading(true);
      const { data, error } = await supabase
        .from("patients")
        .update({ ...values, status: "adjusted" })
        .eq("id", id)
        .select();

      if (!error) {
        toast("Appointment adjusted and confirmed successfully!");
        setOpen(false);
        await fetch("/api/emails", {
          method: "POST",
          body: JSON.stringify({
            email: data[0].email,
            date: data[0].appointmentDate,
            doctor: data[0].doctor,
            patient: data[0].username,
          }),
        });
        toast("Confirmation email sent successfully!");
        revalidatePath("/admin");
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setAdjustLoading(false);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            className='rounded-full border-sky-600 px-6 text-sky-600'>
            Schedule
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Confirm or adjust appointments</DialogTitle>
            <DialogDescription>
              Name: {username} <br />
              Doctor: {doctor} <br />
              Date/Time:{" "}
              {dayjs(appointmentDate).format("MMM DD, YYYY | hh:mm A")}
            </DialogDescription>
          </DialogHeader>

          {adjust ? (
            <>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-2'>
                  <FormField
                    control={form.control}
                    name='doctor'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-sky-500/60'>
                          Re-assign a doctor
                        </FormLabel>
                        <div className='flex items-center'>
                          {/* <UsersRoundIcon className='mr-4 text-sky-500' /> */}
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

                  <FormField
                    control={form.control}
                    name='appointmentDate'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel className='text-sky-500/60'>
                          Adjust date / time
                        </FormLabel>
                        <div className='flex items-center pt-1'>
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
                                    dayjs(field.value).format(
                                      "MMM DD, YYYY | hh:mm A"
                                    )
                                  ) : (
                                    <span className='text-left'>
                                      Pick a new date and time
                                    </span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className='w-auto p-0'
                              align='start'>
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
                  <br />
                  <Button type='submit' className=' w-full'>
                    {adjustLoading ? (
                      <>
                        <Minus className='animate-spin mr-4' />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <div className='mt-4 flex gap-6'>
              <Button
                onClick={() => setAdjust(true)}
                variant='outline'
                className=' border-sky-500 text-sky-700 w-full'>
                Adjust
              </Button>
              <Button
                disabled={confirmLoading}
                onClick={confirmAppointment}
                className=' bg-sky-500 text-white hover:bg-sky-700 w-full'>
                {confirmLoading ? (
                  <>
                    <Minus className='animate-spin mr-4' />
                    Confirming...
                  </>
                ) : (
                  "  Confirm appointment"
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfirmAppointment;

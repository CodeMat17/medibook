"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { CalendarIcon, ContactIcon } from "lucide-react";

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
  address: z
    .string()
    .min(12, {
      message: "Address must be at least 12 characters.",
    })
    .max(160, {
      message: "Address must not be longer than 160 characters.",
    }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),

  gender: z.enum(["male", "female"], {
    required_error: "You need to select your gender.",
  }),
});

type Props = {
  params: { phone: string };
};

const Register = ({ params }: Props) => {
  const phone = params.phone;
  const decodedPhoneNo = decodeURIComponent(phone).replace(/\s/g, "+");

  console.log("decodedPhoneNo: ", decodedPhoneNo);
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const [username, setUsername] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      setLoading(true);
      console.log(values);
      const { data, error } = await supabase
        .from("patients")
        .update(values)
        .eq("phone", decodedPhoneNo)
        .select();

      if (error) {
        setErrorMsg(error.message);
      }

      if (data) {
        toast("Registration completed!");
        router.push(`/patients/appointment/${phone}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen w-full max-w-5xl mx-auto flex flex-col md:flex-row md:justify-around pb-12'>
      <div className='w-full sm:max-w-md mx-auto'>
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
              <h1 className='capitalize'>
                Welcome, {username ? username : "👋"}
              </h1>
              <p>Complete your profile registration</p>
            </section>
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sky-500/60'>Address</FormLabel>
                  <FormControl>
                    <div className='flex items-center'>
                      <NotebookTabsIcon className='mr-4 text-sky-500' />
                      <Textarea
                        placeholder='Enter your address'
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
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sky-500/60'>Gender</FormLabel>
                  <FormControl>
                    <div className='flex items-center w-full'>
                      <ContactIcon className='mr-4 text-sky-500' />
                      <div className='w-full border border-gray-800 rounded-md p-4'>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex gap-8 items-center '>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem
                                value='male'
                                className='text-sky-500'
                              />
                            </FormControl>
                            <FormLabel className='font-normal'>Male</FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem
                                value='female'
                                className='text-sky-500'
                              />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              Female
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='dob'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className='text-sky-500/60'>
                    Date of birth
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
                              dayjs(field.value).format("MMM DD, YYYY")
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
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
              {loading ? "Registering" : "Register"}

              {loading ? (
                <Minus className='animate-spin ml-4' />
              ) : (
                <SendIcon className='w-4 h-4 ml-4 ' />
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div className='hidden md:flex justify-center items-center shrink-0'>
        <Image
          alt='logo'
          priority
          width={300}
          height={300}
          src='/svg/registration.svg'
          className='w-[400px] lg:max-w-[450px] xl:max-w-[600px] aspect-square shrink-0'
        />
      </div>
    </div>
  );
};

export default Register;

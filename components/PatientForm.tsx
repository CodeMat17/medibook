"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { E164Number } from "libphonenumber-js";
import { MailPlusIcon, Minus, SendIcon, User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "./ui/input";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  phone: z.string().refine((phone) => /^\+\d{12,13}$/.test(phone), {
    message: "Invalid phone number",
  }),

  email: z.string().email({
    message: "Invalid email address",
  }),
});

export function PatientForm() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phone: "",
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setErrorMessage("");
      setLoading(true);

      const existingPatient = await supabase
        .from("patients")
        .select("id, dob")
        .eq("phone", values.phone)
        .limit(1)
        .then(({ data }) => {
          if (data) {
            return data[0];
          } else {
            return null; // or undefined, depending on your preference
          }
        });

      if (existingPatient) {
        // Update existing patient record
        await supabase
          .from("patients")
          .update(values)
          .eq("phone", values.phone)
          .select();
        if (existingPatient.dob !== null) {
          toast("Successful!");
          router.push(`/patients/appointment/${values.phone}`);
        } else {
          toast("profile registration initiated!!");
          router.push(`/patients/${values.phone}`);
        }
      } else {
        // Insert new patient record
        await supabase.from("patients").insert([values]).select();
        toast("profile registration initiated!!");
        router.push(`/patients/${values.phone}`);
      }
    } catch (error) {
      alert(`Error creating profile: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-3 flex-1 px-4 z-40 mt-6'>
        <section className='text-lg'>
          <h1 className='text-xl'>Welcome 👋</h1>
          <p className='text-gray-300'>
            Schedule your appointment with your favourite{" "}
            <span className='text-sky-500'>MEDIBOOK</span> doctor.
          </p>
          {errorMessage && (
            <p className='bg-red-50 text-red-500 text-sm p-5 mt-3 rounded-xl'>
              {errorMessage}
            </p>
          )}
        </section>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sky-500/60'>Username</FormLabel>
              <FormControl>
                <div className='flex items-center'>
                  <User2Icon className='mr-4 text-sky-500' />
                  <Input placeholder='Eg. John Doe' {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sky-500/60'>Email</FormLabel>
              <FormControl>
                <div className='flex items-center'>
                  <MailPlusIcon className='mr-4 text-sky-500' />
                  <Input
                    type='email'
                    placeholder='Eg. johndoe@gmail.com'
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
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sky-500/60'>
                Enter your phone number
              </FormLabel>
              <FormControl>
                <PhoneInput
                  defaultCountry='NG'
                  placeholder='Enter phone number'
                  international
                  withCountryCallingCode
                  value={field.value as E164Number | undefined}
                  onChange={field.onChange}
                  className='phone-input'
                />
              </FormControl>
              <FormDescription className="text-xs">You MUST enter a valid phone no. to be captured.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant='ghost'
          type='submit'
          className='w-full bg-sky-500 text-white'>
          {loading ? "Submitting" : "Submit"}

          {loading ? (
            <Minus className='animate-spin ml-4' />
          ) : (
            <SendIcon className='w-4 h-4 ml-4 ' />
          )}
        </Button>
      </form>
    </Form>
  );
}

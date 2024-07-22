"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/client";
import dayjs from "dayjs";
import { MinusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

type Props = {
  id: string;
  name: string;
  date: string;
};

const CancelAppointments = ({ id, name, date }: Props) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const cancelAppointment = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("patients")
        .delete()
        .eq("id", id);

      if (error) {
        toast(error.message);
      }
      if (!error) {
        toast("Appointment cancelled successfully");
        setOpen(false);
        revalidatePath(`/admin`);
      }
      // Redirect to home page after deletion

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className='rounded-full bg-red-600 px-6 text-white hover:text-red-600 hover:bg-red-100'
          disabled={loading}>
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Double Check!</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel and delete the appointment request
            from {name} for {dayjs(date).format("MMM DD, YYYY hh:mm A")}? 
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => setOpen(false)}
            className='bg-gray-700 text-white hover:bg-gray-900 '>
            No
          </Button>
          <Button onClick={cancelAppointment} disabled={loading}>
            {loading ? (
              <>
                <MinusIcon className='animate-spin mr-3' /> Wait
              </>
            ) : (
              "Yes!"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelAppointments;

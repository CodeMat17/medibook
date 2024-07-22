"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { useState } from "react";

const OTPModal = () => {
  const router = useRouter();
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("passkey")
      : null;

  const validatePasscode = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setError("");
    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      localStorage.setItem("accessKey", passkey);
      router.push("/admin");
    } else {
      setError("Invalid passcode. Please try again.");
    }
  };

  return (
    <div className=''>
      <AlertDialog>
        <AlertDialogTrigger className='text-[14px] px-4 py-2 rounded-md hover:bg-gray-700/30'>
          Admin
        </AlertDialogTrigger>
        <AlertDialogContent className='max-w-[330px] sm:max-w-md rounded-md overflow-hidden'>
          <AlertDialogHeader>
            <AlertDialogTitle className=''>
              Admin Access Verification
            </AlertDialogTitle>
            <AlertDialogDescription>
              To access the admin page, enter your pass-code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex flex-col justify-center'>
            <InputOTP
              maxLength={6}
              value={passkey}
              onChange={(value) => setPasskey(value)}>
              <InputOTPGroup className='flex gap-2'>
                <InputOTPSlot
                  className='border rounded-md sm:p-6 text-lg'
                  index={0}
                />
                <InputOTPSlot
                  className='border rounded-md sm:p-6 text-lg'
                  index={1}
                />
                <InputOTPSlot
                  className='border rounded-md sm:p-6 text-lg'
                  index={2}
                />
                <InputOTPSlot
                  className='border rounded-md sm:p-6 text-lg'
                  index={3}
                />
                <InputOTPSlot
                  className='border rounded-md sm:p-6 text-lg'
                  index={4}
                />
                <InputOTPSlot
                  className='border rounded-md sm:p-6 text-lg'
                  index={5}
                />
              </InputOTPGroup>
            </InputOTP>
            {error && (
              <p className='text-red-500 mt-3 text-start text-xs'>{error}</p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={(e) => validatePasscode(e)}
              className='bg-sky-800 hover:bg-sky-700 text-white'>
              Enter Admin Passcode
            </AlertDialogAction>
          </AlertDialogFooter>
          <p className='text-xs text-center text-gray-400'>Demo passcode: 654321</p>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OTPModal;

"use client"

import CustomButton from "@/components/CustomButton"
import React from 'react'
import { useRouter } from "next/navigation"

type Props = {}

function page({ }: Props) {
    const router = useRouter();

    const handleEdit = () => {
        router.push("/image-upload"); // TODO: reference the image upload and AI Story page
    }

    const handleProceed = () => {
        // Add your proceed logic here
        router.push("/checkout");
    }

    return (
        <div className="w-full h-full">
            <div className="p-2 w-[90%] mx-auto min-h-100 bg-white text-black rounded-none mb-4 border-4 border-black">page</div>
            <div className="flex flex-col gap-6 items-end -mt-25 -ml-80">
                <div>
                    <CustomButton onClick={() => handleEdit()} className="bg-red-700 text-white hover:text-black">EDIT</CustomButton>
                </div>
                <div>
                    <CustomButton onClick={() => handleProceed()} className="bg-green-700 text-white hover:text-black">PROCEED</CustomButton>
                </div>
            </div>
        </div>
    )
}

export default page
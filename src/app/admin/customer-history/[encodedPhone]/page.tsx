"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Image from "next/image";

// Define response structure
interface CustomerBasicDetails {
    _id: string;
    customer: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

interface Coupon {
    _id: string;
    customer_id: string;
    phone: string;
    coupon_code: string;
    amount: { $numberDecimal: string };
    validity: number;
    isActive: number;
    scratched: number;
    redeemed: number;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

interface Screenshot {
    _id: string;
    customer_id: string;
    phone: string;
    screen_shot: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

interface Customer {
    _id: string;
    customer: string;
    phone: string;
    fore_closure: string;
    settlement: { $numberDecimal: string };
    minimum_part_payment: { $numberDecimal: string };
    foreclosure_reward: { $numberDecimal: string };
    settlement_reward: { $numberDecimal: string };
    minimum_part_payment_reward: { $numberDecimal: string };
    payment_type: number;
    isPaid: boolean;
    payment_url: string;
    isLogin: boolean;
    last_login: string;
    otp: number;
    isActive: boolean;
    lender_name: string;
    verified_by: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

interface HistoryItem {
    customer: Customer;
    coupon?: Coupon;
    screenshots?: Screenshot;
}

interface CustomerDetailsResponse {
    success: boolean;
    customer_basic_details: CustomerBasicDetails;
    history: HistoryItem[];
    responseTime?: string;
    memory?: {
        rss: string;
        heapTotal: string;
        heapUsed: string;
    };
}

export default function UserMetaCard() {
    const params = useParams();
    const [decodedPhone, setDecodedPhone] = useState('');
    const [customerDetails, setCustomerDetails] = useState<CustomerDetailsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchCustomerDetails = async (phone: string) => {
            try {
                setLoading(true);
                const trimPhone = phone.trim();
                const response = await fetch(`/api/admin/customers/${trimPhone}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error('Customer not found');
                }
                const data = await response.json();
                setCustomerDetails(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch customer');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (params?.encodedPhone) {
            try {
                // Clean and decode the phone number
                const cleanBase64 = (params.encodedPhone as string)
                    .replace(/-/g, '+')
                    .replace(/_/g, '/');

                const decoded = cleanBase64;
                const cleanPhone = decoded.replace(/\D/g, ''); // Remove non-digits

                setDecodedPhone(cleanPhone);

                // Fetch customer details after decoding
                fetchCustomerDetails(params.encodedPhone as string);
            } catch (err) {
                setDecodedPhone('Invalid phone');
                console.error('Decoding error:', err);
            }
        }
    }, [params]);

    if (loading) {
        if (loading) {
            return (
                <>
                    {/* Profile Card Skeleton */}
                    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 animate-pulse">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                            <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                                <div className="w-20 h-20 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                <div className="order-3 xl:order-2 w-full">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4 mx-auto xl:mx-0"></div>
                                    <div className="flex flex-col items-center gap-3 xl:flex-row xl:gap-3">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                        <div className="hidden xl:block h-3.5 w-px bg-gray-300 dark:bg-gray-600"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment History Skeleton */}
                    <div className="mt-6 p-6 border border-gray-200 rounded-2xl dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm animate-pulse">
                        <div className="space-y-8">
                            {[...Array(2)].map((_, index) => (
                                <div key={index} className="group relative">
                                    {/* History Header Skeleton */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                                            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                                            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
                                        </div>
                                    </div>

                                    {/* Cards Skeleton */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Card 1 */}
                                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-700/30">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                {[...Array(6)].map((_, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                                                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Card 2 */}
                                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-700/30">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                {[...Array(6)].map((_, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                                                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Card 3 */}
                                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-700/30">
                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                                                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            );
        }
    }

    if (error) {
        return <div className="p-5 text-red-500">Error: {error}</div>;
    }

    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                            <Image
                                width={80}
                                height={80}
                                src="/images/user/owner.jpg"
                                alt="user"
                            />
                        </div>
                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {customerDetails?.customer_basic_details?.customer}
                            </h4>
                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {decodedPhone}
                                </p>
                                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Created At:{" "}
                                    {customerDetails?.customer_basic_details?.createdAt
                                        ? new Date(customerDetails.customer_basic_details.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true, // for AM/PM format
                                        })
                                        : "-"}
                                </p>



                            </div>
                        </div>
                        {/* ... rest of your social media buttons ... */}
                    </div>
                    {/* ... rest of your component ... */}
                </div>
            </div>

            {customerDetails && customerDetails.history && customerDetails.history.length > 0 && (
                <div className="mt-6 p-6 border border-gray-200 rounded-2xl dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                    <div className="space-y-8">
                        {customerDetails?.history.map((entry, index) => (
                            <div key={index} className="group relative">
                                {/* Numbered History Header with subtle background */}
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    {/* Left Section */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full shadow-inner">
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-200">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <h5 className="text-lg font-semibold text-gray-700 dark:text-white/90">
                                            Payment History #{index + 1}
                                        </h5>
                                    </div>

                                    {/* Right Section */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* Payment Type Badge */}
                                        <div className={`px-3 py-2 rounded-lg ${entry.customer?.isPaid
                                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                                            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                                            }`}>
                                            <p className={`${entry.customer?.isPaid
                                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                                                }`}>
                                                {{
                                                    1: "Foreclosure",
                                                    2: "Settlement",
                                                    3: "Part Payment",
                                                }[entry.customer?.payment_type] || "None"}
                                            </p>
                                        </div>

                                        {/* Verified By Badge */}
                                        <div className={`px-3 py-2 rounded-lg ${entry.customer?.isPaid
                                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                                            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                                            }`}>
                                            <p className={`${entry.customer?.isPaid
                                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                                                }`}>
                                                Verified By -
                                                {entry?.customer?.verified_by || "None"}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-2 rounded-lg ${entry.customer?.isPaid
                                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                                            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                                            }`}>

                                            <small
                                                className={`${entry.customer?.isPaid
                                                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                                                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                                                    }`}
                                            >
                                                {entry?.customer?.createdAt
                                                    ? new Date(entry?.customer?.createdAt).toLocaleString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                        hour12: true, // for AM/PM format
                                                    })
                                                    : "-"}
                                            </small>


                                        </div>
                                    </div>
                                </div>


                                {/* Duplicate Payment Cards Container */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* First Card */}
                                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-700/30 hover:shadow-md transition-shadow">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {/* Login Status */}
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">ForeClosure</p>
                                                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600/20 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        ₹ {entry.customer?.fore_closure}
                                                    </p>

                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">ForeClosure Reward</p>
                                                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600/20 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        ₹ {entry.customer?.foreclosure_reward?.$numberDecimal}

                                                    </p>

                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Settlement</p>
                                                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600/20 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        ₹ {entry.customer?.settlement?.$numberDecimal}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Settlement Reward</p>
                                                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600/20 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        ₹ {entry.customer?.settlement_reward?.$numberDecimal}

                                                    </p>

                                                </div>
                                            </div>


                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Min. Part Payment</p>
                                                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600/20 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        ₹ {entry.customer?.minimum_part_payment?.$numberDecimal}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Part Payment Reward</p>
                                                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600/20 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        ₹ {entry.customer?.minimum_part_payment_reward?.$numberDecimal}

                                                    </p>

                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                    {/* Second Card  */}
                                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-700/30 hover:shadow-md transition-shadow">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Coupon Code</p>
                                                <div className={`px-3 py-2 rounded-lg ${entry.customer?.isPaid
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                                    }`}>
                                                    <p className="text-sm font-medium">
                                                        {entry.coupon?.coupon_code ? entry.coupon?.coupon_code : "-"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Coupon Generated Date</p>
                                                <div className={`px-3 py-2 rounded-lg ${entry.customer?.isPaid
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                                    }`}>
                                                    <p className="text-sm font-medium">

                                                        {" "}
                                                        {entry?.coupon?.createdAt
                                                            ? new Date(entry?.coupon?.createdAt).toLocaleDateString("en-GB", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                                // hour: "2-digit",
                                                                // minute: "2-digit",
                                                                // second: "2-digit",
                                                                // hour12: true, // for AM/PM format
                                                            })
                                                            : "-"}
                                                    </p>
                                                </div>
                                            </div>


                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Amt.</p>
                                                <div className={`px-3 py-2 rounded-lg ${entry.customer?.isPaid
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                                    }`}>
                                                    <p className="text-sm font-medium">
                                                        {entry.coupon?.amount?.$numberDecimal ? ` ₹ ${entry.coupon?.amount?.$numberDecimal}` : " - "}

                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Validity</p>
                                                <div className={`px-3 py-2 rounded-lg ${entry.customer?.isPaid
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                                    }`}>
                                                    <p className="text-sm font-medium">
                                                        {entry.coupon?.validity ? `Duration - ${entry.coupon.validity} Days` : "Duration - "}<br></br>
                                                        <span className={`${entry?.coupon?.isActive == 1
                                                            ? "text-green-800 dark:text-green-300"
                                                            : " p-1 text-red-800 dark:text-red-300"
                                                            }`}>Status  {entry.coupon?.isActive == 1 && entry.customer?.isPaid ? ` - Active` : !entry.coupon?.isActive && entry.customer?.isPaid ? " - Expired" : " -"}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Scratch</p>
                                                <div className={`px-3 py-2 rounded-lg ${entry.customer?.isPaid
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                                    }`}>
                                                    <p className="text-sm font-medium">
                                                        {entry.coupon?.scratched ? `Scratched` : "-"}

                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Redeemed</p>
                                                <div className={`px-3 py-2 rounded-lg ${entry.customer?.isPaid
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                                    }`}>
                                                    <p className="text-sm font-medium">
                                                        {entry.coupon?.redeemed ? `Redeemed` : "-"}

                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Third Card */}
                                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-700/30 hover:shadow-md transition-shadow">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">



                                            {/* Screenshot */}
                                            <div className="sm:col-span-2 space-y-1">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Screenshot</p>
                                                {entry?.screenshots?.screen_shot ? (
                                                    <div
                                                        className="relative overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 transition-all hover:shadow-lg cursor-pointer"
                                                        onClick={() => {
                                                            const link = document.createElement('a');
                                                            link.href = entry?.screenshots?.screen_shot || "";
                                                            link.download = `payment-${index + 1}-screenshot.jpg`;
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                        }}
                                                    >
                                                        <Image
                                                            src={entry.screenshots.screen_shot}
                                                            alt="Payment screenshot"
                                                            width={400}
                                                            height={250}
                                                            className="w-full h-auto object-cover transition-opacity group-hover:opacity-90"
                                                        />
                                                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="bg-black/70 text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                                Download
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="px-3 py-8 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">No screenshot available</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </>
    );
}
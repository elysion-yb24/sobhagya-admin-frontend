import React from 'react';
import AstrologerDetailsComponent from '@/components/dashboard/components-dashboard-astrologers-id'; // ✅ Import the new component

// ✅ Define complete IAstrologer interface
interface IAstrologer {
  _id: string;
  name: string;
  phone?: string;
  isVerified: boolean;
  isDetailsFilled: boolean;
  isKycDone: boolean;
  leadStatus: string;
  interviewStatus: string;
  languages: string[];
  specializations: string[];
  createdAt: string;
  updatedAt: string;
  yearsOfExperience: number;
  displayName: string;
  displayPic?: string;
  __v: number;
}

// ✅ Define complete IKyc interface
interface IKyc {
  _id: string;
  astrologerId: string;
  aadharBackFile?: string;
  aadharFrontFile?: string;
  aadharNumber?: string;
  panFile?: string;
  panNumber?: string;
  displayName: string;
  displayPic?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  page1Filled?: boolean; // ✅ Now explicitly mentioning their purpose
  page2Filled?: boolean;
  page3Filled?: boolean;
  page4Filled?: boolean;
  bankDetails?: {
    accountHolderName?: string;
    bankAccountNumber?: string;
    branchName?: string;
    cancelledCheque?: string;
    ifscCode?: string;
    upiId?: string;
  };
}

// ✅ Define FetchResponse type
interface FetchResponse {
  success: boolean;
  message?: string;
  data?: {
    astrologer: IAstrologer;
    kyc: IKyc | null;
  };
}

// ✅ Define Props for Next.js Dynamic Route
type AstrologerPageProps = {
  params: { id: string };
};

export default async function SingleAstrologerPage({ params }: AstrologerPageProps) {
  const { id } = params;

  // Fetch astrologer data from the backend
  const res = await fetch(`https://sobhagya-partner.vercel.app/api/admin/astrologers/${id}`, {
    cache: 'no-store', // Ensures fresh data every time
  });

  let data: FetchResponse;
  try {
    data = (await res.json()) as FetchResponse;
    console.log("Fetched Astrologer Data:", data.data?.astrologer);
    console.log("Fetched KYC Data:", data.data?.kyc);
  } catch (error) {
    console.error("Error parsing response:", error);
    return (
      <div className="p-6">
        <h1>Error parsing response.</h1>
      </div>
    );
  }

  // Handle unsuccessful responses
  if (!data.success || !data.data) {
    console.error("Error fetching astrologer details:", data.message);
    return (
      <div className="p-6 text-red-500">
        <h1>{data.message || 'Error fetching astrologer details.'}</h1>
      </div>
    );
  }

  return (
    <AstrologerDetailsComponent astrologer={data.data.astrologer} kyc={data.data.kyc} />
  );
}

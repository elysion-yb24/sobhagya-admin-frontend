"use client";

import React, { useState } from "react";  // <-- Import useState
import { format } from "date-fns";
import ActionButtonsComponent from "./components-dashboard-astrologers-actions";

// Define the shape of your data
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
}

interface IBankDetails {
  accountHolderName?: string;
  bankAccountNumber?: string;
  branchName?: string;
  cancelledCheque?: string;
  ifscCode?: string;
  upiId?: string;
}

interface IKyc {
  _id: string;
  astrologerId: string;
  aadharBackFile?: string;
  aadharFrontFile?: string;
  aadharNumber?: string;
  createdAt: string;
  updatedAt: string;
  page1Filled?: boolean;
  page2Filled?: boolean;
  page3Filled?: boolean;
  page4Filled?: boolean;
  panFile?: string;
  panNumber?: string;
  displayName?: string;
  displayPic?: string;
  bankDetails?: IBankDetails;
}

interface Props {
  astrologer: IAstrologer;
  kyc: IKyc | null;
}

const AstrologerDetailsComponent: React.FC<Props> = ({ astrologer, kyc }) => {
  // Local state for handling image modal
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Functions to open/close modal
  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Date formatter
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPPp");
    } catch {
      return dateString;
    }
  };

  // Badge helper function for true/false (Filled/Pending)
  const statusBadge = (value: boolean | undefined) => (
    <span
      className={`inline-block px-3 py-1 text-sm font-medium rounded-md ${
        value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {value ? "Filled" : "Pending"}
    </span>
  );

  return (
    <div>
      {/* Header with Astrologer Display Name or Name */}
      <h2 className="text-3xl font-semibold text-center">
        {astrologer.displayName || astrologer.name}
      </h2>

      <div className="mx-auto mt-6 w-full rounded-lg bg-white shadow-lg p-6">
        {/* Heading */}
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Detailed Information</h1>

        {/* Personal Details */}
        <div className="rounded-lg border bg-gray-50 p-4 shadow-sm mb-4 ">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Personal Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p>
              <strong>ID:</strong> {astrologer._id}
            </p>
            <p>
              <strong>Years of Experience:</strong> {astrologer.yearsOfExperience}
            </p>
            <p>
              <strong>Name:</strong> {astrologer.name}
            </p>
            <p>
              <strong>Languages:</strong> {astrologer.languages.join(", ")}
            </p>
            <p>
              <strong>Phone:</strong> {astrologer.phone}
            </p>
            <p>
              <strong>Specializations:</strong> {astrologer.specializations.join(", ")}
            </p>
          </div>
        </div>

        {/* Status Information */}
        <div className="rounded-lg border bg-gray-50 p-4 shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Status Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p>
              <strong>Verification Details:</strong> {statusBadge(astrologer.isVerified)}
            </p>
            <p>
              <strong>Interview Status:</strong> {astrologer.interviewStatus}
            </p>
            <p>
              <strong>Details:</strong> {statusBadge(astrologer.isDetailsFilled)}
            </p>
            <p>
              <strong>Lead Status:</strong> {astrologer.leadStatus}
            </p>
            <p>
              <strong>KYC Information:</strong> {statusBadge(astrologer.isKycDone)}
            </p>
          </div>
        </div>

        {/* KYC STATUS Section */}
        <div className="rounded-lg border bg-gray-50 p-4 shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">KYC STATUS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p>
              <strong>Aadhar Card Page:</strong> {statusBadge(kyc?.page1Filled)}
            </p>
            <p>
              <strong>PAN Card Page:</strong> {statusBadge(kyc?.page2Filled)}
            </p>
            <p>
              <strong>Profile Page:</strong> {statusBadge(kyc?.page3Filled)}
            </p>
            <p>
              <strong>Bank Details Page:</strong> {statusBadge(kyc?.page4Filled)}
            </p>
          </div>
        </div>

        {/* Timestamp Information */}
        <div className="rounded-lg border bg-gray-50 p-4 shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Timestamp Info</h2>
          <p className="mb-2">
            <strong>Created At:</strong> {formatDate(astrologer.createdAt)}
          </p>
          <p className="mb-2">
            <strong>Updated At:</strong> {formatDate(astrologer.updatedAt)}
          </p>
        </div>

        {/* KYC Details */}
        <div className="rounded-lg border bg-gray-50 p-4 shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">KYC Details</h2>
          {kyc ? (
            <div className="space-y-6">
              {/* Aadhar Number */}
              <p>
                <strong>Aadhar Number:</strong> {kyc.aadharNumber}
              </p>

              {/* Aadhar Images (Side by Side) */}
              <div className="flex flex-col sm:flex-row gap-4">
                {kyc.aadharFrontFile && (
                  <div>
                    <p className="font-semibold">Aadhar Front:</p>
                    <img
                      src={kyc.aadharFrontFile}
                      alt="Aadhar Front"
                      className="h-40 w-auto rounded shadow-md"
                    />
                    <button
                      onClick={() => openModal(kyc.aadharFrontFile!)}
                      className="text-blue-500 underline ml-2"
                    >
                      View
                    </button>
                  </div>
                )}
                {kyc.aadharBackFile && (
                  <div>
                    <p className="font-semibold">Aadhar Back:</p>
                    <img
                      src={kyc.aadharBackFile}
                      alt="Aadhar Back"
                      className="h-40 w-auto rounded shadow-md"
                    />
                    <button
                      onClick={() => openModal(kyc.aadharBackFile!)}
                      className="text-blue-500 underline ml-2"
                    >
                      View
                    </button>
                  </div>
                )}
              </div>

              {/* PAN Number */}
              <p>
                <strong>PAN Number:</strong> {kyc.panNumber}
              </p>

              {/* PAN Image */}
              {kyc.panFile && (
                <div>
                  <p className="font-semibold">PAN Card:</p>
                  <img
                    src={kyc.panFile}
                    alt="PAN Card"
                    className="h-40 w-auto rounded shadow-md"
                  />
                  <button
                    onClick={() => openModal(kyc.panFile!)}
                    className="text-blue-500 underline ml-2"
                  >
                    View
                  </button>
                </div>
              )}

              {/* KYC Display Name & Pic (If they exist in KYC) */}
              {kyc.displayName && (
                <p>
                  <strong>Display Name (KYC):</strong> {kyc.displayName}
                </p>
              )}
              {kyc.displayPic && (
                <div>
                  <p className="font-semibold">KYC Display Picture:</p>
                  <img
                    src={kyc.displayPic}
                    alt="KYC Display Picture"
                    className="h-40 w-auto rounded shadow-md"
                  />
                  <button
                    onClick={() => openModal(kyc.displayPic!)}
                    className="text-blue-500 underline ml-2"
                  >
                    View
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No KYC record found for this astrologer.</p>
          )}
        </div>

        {/* Display Picture (from Astrologer Document) */}
        <div className="flex flex-col items-center my-1">
          {astrologer.displayPic && (
            <div className="flex flex-col items-center">
              <img
                src={astrologer.displayPic}
                alt="Profile"
                className="w-32 h-32 rounded-full shadow-md border mb-2"
              />
              <button
                onClick={() => openModal(astrologer.displayPic!)}
                className="text-blue-500 underline"
              >
                View
              </button>
            </div>
          )}
        </div>

        {/* Bank Details (If KYC exists) */}
        {kyc?.bankDetails && (
          <div className="rounded-lg border bg-gray-50 p-4 shadow-sm mb-4">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Bank Details</h2>
            <p>
              <strong>Account Holder Name:</strong>{" "}
              {kyc.bankDetails.accountHolderName}
            </p>
            <p>
              <strong>Bank Account Number:</strong>{" "}
              {kyc.bankDetails.bankAccountNumber}
            </p>
            <p>
              <strong>Branch Name:</strong> {kyc.bankDetails.branchName}
            </p>
            <p>
              <strong>IFSC Code:</strong> {kyc.bankDetails.ifscCode}
            </p>
            <p>
              <strong>UPI ID:</strong> {kyc.bankDetails.upiId}
            </p>
            {kyc.bankDetails.cancelledCheque && (
              <div className="mt-2">
                <p className="font-semibold">Cancelled Cheque:</p>
                <img
                  src={kyc.bankDetails.cancelledCheque}
                  alt="Cancelled Cheque"
                  className="h-40 w-auto rounded shadow-md"
                />
                <button
                  onClick={() =>
                    openModal(kyc.bankDetails!.cancelledCheque!)
                  }
                  className="text-blue-500 underline ml-2"
                >
                  View
                </button>
              </div>
            )}
          </div>
        )}

        {/* Admin Controllers */}
        <div className="rounded-lg border bg-gray-50 p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            ADMIN CONTROLLERS
          </h2>
          <ActionButtonsComponent astrologerId={astrologer._id} />
        </div>
      </div>

      {/* MODAL OVERLAY */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-white rounded-lg shadow-md p-4 max-w-full max-h-full">
            <img
              src={selectedImage}
              alt="Enlarged View"
              className="max-w-screen max-h-[80vh] mx-auto"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-2xl font-bold text-gray-600"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AstrologerDetailsComponent;

"use client";

import React, { useState } from "react";
import Swal from "sweetalert2"; // For improved pop-up UI

interface ActionButtonsProps {
  astrologerId: string;
}

const ActionButtonsComponent: React.FC<ActionButtonsProps> = ({
  astrologerId,
}) => {
  // -------------------------------------------------------
  // States for Validate (Interview) Modal
  // -------------------------------------------------------
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  // For the 12-hour time format (hours, minutes, AM/PM)
  const [validateHour, setValidateHour] = useState("10");
  const [validateMinute, setValidateMinute] = useState("00");
  const [validateAmPm, setValidateAmPm] = useState<"AM" | "PM">("AM");

  // -------------------------------------------------------
  // States for Update (Prices) Modal - Time Removed
  // -------------------------------------------------------
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [audioPrice, setAudioPrice] = useState("");
  const [videoPrice, setVideoPrice] = useState("");

  // -------------------------------------------------------
  // States for Set KYC Notification Modal
  // -------------------------------------------------------
  const [showKycNotifModal, setShowKycNotifModal] = useState(false);
  const [kycNotification, setKycNotification] = useState("");

  // -------------------------------------------------------
  // Reject Astrologer
  // -------------------------------------------------------
  const handleRejectAstrologer = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to reject this astrologer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Reject!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(
          `https://sobhagya-partner.vercel.app/api/admin/astrologers/${astrologerId}/reject`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();

        if (response.ok) {
          Swal.fire("Rejected!", "The astrologer has been rejected.", "success");
        } else {
          Swal.fire("Error!", data.message || "Failed to reject astrologer.", "error");
        }
      } catch (error) {
        Swal.fire("Error!", "Something went wrong while rejecting.", "error");
      }
    }
  };

  // -------------------------------------------------------
  // Onboard Astrologer
  // -------------------------------------------------------
  const handleOnboardAstrologer = async () => {
    const confirm = await Swal.fire({
      title: "Confirm Onboarding",
      text: "Are you sure you want to onboard this astrologer?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Onboard!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(
          `https://sobhagya-partner.vercel.app/api/admin/astrologers/${astrologerId}/onboard`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();

        if (response.ok) {
          Swal.fire("Onboarded!", "The astrologer has been successfully onboarded.", "success");
        } else {
          Swal.fire("Error!", data.message || "Failed to onboard astrologer.", "error");
        }
      } catch (error) {
        Swal.fire("Error!", "Something went wrong while onboarding.", "error");
      }
    }
  };

  // -------------------------------------------------------
  // Validate Astrologer -> Show Interview Modal
  // -------------------------------------------------------
  const handleValidateAstrologer = () => {
    setShowValidateModal(true);
  };

  // -------------------------------------------------------
  // Handle Interview Scheduling
  // -------------------------------------------------------
  const handleScheduleInterview = async () => {
    // Ensure a date is provided
    if (!interviewDate) {
      return Swal.fire("Missing Data!", "Please provide a date.", "error");
    }

    // Construct a final time string, e.g. "10:30 AM"
    const finalTimeString = `${validateHour}:${validateMinute} ${validateAmPm}`;

    try {
      const response = await fetch(
        `https://sobhagya-partner.vercel.app/api/admin/astrologers/${astrologerId}/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interviewDate,
            interviewTime: finalTimeString,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Scheduled!", "Interview has been scheduled successfully.", "success");
        // Reset the modal and inputs
        setShowValidateModal(false);
        setInterviewDate("");
        setValidateHour("10");
        setValidateMinute("00");
        setValidateAmPm("AM");
      } else {
        Swal.fire("Error!", data.message || "Failed to schedule interview.", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Something went wrong while scheduling interview.", "error");
    }
  };

  // -------------------------------------------------------
  // Update Astrologer -> Show "Update" Modal
  // -------------------------------------------------------
  const handleUpdateAstrologer = () => {
    setShowUpdateModal(true);
  };

  // -------------------------------------------------------
  // Submit Updated Prices -> POST to /update
  // -------------------------------------------------------
  const handleSubmitUpdatedPrices = async () => {
    if (!audioPrice || !videoPrice) {
      return Swal.fire(
        "Missing Data!",
        "Please provide both audio and video call prices.",
        "error"
      );
    }

    try {
      const response = await fetch(
        `https://sobhagya-partner.vercel.app/api/admin/astrologers/${astrologerId}/update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioPrice,
            videoPrice,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Success!", "Astrologer updated successfully.", "success");
        setShowUpdateModal(false);
        setAudioPrice("");
        setVideoPrice("");
      } else {
        Swal.fire("Error!", data.message || "Failed to update astrologer.", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Something went wrong while updating.", "error");
    }
  };

  // -------------------------------------------------------
  // KYC Notification -> Show "KYC Notification" Modal
  // -------------------------------------------------------
  const handleSetKYCNotification = () => {
    setShowKycNotifModal(true);
  };

  // -------------------------------------------------------
  // Submit KYC Notification -> POST to /kycnotif
  // -------------------------------------------------------
  const handleSubmitKycNotification = async () => {
    if (!kycNotification.trim()) {
      return Swal.fire(
        "Missing Data!",
        "Please provide a KYC notification message.",
        "error"
      );
    }

    try {
      const response = await fetch(
        `https://sobhagya-partner.vercel.app/api/admin/astrologers/${astrologerId}/kycnotif`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kycNotification,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Success!", "KYC notification has been sent.", "success");
        setShowKycNotifModal(false);
        setKycNotification("");
      } else {
        Swal.fire("Error!", data.message || "Failed to send KYC notification.", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Something went wrong while sending notification.", "error");
    }
  };

  return (
    <>
      {/* MAIN ACTION CARDS in a RESPONSIVE GRID */}
      <div className="mx-auto max-w-6xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1) VALIDATE ASTROLOGER */}
          <div className="relative bg-white shadow-md border border-gray-200 rounded-lg p-6 flex flex-col justify-between h-32 hover:shadow-lg transition-shadow duration-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Validate Astrologer
              </h3>
              <p className="text-sm text-gray-600">
                Verify details and schedule an interview.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition mt-1"
                onClick={handleValidateAstrologer}
              >
                Validate
              </button>
            </div>
          </div>

          {/* 2) UPDATE ASTROLOGER */}
          <div className="relative bg-white shadow-md border border-gray-200 rounded-lg p-6 flex flex-col justify-between h-32 hover:shadow-lg transition-shadow duration-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Update Astrologer
              </h3>
              <p className="text-sm text-gray-600">
                Update interview status &amp; set prices.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-yellow-600 text-white px-4 py-2 rounded-md font-medium hover:bg-yellow-700 transition mt-1"
                onClick={handleUpdateAstrologer}
              >
                Update
              </button>
            </div>
          </div>

          {/* 3) SET KYC NOTIFICATION */}
          <div className="relative bg-white shadow-md border border-gray-200 rounded-lg p-6 flex flex-col justify-between h-32 hover:shadow-lg transition-shadow duration-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Set KYC Notification
              </h3>
              <p className="text-sm text-gray-600">
                Notify astrologer for pending KYC.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 transition mt-1"
                onClick={handleSetKYCNotification}
              >
                Set Notification
              </button>
            </div>
          </div>

          {/* 4) ONBOARD ASTROLOGER */}
          <div className="relative bg-white shadow-md border border-gray-200 rounded-lg p-6 flex flex-col justify-between h-32 hover:shadow-lg transition-shadow duration-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Onboard Astrologer
              </h3>
              <p className="text-sm text-gray-600">
                Approve and onboard to the platform.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition mt-1"
                onClick={handleOnboardAstrologer}
              >
                Onboard
              </button>
            </div>
          </div>

          {/* 5) REJECT ASTROLOGER */}
          <div className="relative bg-white shadow-md border border-gray-200 rounded-lg p-6 flex flex-col justify-between h-32 hover:shadow-lg transition-shadow duration-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Reject Astrologer
              </h3>
              <p className="text-sm text-gray-600">
                Remove astrologer from the platform.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition mt-1"
                onClick={handleRejectAstrologer}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VALIDATE MODAL (Interview Scheduling) */}
      {showValidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Schedule Interview</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Date
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Time
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={validateHour}
                  onChange={(e) => setValidateHour(e.target.value)}
                  className="border rounded-md px-2 py-1 focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hr) => (
                    <option key={hr} value={hr.toString()}>
                      {hr}
                    </option>
                  ))}
                </select>
                <span>:</span>
                <select
                  value={validateMinute}
                  onChange={(e) => setValidateMinute(e.target.value)}
                  className="border rounded-md px-2 py-1 focus:outline-none"
                >
                  {["00", "15", "30", "45"].map((min) => (
                    <option key={min} value={min}>
                      {min}
                    </option>
                  ))}
                </select>
                <select
                  value={validateAmPm}
                  onChange={(e) => setValidateAmPm(e.target.value as "AM" | "PM")}
                  className="border rounded-md px-2 py-1 focus:outline-none"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowValidateModal(false)}
                className="px-4 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleInterview}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE MODAL (Set Call Prices) */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Astrologer</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Audio Call Price
              </label>
              <input
                type="number"
                value={audioPrice}
                onChange={(e) => setAudioPrice(e.target.value)}
                placeholder="Enter audio call price"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-200"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Call Price
              </label>
              <input
                type="number"
                value={videoPrice}
                onChange={(e) => setVideoPrice(e.target.value)}
                placeholder="Enter video call price"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-200"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitUpdatedPrices}
                className="px-4 py-2 rounded-md bg-yellow-600 text-white hover:bg-yellow-700 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KYC NOTIFICATION MODAL */}
      {showKycNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Set KYC Notification</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Message
              </label>
              <textarea
                value={kycNotification}
                onChange={(e) => setKycNotification(e.target.value)}
                placeholder="Enter a brief KYC notification..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowKycNotifModal(false)}
                className="px-4 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitKycNotification}
                className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionButtonsComponent;

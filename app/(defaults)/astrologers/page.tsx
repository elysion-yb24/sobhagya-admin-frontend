'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies'; // 👈 Import nookies
import AstrologerComponent from '@/components/dashboard/components-dashboard-astrologers';

interface IAstrologer {
  _id: string;
  name: string;
  // Add other fields as needed
}

export default function AstrologersPage() {
  const [astrologers, setAstrologers] = useState<IAstrologer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAstrologers = async () => {
      console.log("[Frontend] Starting fetchAstrologers...");

      setLoading(true);
      setError(null);

      try {
        // 1) Parse cookies to retrieve our token
        const cookies = parseCookies(); 
        console.log("[Frontend] cookies:", cookies);
        const token = cookies.access_token; // 👈 Read "token" from cookies
        console.log("[Frontend] Found token in cookies:", token);

        // 2) Make request with Authorization header
        const response = await axios.get("https://sobhagya-partner.vercel.app/api/admin/astrologers", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,  // <-- pass token here
          },
        });
        

        console.log("[Frontend] Response received:", response.data);

        if (response.data.success) {
          setAstrologers(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch astrologers.');
        }
      } catch (err) {
        console.error('[Frontend] Error fetching astrologers:', err);
        setError('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  if (loading) {
    return <div className="p-6">Loading astrologers...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 mb-2">
      <h1 className="text-2xl font-bold"></h1>
      <AstrologerComponent astrologers={astrologers} />
    </div>
  );
}

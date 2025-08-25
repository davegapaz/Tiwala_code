// Demo user data for hackathon prototype

// Helper function to calculate trust level
export function calculateAntas(tiwalaIndex) {
  if (tiwalaIndex >= 950) return "Alamat";
  if (tiwalaIndex >= 800) return "Katiwala"; 
  if (tiwalaIndex >= 600) return "Matatag";
  if (tiwalaIndex >= 400) return "Umuusbong";
  return "Baguhan";
}

export const demoUsers = [
  {
    id: "maria",
    name: "Maria Santos",
    tiwalaIndex: 820,
    antas: "Katiwala",
    profileImage: "👩‍🌾",
    directReferrals: 5,
    onTimePayments: 23,
    totalReferrals: 5,
    monthlyReferrals: 1,
    joinedDate: "2023-05-15",
    location: "Nueva Ecija",
    phoneNumber: "+63 917 123 4567",
    referrals: [
      {
        id: "juan",
        name: "Juan dela Cruz",
        tiwalaIndex: 650,
        antas: "Matatag",
        dateReferred: "2023-08-10",
        status: 'active',
        relationship: "Kapitbahay",
        profileImage: "👨‍🌾",
        phoneNumber: "+63 917 234 5678"
      },
      {
        id: "carlos",
        name: "Carlos Mendoza", 
        tiwalaIndex: 580,
        antas: "Umuusbong",
        dateReferred: "2023-09-15",
        status: 'needs_support',
        relationship: "Kaibigan",
        profileImage: "👨‍💼",
        phoneNumber: "+63 917 345 6789"
      },
      {
        id: "ana",
        name: "Ana Reyes",
        tiwalaIndex: 720,
        antas: "Matatag", 
        dateReferred: "2023-10-01",
        status: 'active',
        relationship: "Kaibigan",
        profileImage: "👩‍💼",
        phoneNumber: "+63 917 456 7890"
      }
    ],
    paymentHistory: Array.from({length: 23}, (_, i) => ({
      id: `payment_${i}`,
      date: new Date(2023, 5 + i, 15).toISOString().split('T')[0],
      amount: 2500,
  status: 'on_time',
      daysLate: 0
    }))
  },
  {
    id: "juan",
    name: "Juan dela Cruz", 
    tiwalaIndex: 650,
    antas: "Matatag",
    profileImage: "👨‍🌾",
    directReferrals: 2,
    onTimePayments: 15,
    totalReferrals: 2,
    monthlyReferrals: 0,
    joinedDate: "2023-08-10",
    location: "Pangasinan",
    phoneNumber: "+63 917 234 5678",
    referrals: [
      {
        id: "rosa",
        name: "Rosa Cruz",
        tiwalaIndex: 450,
        antas: "Umuusbong",
        dateReferred: "2023-11-05",
        status: 'active',
        relationship: "Kapatid",
        profileImage: "👩‍🌾",
        phoneNumber: "+63 917 567 8901"
      }
    ],
    paymentHistory: Array.from({length: 15}, (_, i) => ({
      id: `payment_${i}`,
      date: new Date(2023, 8 + i, 10).toISOString().split('T')[0],
      amount: 2000,
  status: 'on_time'
    }))
  },
  {
    id: "carlos", 
    name: "Carlos Mendoza",
    tiwalaIndex: 380,
    antas: "Baguhan",
    profileImage: "👨‍💼",
    directReferrals: 0,
    onTimePayments: 8,
    totalReferrals: 0,
    monthlyReferrals: 0,
    joinedDate: "2023-09-15",
    location: "Bulacan",
    phoneNumber: "+63 917 345 6789",
    referrals: [],
    paymentHistory: Array.from({length: 10}, (_, i) => ({
      id: `payment_${i}`,
      date: new Date(2023, 9 + i, 15).toISOString().split('T')[0],
      amount: 1500,
  status: i < 8 ? 'on_time' : 'late',
      daysLate: i >= 8 ? 3 : 0
    }))
  },
  {
    id: "ana",
    name: "Ana Reyes",
    tiwalaIndex: 720,
    antas: "Matatag",
    profileImage: "👩‍💼",
    directReferrals: 3,
    onTimePayments: 18,
    totalReferrals: 3,
    monthlyReferrals: 2,
    joinedDate: "2023-10-01", 
    location: "Bataan",
    phoneNumber: "+63 917 456 7890",
    referrals: [
      {
        id: "pedro", 
        name: "Pedro Ramos",
        tiwalaIndex: 520,
        antas: "Umuusbong",
        dateReferred: "2024-01-10",
        status: 'active',
        relationship: "Kasama sa Trabaho",
        profileImage: "👨‍🔧",
        phoneNumber: "+63 917 678 9012"
      }
    ],
    paymentHistory: Array.from({length: 18}, (_, i) => ({
      id: `payment_${i}`,
      date: new Date(2023, 10 + i, 1).toISOString().split('T')[0],
      amount: 3000,
  status: 'on_time'
    }))
  }
];
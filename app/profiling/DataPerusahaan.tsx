"use client";

import axios from "axios";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface DataPerusahaanProps {
  data: {
    name: string;
    address: string;
    // Add other fields as needed
  };
}

const DataPerusahaan: FC<DataPerusahaanProps> = ({ data }) => {
  const [rsData, setRsData] = useState<{
    name: string;
    address: string;
    npwp: string;
    noIpak: string;
    alamatNpwp: string;
    jumlahProformaInvoice: number;
  }>({
    name: "",
    address: "",
    npwp: "",
    noIpak: "",
    alamatNpwp: "",
    jumlahProformaInvoice: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/customer-profilling/get-by-search",
          data,
        );
        if (response.data.status) {
          const customer = response.data.customer[0];
          const responseData = response.data;
          setRsData({
            name: customer.name,
            address: customer.address,
            npwp: customer.npwp,
            noIpak: customer.ipak_number,
            alamatNpwp: customer.npwp_address,
            jumlahProformaInvoice: responseData.jumlah_pi,
          });
        } else {
          console.error("Data not found");
          // Handle error or set default values
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [data]);

  return (
    <section className="flex">
      <Image
        className="aspect-[183/238] max-h-[238] max-w-[185px] rounded-md object-cover"
        height={2000}
        width={2000}
        alt="placeholder-image"
        src="/sales_image.jpg"
      />

      <div className="ml-8 flex flex-col justify-between">
        <div>
          <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">
            Nama Dokter : {rsData.name}
          </h1>
          <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">
            Nama Company : {rsData.name}
          </h1>
          <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">
            Alamat : {rsData.address}
          </h1>
          <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">
            NPWP : {rsData.npwp}
          </h1>
          <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">
            No. IPAK : {rsData.noIpak}
          </h1>
          <h1 className="text-[1.85vh] font-bold leading-[2.5vh]">
            Alamat NPWP : {rsData.alamatNpwp}
          </h1>
        </div>
        <div className="mt-4 text-[1.3vh]">
          <h2 className="font-bold opacity-50">
            JUMLAH PROFORMA INVOICE : {rsData.jumlahProformaInvoice}
          </h2>
          {/* Add other fields as needed */}
          <h2 className="font-bold opacity-50">JUMLAH PURCHASE ORDER</h2>
        </div>
      </div>
    </section>
  );
};

export default DataPerusahaan;

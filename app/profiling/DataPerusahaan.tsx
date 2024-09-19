"use client";

import { Divider } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface DataPerusahaanProps {
  data: {
    name: string;
    address: string;
  };
}

const DataPerusahaan: FC<DataPerusahaanProps> = ({ data }) => {
  const [rsData, setRsData] = useState<{
    name: string;
    address_company: string;
    npwp: string;
    noIpak: string;
    alamatNpwp: string;
    jumlahProformaInvoice: number;
  }>({
    name: "",
    address_company: "",
    npwp: "",
    noIpak: "",
    alamatNpwp: "",
    jumlahProformaInvoice: 0,
  });

  const [dokterData, setDokterData] = useState<
    { name: string; number_phone_item: string; email_item: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/customer-profilling/get-by-search",
          data
        );
        if (response.data.status) {
          const customer = response.data.customer[0];
          const responseData = response.data;
          setRsData({
            name: customer.name,
            address_company: customer.address_company,
            npwp: customer.npwp,
            noIpak: customer.ipak_number,
            alamatNpwp: customer.npwp_address,
            jumlahProformaInvoice: responseData.jumlah_pi,
          });

          // Set dokter data dari customer response
          setDokterData(
            response.data.customer.map((item: any) => ({
              name: item.docktor_name,
              number_phone_item: item.number_phone_item,
              email_item: item.email_item,
            }))
          );
        } else {
          console.error("Data not found");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [data]);

  return (
    <div>
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
              Alamat : {rsData.address_company}
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
            <h2 className="font-bold opacity-50">JUMLAH PURCHASE ORDER</h2>
          </div>
        </div>
      </section>

      <br />
      <Divider />

      <h1 className="font-bold text-xl mt-4">Dokter Terdaftar</h1>

      <table className="w-full text-left mt-6 border-separate border-spacing-0 rounded-lg overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-blue-900 text-white">
            <th className="px-4 py-3 border-b border-blue-900">NO</th>
            <th className="px-4 py-3 border-b border-blue-900">NAMA DOKTER</th>
            <th className="px-4 py-3 border-b border-blue-900">TELEPON DOKTER</th>
            <th className="px-4 py-3 border-b border-blue-900">EMAIL DOKTER</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {dokterData.map((dokter, index) => (
            <tr key={index} className="even:bg-gray-100">
              <td className="px-4 py-2 border-b border-gray-300">{index + 1}</td>
              <td className="px-4 py-2 border-b border-gray-300">{dokter.name}</td>
              <td className="px-4 py-2 border-b border-gray-300">{dokter.number_phone_item}</td>
              <td className="px-4 py-2 border-b border-gray-300">{dokter.email_item}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataPerusahaan;

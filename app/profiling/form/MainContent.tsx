"use client";

import { useEffect, useState } from "react";
import { Button, Divider, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const MainContent = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [hospitalSuggestions, setHospitalSuggestions] = useState<string[]>([]);
  const [hospitalData, setHospitalData] = useState<any[]>([]);

  useEffect(() => {

    const fetchHospitalData = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/proforma-invoice/rs-list",
        );
        setHospitalData(res.data.data);
      } catch (error) {
        console.error("Error fetching hospital data", error);
      }
    };

    fetchHospitalData();
  }, []);

  // State untuk menyimpan value dropdown divisi
  const [kategoriDivisi, setKategoriDivisi] = useState("");

  // Fungsi untuk menangani submit form
  const onSubmit = async (data: Record<string, string | boolean>) => {
    console.log("Divis : " + kategoriDivisi);
    let divisi = "";

    if (kategoriDivisi === "supplier") {
      divisi = "3";
    } else if (kategoriDivisi === "customer") {
      divisi = "1";
    } else if (kategoriDivisi === "customer_non_rumah_sakit") {
      divisi = "2";
    }

    const requestBody = {
      nama_perusahaan: data.nama_perusahaan,
      address_perusahaan: data.address_perusahaan,
      npwp_address_perusahaan: data.npwp_address_perusahaan,
      npwp_perusahaan: "data.npwp_perusahaan",
      ipak_number_perusahaan: data.ipak_number_perusahaan,
      alamat_pengirim_facture_perusahaan: data.alamat_pengirim_facture_perusahaan,
      kota_perusahaan: data.kota_perusahaan,
      kode_pos_perusahaan: data.kode_pos_perusahaan,
      telpon_perusahaan: data.telpon_perusahaan,
      email_perusahaan: data.email_perusahaan,
      nama_dokter: data.nama_dokter,
      alamat_pengirim_dokter: data.alamat_pengirim_dokter,
      npwp_dokter: data.npwp_dokter,
      telpon_dokter: data.telpon_dokter,
      email_dokter: data.email_dokter,
      pic_dokter: data.pic_dokter,
      kota_dokter: data.kota_dokter,
      kode_pos_dokter: data.kode_pos_dokter,
      handphone_dokter: data.handphone_dokter,
      kode_pajak_dokter: data.kode_pajak_dokter,
      cp_dokter: data.cp_dokter,
      verifikasi_dokter: data.verifikasi_dokter,
      pembuat_cp_dokter: data.pembuat_cp,
      term_of_payment: data.term_of_payment,
      kategori_divisi: divisi,
    };

    try {
      Swal.fire({
        title: "Apakah Kamu Yakin?",
        text: "Apakah kamu yakin ingin data ini di input ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.post("http://localhost:8080/api/customer-profilling/add", requestBody);
            router.push("/profiling");
            Swal.fire("Nice!", "Data telah di input ke system!.", "success");
          } catch (error) {
            console.error("Error submitting data", error);
            Swal.fire("Error!", "Terjadi kesalahan saat mengirim data.", "error");
          }
        }
      });
    } catch (error) {
      console.error("Error processing request", error);
    }
  };


  const handleHospitalSuggestionClick = (suggestion: string) => {
    const selectedHospital = hospitalData.find(
      (hospital) => hospital.name === suggestion,
    );
    if (selectedHospital) {
      setResponseData((prevData) => ({
        ...prevData,
        rumah_sakit: selectedHospital.name,
        alamat: selectedHospital.address_company,
        id_rumah_sakit: selectedHospital.id.toString(), // Menyetel ID Rumah Sakit secara otomatis
      }));
      setHospitalSuggestions([]);
    }
  };

  return (
    <div className="flex h-full w-full bg-white flex-col gap-6 p-8 z-50">
      <div className="flex flex-row justify-between gap-6">
        <h1 className="text-xl font-bold">Form Profiling</h1>

        <div>
          <select
            value={kategoriDivisi}
            onChange={(e) => setKategoriDivisi(e.target.value)} // Simpan value ke state
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Pilih Divisi</option>
            <option value="supplier">Supplier</option>
            <option value="customer">Customer</option>
            <option value="customer_non_rumah_sakit">Customer Non Rumah Sakit</option>
          </select>
        </div>
      </div>

      <Divider />

      {kategoriDivisi !== "" && (
        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <h3 className="font-semibold text-lg mb-4">Data Perusahaan</h3>

              {/* Grid untuk PC dan flex untuk mobile */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="relative flex w-full flex-col space-y-2 md:w-1/3">
                  <label className="text-left">Nama Perusahaan</label>

                  <Input
                    {...register("nama_perusahaan")}
                    name="rumah_sakit"
                    placeholder="Nama Perusahaan"
                    className="flex-1 border-none px-2 py-2 outline-none"
                    endContent={
                      <button
                        className="opacity-75"
                        type="button"
                        onClick={() => {
                          const allSuggestions = hospitalData.map(
                            (hospital: { name: string }) => hospital.name,
                          );
                          setHospitalSuggestions(
                            (prevSuggestions) =>
                              prevSuggestions.length > 0 ? [] : allSuggestions, // Toggle suggestions
                          );
                        }}
                      >
                        ▼
                      </button>
                    }
                  />

                  {/* Dropdown Suggestions */}
                  {hospitalSuggestions.length > 0 && (
                    <ul className="absolute top-[4.8rem] z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-2xl border border-gray-300 bg-white">
                      {hospitalSuggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          onClick={() => handleHospitalSuggestionClick(suggestion)}
                          className="cursor-pointer p-2 hover:bg-gray-200"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Input {...register("address_perusahaan")} label="Alamat Perusahaan" className="w-full-lg" />
                <Input {...register("ipak_number_perusahaan")} label="No. IPAK" className="w-full-lg" />
                {/* <Input {...register("npwp_perusahaan")} label="NPWP Perusahaan" className="w-full-lg" /> */}
                <Input {...register("alamat_pengirim_facture_perusahaan")} label="Alamat Pengirim Faktur" className="w-full-lg" />
                <Input {...register("npwp_address_perusahaan")} label="Alamat NPWP Perusahaan" className="w-full-lg" />
                <Input {...register("pic_perusahaan")} label="PIC Perusahaan" className="w-full-lg" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input {...register("email_perusahaan")} label="Email Perusahaan" className="w-full-lg" />
                  <Input {...register("telpon_perusahaan")} label="Telepon Perusahaan" className="w-full-lg" />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input {...register("kota_perusahaan")} label="Kota Perusahaan" className="w-full-lg" />
                  <Input {...register("kode_pos_perusahaan")} label="Kode Pos Perusahaan" className="w-full-lg" />
                </div>

              </div>
            </div>

            <Divider />

            <div>
              <h3 className="font-semibold text-lg mb-4">Data Dokter</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <Input {...register("nama_dokter")} label="Nama Dokter" className="w-full" />
                <Input {...register("alamat_pengirim_dokter")} label="Alamat Pengirim Dokter" className="w-full" />
                <Input {...register("npwp_dokter")} label="NPWP Dokter" className="w-full" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input {...register("telpon_dokter")} label="Telepon Dokter" className="w-full" />
                  <Input {...register("email_dokter")} label="Email Dokter" className="w-full" />
                </div>
                <Input {...register("pic_dokter")} label="PIC Dokter" className="w-full" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input {...register("kota_dokter")} label="Kota Dokter" className="w-full" />
                  <Input {...register("kode_pos_dokter")} label="Kode Pos Dokter" className="w-full" />
                </div>
                <Input {...register("handphone_dokter")} label="Handphone Dokter" className="w-full" />
                <Input {...register("kode_pajak_dokter")} label="Kode Pajak Dokter" className="w-full" />
                <Input {...register("cp_dokter")} label="Contact Person Dokter" className="w-full" />
                <Input {...register("verifikasi_dokter")} label="Verifikasi" className="w-full" />
                <Input {...register("pembuat_cp")} label="Pembuat CP" className="w-full" />
                <Input {...register("term_of_payment")} label="Term of Payment" className="w-full" />
              </div>
            </div>

            <div className="flex flex-row justify-end gap-3">
              <Button color="success" className=" self-center text-white font-semibold" type="submit">
                SUBMIT
              </Button>

              <Button color="danger" className=" self-center text-white font-semibold" type="submit">
                CANCEL
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="flex h-[4vh] items-center justify-center text-end font-semibold ">
        <h1 className="mb-4">Supported by PT Gunung Elang Indah</h1>
      </div>
    </div>


  );
};

export default MainContent;
function setResponseData(arg0: (prevData: any) => any) {
  throw new Error("Function not implemented.");
}


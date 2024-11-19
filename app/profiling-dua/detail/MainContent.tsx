"use client";

import { useEffect, useState } from "react";
import { Button, Divider, Input, Textarea } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter, useSearchParams } from "next/navigation";

interface ResponseData {
  rumah_sakit?: string;
  alamat?: string;
  id_rumah_sakit?: string;
  nama_dokter?: string;
}

const MainContent = () => {
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();
  const [inputCompanyValue, setInputCompanyValue] = useState("");
  const [hospitalSuggestions, setHospitalSuggestions] = useState<string[]>([]); // Store the filtered suggestions
  const [hospitalData, setHospitalData] = useState<any[]>([]);
  const [doctorData, setDoctorData] = useState<any[]>([]);
  const [doctorSuggestions, setDoctorSuggestions] = useState<string[]>([]);
  const [responseData, setResponseData] = useState<ResponseData>({});
  const [inputDoctorValue, setInputDoctorValue] = useState("");

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await axios.post(`${apiUrl}/profile/DetailProfile`, {
            id: id
          });

          // Tentukan kategori divisi
          let kategoriDivisi = response.data.data.kategori_divisi;

          if (kategoriDivisi === "3") {
            kategoriDivisi = "supplier";
          } else if (kategoriDivisi === "1") {
            kategoriDivisi = "customer";
          } else if (kategoriDivisi === "2") {
            kategoriDivisi = "customer_non_rumah_sakit";
          }

          // Set kategori divisi
          setKategoriDivisi(kategoriDivisi);

          // Set value ke form
          const data = response.data.data;
          setValue("alamat", data.address_perusahaan);
          setValue("nama_dokter", data.nama_dokter);
          setValue("nama_perusahaan", data.nama_perusahaan);
          setValue("address_perusahaan", data.address_perusahaan);
          setValue("npwp_perusahaan", data.npwp_perusahaan);
          setValue("ipak_number_perusahaan", data.ipak_number_perusahaan);
          setValue("alamat_pengirim_facture_perusahaan", data.alamat_pengirim_facture_perusahaan);
          setValue("npwp_address_perusahaan", data.npwp_address_perusahaan);
          setValue("telpon_perusahaan", data.telpon_perusahaan);
          setValue("email_perusahaan", data.email_perusahaan);
          setValue("alamat_pengirim_dokter", data.alamat_pengirim_dokter);
          setValue("npwp_dokter", data.npwp_dokter);
          setValue("telpon_dokter", data.telpon_dokter);
          setValue("email_dokter", data.email_dokter);
          setValue("pic_dokter", data.pic_dokter);
          setValue("kota_perusahaan", data.kota_perusahaan);
          setValue("kode_pos_perusahaan", data.kode_pos_perusahaan);
          setValue("kota_dokter", data.kota_dokter);
          setValue("kode_pos_dokter", data.kode_pos_dokter);
          setValue("handphone_dokter", data.handphone_dokter);
          setValue("kode_pajak_dokter", data.kode_pajak_dokter);
          setValue("tax_code", data.tax_code);
          setValue("verifikasi_dokter", data.verifikasi_dokter);
          setValue("created_at", data.created_at);
          setValue("created_by", data.created_by);
          setValue("updated_at", data.updated_at);
          setValue("updated_by", data.updated_by);
          setValue("pembuat_cp", data.pembuat_cp_dokter);
          setValue("term_of_payment", data.term_of_payment);
          setValue("kategori_divisi", data.kategori_divisi);
          setValue("cp_dokter", data.cp_dokter);

          // Update responseData dengan data yang diterima
          setResponseData({
            rumah_sakit: response.data.data.nama_perusahaan || '', // Jika ada, ganti dengan nama perusahaan
            alamat: response.data.data.address_perusahaan || '',    // Isi alamat
            id_rumah_sakit: response.data.data.id_rumah_sakit || '', // ID Rumah Sakit
            nama_dokter: response.data.data.nama_dokter || ''      // Nama Dokter
          });

          // Set input values berdasarkan responseData
          setInputCompanyValue(response.data.data.nama_perusahaan || '');
          setInputDoctorValue(response.data.data.nama_dokter || '');

          console.log("Data Detail", response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [id, setValue]);

  useEffect(() => {

    const fetchHospitalData = async () => {
      try {
        const res = await axios.post(
          `${apiUrl}/proforma-invoice/rs-list`,
        );
        setHospitalData(res.data.data);

        console.log("Hospital data fetched", res.data.data.kategori_divisi);
      } catch (error) {
        console.error("Error fetching hospital data", error);
      }
    };

    const fetchDokterData = async () => {
      try {
        const res = await axios.post(
          `${apiUrl}/proforma-invoice/dr-listn`,
        );
        setDoctorData(res.data.data);
        console.log("Data dokter fetched", res.data.data);
      } catch (error) {
        console.error("Error fetching dokter data", error);
      }
    };

    fetchHospitalData();
    fetchDokterData();
  }, []);


  const backButton = () => {
    router.push("/profiling-dua");
  };

  const [kategoriDivisi, setKategoriDivisi] = useState("");


  const onSubmit = async (data: Record<string, string | boolean>) => {
    console.log("Divisi : " + kategoriDivisi);
    let divisi = "";

    if (kategoriDivisi === "supplier") {
      divisi = "3";
    } else if (kategoriDivisi === "customer") {
      divisi = "1";
    } else if (kategoriDivisi === "customer_non_rumah_sakit") {
      divisi = "2";
    }

    let rumah_sakit = localStorage.getItem("selectedHospital");
    let doctor = localStorage.getItem("selectedDoctor");

    if (rumah_sakit !== null) {
      console.log("Item 'selectedHospital' ada di localStorage.");
      data.nama_perusahaan = rumah_sakit ?? "";
      setValue("nama_perusahaan", data.nama_perusahaan);
    } else {
      console.log("Item 'selectedHospital' tidak ada di localStorage.");
    }

    if (doctor !== null) {
      console.log("Item 'selectedDoctor' ada di localStorage.");
      data.nama_dokter = doctor ?? "";
      setValue("nama_dokter", data.nama_dokter);
    } else {
      console.log("Item 'selectedDoctor' tidak ada di localStorage.");
    }

    console.log("Rumah Sakit : " + data.nama_perusahaan);
    console.log("Dokter : " + data.nama_dokter);

    localStorage.removeItem("selectedHospital");
    localStorage.removeItem("selectedDoctor");

    const requestBody = {
      id: parseInt(id ?? "0"),
      nama_perusahaan: data.nama_perusahaan,
      address_perusahaan: data.address_perusahaan,
      npwp_address_perusahaan: data.npwp_address_perusahaan,
      npwp_perusahaan: data.npwp_perusahaan,
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
        text: "Apakah kamu yakin ingin menginput data ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Mengirim data...",
            text: "Mohon tunggu sebentar.",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          try {
            await axios.post(`${apiUrl}/profile/EditDetailProfile`, requestBody);

            localStorage.removeItem("selectedHospital");
            localStorage.removeItem("selectedDoctor");

            router.push("/profiling-dua");

            Swal.fire("Nice!", "Data telah di input ke sistem!", "success");
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
        rumah_sakit: selectedHospital.name, // Update responseData with the selected company
      }));
      setInputCompanyValue(selectedHospital.name); // Update the input value to the selected suggestion
      setHospitalSuggestions([]); // Clear the suggestions list

      localStorage.setItem("selectedHospital", selectedHospital.name); // Optional: Store in localStorage
    } else {
      console.log("No hospital found for the selected suggestion");
    }
  };

  const handleDoctorSuggestionClick = (suggestion: string) => {
    const selectedDoctor = doctorData.find(
      (doctor) => doctor.namaDokter === suggestion,
    );

    if (selectedDoctor) {
      setResponseData((prevData) => ({
        ...prevData,
        nama_dokter: selectedDoctor.namaDokter,
      }));
      setInputDoctorValue(selectedDoctor.namaDokter); // Update input with selected value
      setDoctorSuggestions([]);

      localStorage.setItem("selectedDoctor", selectedDoctor.namaDokter);
    } else {
      console.log("No doctor found for the selected suggestion");
    }
  };

  return (
    <div className="z-50 flex h-full w-full flex-col gap-6 bg-white p-8">



      <div className="flex flex-row justify-between gap-6">
        <h1 className="text-xl font-bold">Detail Profiling </h1>


      </div>

      <Divider />

      {kategoriDivisi !== "" && (
        <div className="rounded-3xl bg-white p-6 ">
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <h3 className="mb-4 text-lg font-semibold">Data Perusahaan</h3>

              {/* Grid untuk PC dan flex untuk mobile */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <Textarea
                  disabled
                  {...register("nama_perusahaan")}
                  label="Nama Perusahaan"
                  className="w-full-lg"
                />
                <Textarea
                  disabled
                  {...register("address_perusahaan")}
                  label="Alamat Perusahaan"
                  className="w-full-lg"
                />
                <Textarea
                  disabled
                  {...register("ipak_number_perusahaan")}
                  label="No. IPAK"
                  className="w-full-lg"
                />
                <Textarea
                  disabled
                  {...register("npwp_perusahaan")}
                  label="NPWP Perusahaan"
                  className="w-full-lg"
                />
                <Textarea
                  disabled
                  {...register("alamat_pengirim_facture_perusahaan")}
                  label="Alamat Pengirim Faktur"
                  className="w-full-lg"
                />
                <Textarea
                  disabled
                  {...register("npwp_address_perusahaan")}
                  label="Alamat NPWP Perusahaan"
                  className="w-full-lg"
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Textarea
                    disabled
                    {...register("email_perusahaan")}
                    label="Email Perusahaan"
                    className="w-full-lg"
                  />
                  <Textarea
                    disabled
                    {...register("telpon_perusahaan")}
                    label="Telepon Perusahaan"
                    className="w-full-lg"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Textarea
                    disabled
                    {...register("kota_perusahaan")}
                    label="Kota Perusahaan"
                    className="w-full-lg"
                  />
                  <Textarea
                    disabled
                    {...register("kode_pos_perusahaan")}
                    label="Kode Pos Perusahaan"
                    className="w-full-lg"
                  />
                </div>
              </div>
            </div>

            <Divider />

            {kategoriDivisi !== "customer" && (
              <>
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Data Penanggung Jawab</h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <Textarea
                      disabled
                      {...register("npwp_dokter")}
                      label="NPWP"
                      className="w-full"
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Textarea
                        disabled
                        {...register("telpon_dokter")}
                        label="Telepon"
                        className="w-full"
                      />
                      <Textarea
                        disabled
                        {...register("email_dokter")}
                        label="Email"
                        className="w-full"
                      />
                    </div>
                    <Textarea
                      disabled
                      {...register("pic_dokter")}
                      label="PIC"
                      className="w-full"
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Textarea
                        disabled
                        {...register("kota_dokter")}
                        label="Kota"
                        className="w-full"
                      />
                      <Textarea
                        disabled
                        {...register("kode_pos_dokter")}
                        label="Kode Pos"
                        className="w-full"
                      />
                    </div>
                    <Textarea
                      disabled
                      {...register("handphone_dokter")}
                      label="Handphone"
                      className="w-full"
                    />
                    <Textarea
                      disabled
                      {...register("kode_pajak_dokter")}
                      label="Kode Pajak"
                      className="w-full"
                    />
                    <Textarea
                      disabled
                      {...register("cp_dokter")}
                      label="Contact Person"
                      className="w-full"
                    />
                    <Textarea
                      disabled
                      {...register("verifikasi_dokter")}
                      label="Verifikasi"
                      className="w-full"
                    />
                    <Textarea
                      disabled
                      {...register("pembuat_cp")}
                      label="Pembuat CP"
                      className="w-full"
                    />
                    <Textarea
                      disabled
                      {...register("term_of_payment")}
                      label="Term of Payment"
                      className="w-full"
                    />
                  </div>
                </div>
              </>
            )}

            {kategoriDivisi === "customer" && (
              <>
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Data Dokter</h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

                    <Textarea
                      disabled
                      {...register("nama_dokter")}
                      label="Nama Dokter"
                      className="w-full"
                    />

                    <Textarea
                      disabled
                      {...register("alamat_pengirim_dokter")}
                      label="Alamat Pengirim Dokter"
                      className="w-full"
                    />
                    <Textarea
                      disabled
                      {...register("npwp_dokter")}
                      label="NPWP Dokter"
                      className="w-full"
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Textarea
                        disabled
                        {...register("telpon_dokter")}
                        label="Telepon Dokter"
                        className="w-full"
                      />
                      <Textarea
                        disabled
                        {...register("email_dokter")}
                        label="Email Dokter"
                        className="w-full"
                      />
                    </div>
                    <Textarea
                      disabled
                      {...register("pic_dokter")}
                      label="PIC Dokter"
                      className="w-full"
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Textarea
                        disabled
                        {...register("kota_dokter")}
                        label="Kota Dokter"
                        className="w-full"
                      />
                      <Textarea
                        disabled
                        {...register("kode_pos_dokter")}
                        label="Kode Pos Dokter"
                        className="w-full"
                      />
                    </div>
                    <Textarea
                      disabled
                      {...register("handphone_dokter")}
                      label="Handphone Dokter"
                      className="w-full"
                    />
                    <Textarea
                      disabled
                      {...register("kode_pajak_dokter")}
                      label="Kode Pajak Dokter"
                      className="w-full"
                    />
                    <Textarea
                      disabled
                      {...register("cp_dokter")}
                      label="Contact Person Dokter"
                      className="w-full"
                    />
                    <Textarea
                      disabled
                      {...register("verifikasi_dokter")}
                      label="Verifikasi"
                      className="w-full"
                    />
                    <Textarea
                      disabled
                      {...register("pembuat_cp")}
                      label="Pembuat CP"
                      className="w-full"
                    />
                    <Textarea
                      disabled
                      {...register("term_of_payment")}
                      label="Term of Payment"
                      className="w-full"
                    />
                  </div>
                </div>
              </>
            )}


          </form>
        </div>
      )}

      <Divider />

      <div className="flex h-[4vh] items-center justify-center text-end font-semibold">
        <h1 className="mb-4">Supported by PT Gunung Elang Indah</h1>
      </div>
    </div>
  );
};

export default MainContent;



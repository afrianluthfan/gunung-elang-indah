"use client";

import { useEffect, useState } from "react";
import { Button, Divider, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const res = await axios.post(
          `${apiUrl}/proforma-invoice/rs-list`,
        );
        setHospitalData(res.data.data);
        console.log("Hospital data fetched", res.data.data);
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

  // State untuk menyimpan value dropdown divisi
  const [kategoriDivisi, setKategoriDivisi] = useState("");


  // Fungsi untuk menangani submit form
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

    if (localStorage.getItem("selectedHospital") !== null) {
      console.log("Item 'selectedHospital' ada di localStorage.");
      data.nama_perusahaan = rumah_sakit ?? "";
      setValue("nama_perusahaan", data.nama_perusahaan);
    } else {
      console.log("Item 'selectedHospital' tidak ada di localStorage.");
    }

    if (localStorage.getItem("selectedDoctor") !== null) {
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

    if (divisi === "1") {
      if (!data.nama_perusahaan || !data.address_perusahaan || !data.nama_dokter) {
        Swal.fire({
          icon: 'warning',
          title: 'Data Belum Lengkap',
          html: 'Mohon lengkapi data <b>Formulir</b>',
        });
        return;
      }
    } else {
      if (!data.nama_perusahaan || !data.address_perusahaan ) {
        Swal.fire({
          icon: 'warning',
          title: 'Data Belum Lengkap',
          html: 'Mohon lengkapi data <b>Formulir</b>',
        });
        return;
      }
    }

    const requestBody = {
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
        text: "Apakah kamu yakin ingin data ini di input?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Sedang memproses...",
            text: "Mohon tunggu, data sedang diinput.",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          try {
            await axios.post(`${apiUrl}/customer-profilling/add`, requestBody);

            localStorage.removeItem("selectedHospital");
            localStorage.removeItem("selectedDoctor");

            router.push("/profiling-dua");
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
      }));
      setInputCompanyValue(selectedHospital.name);
      setHospitalSuggestions([]);

      localStorage.setItem("selectedHospital", selectedHospital.name);
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
      setInputDoctorValue(selectedDoctor.namaDokter);
      setDoctorSuggestions([]);

      localStorage.setItem("selectedDoctor", selectedDoctor.namaDokter);
    } else {
      console.log("No doctor found for the selected suggestion");
    }
  };

  return (
    <div className="z-50 flex h-full w-full flex-col gap-6 bg-white p-8">



      <div className="flex flex-row justify-between gap-6">
        <h1 className="text-xl font-bold">Form Profiling</h1>

        <div>
          <select
            value={kategoriDivisi}
            onChange={(e) => setKategoriDivisi(e.target.value)} // Simpan value ke state
            className="w-full rounded-md border border-gray-300 p-2"
          >
            <option value="">Pilih Divisi</option>
            <option value="supplier">Supplier</option>
            <option value="customer">Customer</option>
            <option value="customer_non_rumah_sakit">
              Customer Non Rumah Sakit
            </option>
          </select>
        </div>
      </div>

      <Divider />

      {kategoriDivisi !== "" && (
        <div className="rounded-3xl bg-white p-6 shadow-2xl">
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <h3 className="mb-4 text-lg font-semibold">Data Perusahaan</h3>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="relative flex w-full flex-col space-y-2">

                  <Input
                    {...register("nama_perusahaan")}
                    name="nama_perusahaan"
                    value={inputCompanyValue}
                    placeholder="Nama Perusahaan"
                    onChange={(e) => {
                      const value = e.target.value;
                      setInputCompanyValue(value);

                      const filteredSuggestions = hospitalData
                        .filter(
                          (hospital) =>
                            hospital?.name?.toLowerCase()?.includes(value?.toLowerCase() || ''),
                        )
                        .map((hospital) => hospital.name);

                      setHospitalSuggestions(filteredSuggestions);
                    }}
                    className="h-[100%] w-full flex-1 border-none outline-none"
                    endContent={
                      <button
                        className="opacity-75"
                        type="button"
                        onClick={() => {
                          const allSuggestions = hospitalData
                            .filter((hospital) => hospital.name)
                            .map((hospital) => hospital.name);
                          setHospitalSuggestions((prevSuggestions) =>
                            prevSuggestions.length > 0 ? [] : allSuggestions,
                          );
                        }}
                      >
                        ▼
                      </button>
                    }
                  />

                  {hospitalSuggestions.length > 0 && (
                    <ul className="absolute top-[2rem] z-[40] mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-gray-300 bg-white">
                      {hospitalSuggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          onClick={() =>
                            handleHospitalSuggestionClick(suggestion)
                          }
                          className="cursor-pointer p-2 hover:bg-gray-200"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Input
                  {...register("address_perusahaan")}
                  label="Alamat Perusahaan"
                  className="w-full-lg"
                />
                <Input
                  {...register("ipak_number_perusahaan")}
                  label="No. IPAK"
                  className="w-full-lg"
                />
                <Input {...register("npwp_perusahaan")} label="NPWP Perusahaan" className="w-full-lg" />
                <Input
                  {...register("alamat_pengirim_facture_perusahaan")}
                  label="Alamat Pengirim Faktur"
                  className="w-full-lg"
                />
                <Input
                  {...register("npwp_address_perusahaan")}
                  label="Alamat NPWP Perusahaan"
                  className="w-full-lg"
                />
                <Input
                  {...register("pic_perusahaan")}
                  label="PIC Perusahaan"
                  className="w-full-lg"
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    {...register("email_perusahaan")}
                    label="Email Perusahaan"
                    className="w-full-lg"
                  />
                  <Input
                    {...register("telpon_perusahaan")}
                    label="Telepon Perusahaan"
                    className="w-full-lg"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    {...register("kota_perusahaan")}
                    label="Kota Perusahaan"
                    className="w-full-lg"
                  />
                  <Input
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
                    <Input
                      {...register("npwp_dokter")}
                      label="NPWP"
                      className="w-full"
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Input
                        {...register("telpon_dokter")}
                        label="Telepon"
                        className="w-full"
                      />
                      <Input
                        {...register("email_dokter")}
                        label="Email"
                        className="w-full"
                      />
                    </div>
                    <Input
                      {...register("pic_dokter")}
                      label="PIC"
                      className="w-full"
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Input
                        {...register("kota_dokter")}
                        label="Kota"
                        className="w-full"
                      />
                      <Input
                        {...register("kode_pos_dokter")}
                        label="Kode Pos"
                        className="w-full"
                      />
                    </div>
                    <Input
                      {...register("handphone_dokter")}
                      label="Handphone"
                      className="w-full"
                    />
                    <Input
                      {...register("kode_pajak_dokter")}
                      label="Kode Pajak"
                      className="w-full"
                    />
                    <Input
                      {...register("cp_dokter")}
                      label="Contact Person"
                      className="w-full"
                    />
                    <Input
                      {...register("verifikasi_dokter")}
                      label="Verifikasi"
                      className="w-full"
                    />
                    <Input
                      {...register("pembuat_cp")}
                      label="Pembuat CP"
                      className="w-full"
                    />
                    <Input
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
                    <div className="relative flex w-full flex-col space-y-2">

                      <Input
                        {...register("nama_dokter")}
                        name="nama_dokter"
                        value={inputDoctorValue}
                        placeholder="Nama Dokter"
                        onChange={(e) => {
                          const value = e.target.value;
                          setInputDoctorValue(value);

                          const filteredSuggestions = doctorData
                            .filter(
                              (doctor) =>
                                doctor.namaDokter
                                  .toLowerCase()
                                  .includes(value.toLowerCase()),
                            )
                            .map((doctor) => doctor.namaDokter);

                          setDoctorSuggestions(filteredSuggestions);
                        }}
                        className="h-[100%] w-full flex-1 border-none outline-none"
                        endContent={
                          <button
                            className="opacity-75"
                            type="button"
                            onClick={() => {
                              const allSuggestions = doctorData
                                .filter((doctor) => doctor.namaDokter)
                                .map((doctor) => doctor.namaDokter);
                              setDoctorSuggestions((prevSuggestions) =>
                                prevSuggestions.length > 0 ? [] : allSuggestions,
                              );
                            }}
                          >
                            ▼
                          </button>
                        }
                      />

                      {doctorSuggestions.length > 0 && (
                        <ul className="absolute top-[2rem] z-[40] mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-gray-300 bg-white">
                          {doctorSuggestions.map((suggestion, idx) => (
                            <li
                              key={idx}
                              onClick={() =>
                                handleDoctorSuggestionClick(suggestion)
                              }
                              className="cursor-pointer p-2 hover:bg-gray-200"
                            >
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <Input
                      {...register("alamat_pengirim_dokter")}
                      label="Alamat Pengirim Dokter"
                      className="w-full"
                    />
                    <Input
                      {...register("npwp_dokter")}
                      label="NPWP Dokter"
                      className="w-full"
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Input
                        {...register("telpon_dokter")}
                        label="Telepon Dokter"
                        className="w-full"
                      />
                      <Input
                        {...register("email_dokter")}
                        label="Email Dokter"
                        className="w-full"
                      />
                    </div>
                    <Input
                      {...register("pic_dokter")}
                      label="PIC Dokter"
                      className="w-full"
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Input
                        {...register("kota_dokter")}
                        label="Kota Dokter"
                        className="w-full"
                      />
                      <Input
                        {...register("kode_pos_dokter")}
                        label="Kode Pos Dokter"
                        className="w-full"
                      />
                    </div>
                    <Input
                      {...register("handphone_dokter")}
                      label="Handphone Dokter"
                      className="w-full"
                    />
                    <Input
                      {...register("kode_pajak_dokter")}
                      label="Kode Pajak Dokter"
                      className="w-full"
                    />
                    <Input
                      {...register("cp_dokter")}
                      label="Contact Person Dokter"
                      className="w-full"
                    />
                    <Input
                      {...register("verifikasi_dokter")}
                      label="Verifikasi"
                      className="w-full"
                    />
                    <Input
                      {...register("pembuat_cp")}
                      label="Pembuat CP"
                      className="w-full"
                    />
                    <Input
                      {...register("term_of_payment")}
                      label="Term of Payment"
                      className="w-full"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-row justify-end gap-3">
              <Button
                color="danger"
                className="self-center font-semibold text-white"
                onClick={backButton}
              >
                CANCEL
              </Button>

              <Button
                color="success"
                className="self-center font-semibold text-white"
                type="submit"
              >
                SUBMIT
              </Button>


            </div>
          </form>
        </div>
      )}

      <div className="flex h-[4vh] items-center justify-center text-end font-semibold">
        <h1 className="mb-4">Supported by PT Gunung Elang Indah</h1>
      </div>
    </div>
  );
};

export default MainContent;

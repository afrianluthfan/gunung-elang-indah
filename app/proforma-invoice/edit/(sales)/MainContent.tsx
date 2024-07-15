"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import { Divider, Input } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { FC, useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import axios from "axios";
import RsAutocompleteSearch from "@/components/RsAutocompleteSearch";
import TopSectionLeftSide from "../../TopSectionLeftSide";
import { itemNumber } from "../../form/itemNumber";
import { setEditPIData, setEditPIField } from "@/redux/features/editPI-slice";
import { useSearchParams } from "next/navigation";
import { setEditPIItems } from "@/redux/features/editPIItems-slice";

type Key = string | number;

interface MainContentProps {
  divisi?: string;
}

const divisiOptions = [
  { value: "radiologi", label: "Radiologi" },
  { value: "ortopedi", label: "Ortopedi" },
];

const divisiMapping: { [key: string]: string } = {
  Radiologi: "radiologi",
  Ortopedi: "ortopedi",
};

const MainContent: FC<MainContentProps> = ({ divisi }) => {
  const [selectedDivisi, setSelectedDivisi] = useState<Set<Key>>(new Set());
  const [rsData, setRsData] = useState<
    { id: number; name: string; address_company: string }[]
  >([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.editPIReducer);

  const getParams = useSearchParams();

  useEffect(() => {
    const fetchRsData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/proforma-invoice/rs-list",
          "",
        );
        setRsData(response.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchRsData();
  }, [selectedDivisi]);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/proforma-invoice/detailPI",
          {
            id: getParams.get("id"),
            divisi: getParams.get("divisi"),
          },
        );
        const data = response.data.data;
        console.log("data: ", data);

        dispatch(
          setEditPIData({
            divisi: data.divisi,
            jatuhTempo: data.due_date,
            namaRumahSakit: data.nama_rumah_sakit,
            jumlahBarang: data.item_detail_pi.length.toString(),
            alamatRumahSakit: data.alamat_rumah_sakit,
            rm: data.rm,
            tanggalTindakan: data.tanggal_tindakan,
            namaDokter: data.doctor_name,
            namaPasien: data.patient_name,
            tanggalInvoice: data.tanggal_invoice,
          }),
        );

        setSelectedDivisi(new Set([divisiMapping[data.divisi]]));
        dispatch(setEditPIItems(data.item_detail_pi));
        setSelectedAddress(data.alamat_rumah_sakit);
        console.log("data.divisi: ", data.divisi);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchInvoiceData();
  }, [dispatch, getParams]);

  const handleDivisiChange = (selectedItem: Set<Key>) => {
    setSelectedDivisi(selectedItem);
    const selectedValue = Array.from(selectedItem).join(", ");
    dispatch(setEditPIField({ field: "divisi", value: selectedValue }));
  };

  const handleRSChange = (name: string, address: string) => {
    if (selectedAddress !== address) {
      setSelectedAddress(address);
      dispatch(setEditPIField({ field: "alamatRumahSakit", value: address }));
      dispatch(setEditPIField({ field: "namaRumahSakit", value: name }));
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      dispatch(setEditPIField({ field, value }));
    };

  useEffect(() => {
    if (divisi) {
      setSelectedDivisi(new Set([divisiMapping[divisi]]));
      dispatch(
        setEditPIField({ field: "divisi", value: divisiMapping[divisi] }),
      );
    }
  }, [divisi, dispatch]);

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />

      <form className="grid h-full w-full grid-cols-3 gap-3">
        <div className="flex flex-col gap-3">
          <Dropdown
            data={divisiOptions}
            label="Divisi"
            placeholder="Pilih Divisi"
            statePassing={(selectedValue) =>
              handleDivisiChange(new Set([selectedValue]))
            }
            selectedKeys={selectedDivisi}
          />

          <Input
            label="Jatuh Tempo"
            value={formData.jatuhTempo}
            onChange={handleInputChange("jatuhTempo")}
          />

          {selectedDivisi.has("radiologi") && (
            <Input
              label="RM"
              value={formData.rm}
              onChange={handleInputChange("rm")}
            />
          )}
        </div>

        <div className="flex flex-col gap-3">
          {selectedDivisi.has("radiologi") && (
            <Input
              label="Tanggal Tindakan"
              value={formData.tanggalTindakan}
              onChange={handleInputChange("tanggalTindakan")}
            />
          )}

          <RsAutocompleteSearch
            data={rsData}
            label="Nama Rumah Sakit"
            rsData={handleRSChange}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Dropdown
            data={itemNumber}
            label="Jumlah Barang"
            placeholder="Pilih jumlah barang"
            statePassing={(selectedValue) =>
              handleInputChange("jumlahBarang")({
                target: { value: selectedValue },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            selectedKeys={new Set([formData.jumlahBarang])}
          />

          <Input
            label="Nama Dokter"
            value={formData.namaDokter}
            onChange={handleInputChange("namaDokter")}
          />

          {selectedDivisi.has("radiologi") && (
            <Input
              label="Nama Pasien"
              value={formData.namaPasien}
              onChange={handleInputChange("namaPasien")}
            />
          )}

          <Input
            readOnly
            label="Alamat Rumah Sakit"
            value={formData.alamatRumahSakit}
          />
        </div>
      </form>
    </div>
  );
};

export default MainContent;

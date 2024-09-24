"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import {
  Button,
  Divider,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import { FC, useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import axios from "axios";
import RsAutocompleteSearch from "@/components/RsAutocompleteSearch";
import TopSectionLeftSide from "../../TopSectionLeftSide";
import { itemNumber } from "../../form/itemNumber";
import { setEditPIData, setEditPIField } from "@/redux/features/editPI-slice";
import { useSearchParams } from "next/navigation";
import { setEditPIItems } from "@/redux/features/editPIItems-slice";
import { DeleteIcon } from "@/components/Tables/FinanceTable/DeleteIcon";

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
  const [responseData, setResponseData] = useState({
    id: 0,
    customer_id: 0,
    status: "",
    divisi: "",
    invoice_number: "",
    po_number: "",
    due_date: "",
    alamat_rumah_sakit: "",
    nama_rumah_sakit: "",
    rm: "",
    tanggal_tindakan: "",
    doctor_name: "",
    patient_name: "",
    tanggal_invoice: "",
    number_si: "",
    sub_total: "",
    pajak: "",
    total: "",
    item_detail_pi: [
      {
        id: 0,
        kat: "",
        nama_barang: "",
        quantity: "",
        harga_satuan: "",
        discount: "",
      },
    ],
  });
  const [selectedDivisi, setSelectedDivisi] = useState<Set<Key>>(new Set());
  const [rsData, setRsData] = useState<
    { id: number; name: string; address_company: string }[]
  >([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.editPI);
  const editData = useAppSelector((state) => state.editPIItems.value);

  const getParams = useSearchParams();

  useEffect(() => {
    const fetchRsData = async () => {
      try {
        const response = await axios.post(
          "http://209.182.237.155:8080/api/proforma-invoice/rs-list",
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
          "http://209.182.237.155:8080/api/proforma-invoice/detailPI",
          {
            id: getParams.get("id"),
            divisi: getParams.get("divisi"),
          },
        );
        setResponseData(response.data.data);

        dispatch(
          setEditPIData({
            divisi: responseData.divisi,
            jatuhTempo: responseData.due_date,
            namaRumahSakit: responseData.nama_rumah_sakit,
            jumlahBarang: responseData.item_detail_pi.length.toString(),
            alamatRumahSakit: responseData.alamat_rumah_sakit,
            rm: responseData.rm,
            tanggalTindakan: responseData.tanggal_tindakan,
            namaDokter: responseData.doctor_name,
            namaPasien: responseData.patient_name,
            tanggalInvoice: responseData.tanggal_invoice,
          }),
        );

        setSelectedDivisi(new Set([divisiMapping[responseData.divisi]]));
        dispatch(setEditPIItems(responseData.item_detail_pi));
        setSelectedAddress(responseData.alamat_rumah_sakit);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchInvoiceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, getParams]);

  const handleAddItem = () => {
    setResponseData((prevData) => ({
      ...prevData,
      item_detail_pi: [
        ...prevData.item_detail_pi,
        {
          id: Date.now(), // Generate a unique ID for new items
          kat: "",
          nama_barang: "",
          quantity: "",
          harga_satuan: "",
          discount: "",
        },
      ],
    }));
  };

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

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    itemId?: number,
  ) => {
    const { name, value } = e.target;

    if (itemId !== undefined) {
      setResponseData((prevData) => ({
        ...prevData,
        item: prevData.item_detail_pi.map((item) =>
          item.id === itemId ? { ...item, [name]: value } : item,
        ),
      }));
    } else {
      setResponseData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  useEffect(() => {
    if (divisi) {
      setSelectedDivisi(new Set([divisiMapping[divisi]]));
      dispatch(
        setEditPIField({ field: "divisi", value: divisiMapping[divisi] }),
      );
    }
  }, [divisi, dispatch, editData]);

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />

      <div className="flex flex-row gap-4">
        <div className="flex w-full flex-col space-y-2 md:w-1/3">
          <label className="text-left">Jatuh Tempo:</label>
          <Input
            value={responseData.due_date}
            name="due_date"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Jatuh Tempo"
            className="rounded border border-gray-300 p-2"
          />

          <label className="text-left">Nomor Invoice:</label>
          <Input
            value={responseData.invoice_number}
            name="invoice_number"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Nomor Invoice"
            className="rounded border border-gray-300 p-2"
          />
          <label className="text-left">RM:</label>
          <Input
            value={responseData.rm}
            name="rm"
            onChange={(e) => handleFieldChange(e)}
            placeholder="RM"
            className="rounded border border-gray-300 p-2"
          />
        </div>
        <div className="flex w-full flex-col space-y-2 md:w-1/3">
          <label className="text-left">Tanggal Tindakan:</label>
          <Input
            value={responseData.tanggal_tindakan}
            name="tanggal_tindakan"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Tanggal Tindakan"
            className="rounded border border-gray-300 p-2"
          />
          <label className="text-left">Nama Dokter:</label>
          <Input
            value={responseData.doctor_name}
            name="doctor_name"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Nama Dokter"
            className="rounded border border-gray-300 p-2"
          />

          <label className="text-left">Nama Rumah Sakit:</label>
          <Input
            value={responseData.nama_rumah_sakit}
            name="nama_rumah_sakit"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Nama Rumah Sakit"
            className="rounded border border-gray-300 p-2"
          />

          <label className="text-left">Jumlah Barang:</label>
          <Input
            value={responseData.item_detail_pi.length.toString()}
            name="jumlah_barang"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Jumlah Barang"
            className="rounded border border-gray-300 p-2"
          />

          <label className="text-left">Tanggal Invoice:</label>
          <Input
            value={responseData.tanggal_invoice}
            name="tanggal_invoice"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Tanggal Invoice"
            className="rounded border border-gray-300 p-2"
          />

          <label className="text-left">Nama Pasien:</label>
          <Input
            value={responseData.patient_name}
            name="patient_name"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Nama Pasien"
            className="rounded border border-gray-300 p-2"
          />

          <label className="text-left">Alamat Rumah Sakit:</label>
          <Input
            value={responseData.alamat_rumah_sakit}
            name="alamat_rumah_sakit"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Alamat Rumah"
            className="rounded border border-gray-300 p-2"
          />
        </div>
      </div>
      <hr className="border-t-2 border-gray-200" />
      <div className="flex justify-between gap-3">
        <h1 className="mt-2 font-semibold">Data Barang</h1>
        <Button
          onClick={handleAddItem}
          color="primary"
          className="min-w-10 text-white"
        >
          Tambah Barang
        </Button>
      </div>
      <Table removeWrapper aria-label="Purchase Order Details">
        <TableHeader>
          <TableColumn className="bg-blue-900 text-white">NO</TableColumn>
          <TableColumn className="bg-blue-900 text-white">
            NAMA BARANG
          </TableColumn>
          <TableColumn className="bg-blue-900 text-white">QUANTITY</TableColumn>
          <TableColumn className="bg-blue-900 text-white">
            HARGA SATUAN
          </TableColumn>
          <TableColumn className="bg-blue-900 text-white">DISCOUNT</TableColumn>
          <TableColumn className="bg-blue-900 text-white">AKSI</TableColumn>
        </TableHeader>
        <TableBody>
          {responseData.item_detail_pi.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Input
                  value={item.nama_barang}
                  name="nama_barang"
                  onChange={(e) => handleFieldChange(e, item.id)}
                  placeholder="Nama Barang"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.quantity}
                  name="quantity"
                  onChange={(e) => handleFieldChange(e, item.id)}
                  placeholder="Quantity"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.harga_satuan}
                  name="harga_satuan"
                  onChange={(e) => handleFieldChange(e, item.id)}
                  placeholder="Harga Satuan"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.discount.replace(/%/g, "")} // Remove '%' from display
                  name="discount"
                  onChange={(e) => handleFieldChange(e, item.id)}
                  placeholder="Discount"
                />
              </TableCell>
              <TableCell>
                <Tooltip content="Delete" className="text-black">
                  <span
                    className="cursor-pointer text-lg text-default-400 active:opacity-50"
                    // onClick={() => item.id && handleDelete(item.id)} // Ensure item.id is defined
                  >
                    <DeleteIcon />
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* {!isRejected && (
        <div className="flex justify-end gap-3">
          <Button
            onClick={cancelReject}
            color="danger"
            className="min-w-36 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={submitAcc}
            color="success"
            className="min-w-36 text-white"
          >
            Next
          </Button>
        </div>
      )} */}
    </div>
  );
};

export default MainContent;

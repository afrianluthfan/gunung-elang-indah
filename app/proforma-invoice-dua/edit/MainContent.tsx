import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
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
} from "@nextui-org/react";

type ItemDetail = {
  id: number;
  po_id: number;
  name: string;
  quantity: string;
  price: string;
  discount: string;
  amount: string;
};

type PurchaseOrder = {
  id: number;
  nama_suplier: string;
  nomor_po: string;
  tanggal: string;
  catatan_po: string;
  prepared_by: string;
  prepared_jabatan: string;
  approved_by: string;
  approved_jabatan: string;
  sub_total: string;
  pajak: string;
  total: string;
  sub_total_rp: string;
  pajak_rp: string;
  total_rp: string;
  status: string;
  reason?: string;
  item: ItemDetail[];
};

const AdminMainContent = () => {
  const router = useRouter();
  const [responseData, setResponseData] = useState<PurchaseOrder>({
    id: 0,
    nama_suplier: "",
    nomor_po: "",
    tanggal: "",
    catatan_po: "",
    prepared_by: "",
    prepared_jabatan: "",
    approved_by: "",
    approved_jabatan: "",
    sub_total: "",
    pajak: "",
    total: "",
    sub_total_rp: "",
    pajak_rp: "",
    total_rp: "",
    status: "",
    reason: "",
    item: [],
  });

  const [shouldSubmit, setShouldSubmit] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) {
      console.error("ID is missing");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/purchase-order/detail",
          { id: id }
        );
        setResponseData(response.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (shouldSubmit) {
      const submitData = async () => {
        try {
          await axios.post(
            "http://localhost:8080/api/purchase-order/edit/finance",
            responseData
          );
          Swal.fire({
            title: "Success!",
            text: "Purchase order berhasil di " + responseData.status + ".",
            icon: "success",
            confirmButtonText: "OK"
          });
          router.push("/purchase-order");
        } catch (error) {
          console.error("Error submitting data", error);
        } finally {
          setShouldSubmit(false);
        }
      };

      submitData();
    }
  }, [shouldSubmit, responseData]);

  const submitAcc = () => {
    Swal.fire({
      title: 'Apakah Kamu Yakin ?',
      text: "Apakah kamu yakin ingin menerima purchase order ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, accept it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setResponseData((prevData) => ({
          ...prevData,
          status: "DITERIMA",
        }));
        setShouldSubmit(true);
      }
    });
  };

  const submitReject = () => {
    Swal.fire({
      title: 'Alasan Penolakan',
      input: 'textarea',
      inputLabel: 'Masukkan alasan penolakan',
      inputPlaceholder: 'Alasan penolakan...',
      inputAttributes: {
        'aria-label': 'Masukkan alasan penolakan'
      },
      showCancelButton: true,
      confirmButtonText: 'Kirim',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      inputValidator: (value) => {
        if (!value) {
          return 'Alasan penolakan tidak boleh kosong!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setResponseData((prevData) => ({
          ...prevData,
          status: "DITOLAK",
          reason: result.value
        }));
        setShouldSubmit(true);
      }
    });
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <h1 className="font-semibold lg:text-[1.85vh]">Detail Pembuatan Purchase Order</h1>
      <Divider />
      <div className="flex justify-between">
        <table className="">
          <tbody>
            <tr>
              <td className=" text-left">
                <h1 className=" font-medium">Nama Supplier</h1>
              </td>
              <td className="w-10 text-center">:</td>
              <td className="">
                <h1>{responseData.nama_suplier}</h1>
              </td>
            </tr>
            <tr>
              <td className=" text-left">
                <h1 className=" font-medium">Nomor Purchase Order</h1>
              </td>
              <td className="w-10 text-center">:</td>
              <td className="">
                <h1>{responseData.nomor_po}</h1>
              </td>
            </tr>
            <tr>
              <td className=" text-left">
                <h1 className=" font-medium">Tanggal</h1>
              </td>
              <td className="w-10 text-center">:</td>
              <td className="">
                <h1>{responseData.tanggal}</h1>
              </td>
            </tr>
            <tr>
              <td className=" text-left">
                <h1 className="font-medium">Catatan Purchase Order</h1>
              </td>
              <td className="w-10 text-center">:</td>
              <td className="">
                <h1>{responseData.catatan_po}</h1>
              </td>
            </tr>
            <tr>
              <td className=" text-left">
                <h1 className=" font-medium">Prepared By</h1>
              </td>
              <td className="w-10 text-center">:</td>
              <td className="">
                <h1>{responseData.prepared_by}</h1>
              </td>
            </tr>
            <tr>
              <td className=" text-left">
                <h1 className=" font-medium">Prepared Jabatan</h1>
              </td>
              <td className="w-10 text-center">:</td>
              <td className="">
                <h1>{responseData.prepared_jabatan}</h1>
              </td>
            </tr>
            <tr>
              <td className=" text-left">
                <h1 className=" font-medium">Approved By</h1>
              </td>
              <td className="w-10 text-center">:</td>
              <td className="">
                <h1>{responseData.approved_by}</h1>
              </td>
            </tr>
            <tr>
              <td className=" text-left">
                <h1 className=" font-medium">Approved Jabatan</h1>
              </td>
              <td className="w-10 text-center">:</td>
              <td className="">
                <h1>{responseData.approved_jabatan}</h1>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Divider />

      <div className="flex justify-start my-1">
        <h1 className="font-semibold lg:text-[1.4vh]">List Harga Barang</h1>
      </div>

      {/* Bagian Table */}
      <div className="flex justify-between items-center">
        <Table removeWrapper>
          <TableHeader>
            <TableColumn className="bg-blue-900 text-white text-center">NO</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">NAMA BARANG</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">QTY</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">HARGA SATUAN</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">DISC</TableColumn>
            <TableColumn className="bg-blue-900 text-white text-center">SUB TOTAL</TableColumn>
          </TableHeader>
          <TableBody>
            {responseData.item.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{item.name}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-center">{item.price}</TableCell>
                <TableCell className="text-center">{item.discount}</TableCell>
                <TableCell className="text-center">{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Divider />

      <div className="grid w-[25%] grid-cols-2 gap-2 self-end text-sm font-bold">
        <p className="text-end">Sub Total : </p>
        <p className="text-start">{responseData.sub_total_rp}</p>
        <p className="text-end">PPN 11% : </p>
        <p className="text-start">{responseData.pajak_rp}</p>
        <p className="text-end">Total : </p>
        <p className="text-start">{responseData.total_rp}</p>
      </div>

      <div className="flex justify-end gap-3">
        <Button onClick={submitReject} color="danger" className="min-w-36">
          Ditolak
        </Button>
        <Button onClick={submitAcc} color="success" className="min-w-36 text-white">
          Diterima
        </Button>
      </div>
    </div>
  );
};

export default AdminMainContent;

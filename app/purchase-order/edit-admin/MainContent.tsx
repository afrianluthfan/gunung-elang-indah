import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
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
import TopSectionLeftSide from "../TopSectionLeftSide";
import Swal from "sweetalert2";
import { DeleteIcon } from "../../../components/Tables/AdminTable/DeleteIcon";

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
  status: string;
  reason?: string;
  item: ItemDetail[];
  item_deleted: { id: number }[];
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
    status: "",
    reason: "",
    item: [],
    item_deleted: [],
  });

  const [isRejected, setIsRejected] = useState(false);
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
          const res = await axios.post(
            "http://localhost:8080/api/purchase-order/edit/inquiry",
            responseData
          );

          localStorage.setItem("purchaseOrder", JSON.stringify(res));
          localStorage.setItem("aksi", "update");
          router.push("/purchase-order/form/preview");
          setIsRejected(false);
        } catch (error) {
          console.error("Error submitting data", error);
        } finally {
          setShouldSubmit(false);
        }
      };

      submitData();
    }
  }, [shouldSubmit, responseData]);

  const handleDelete = (index: number) => {
    Swal.fire({
      title: "Apakah Kamu Yakin ?",
      text: "Apakah kamu yakin ingin menghapus barang ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setResponseData((prevData) => {
          const itemToDelete = prevData.item[index];
          const updatedItemDeleted = Array.isArray(prevData.item_deleted)
            ? [...prevData.item_deleted, { id: itemToDelete.id }]
            : [{ id: itemToDelete.id }];

          return {
            ...prevData,
            item: prevData.item.filter((_, i) => i !== index),
            item_deleted: updatedItemDeleted,
          };
        });
      }
    });
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    itemIndex?: number
  ) => {
    const { name, value } = e.target;

    if (itemIndex !== undefined) {
      setResponseData((prevData) => ({
        ...prevData,
        item: prevData.item.map((item, index) =>
          index === itemIndex ? { ...item, [name]: value } : item
        ),
      }));
    } else {
      setResponseData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddItem = () => {
    setResponseData((prevData) => ({
      ...prevData,
      item: [
        ...prevData.item,
        {
          id: 0,
          po_id: 0,
          name: "",
          quantity: "",
          price: "",
          discount: "",
          amount: "",
        },
      ],
    }));
  };

  const submitAcc = () => {
    setResponseData((prevData) => ({
      ...prevData,
      status: "DIPROSES",
    }));
    setShouldSubmit(true);
  };

  const tolak = () => {
    router.push("/purchase-order");
  };

  const cancelReject = () => {
    setIsRejected(false);
  };

  return (

    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      {responseData.reason && (
        <div>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p className="font-bold">Alasan Penolakan:</p>
            <p>{responseData.reason}</p>

          </div>

          {/* <div className="mt-4">
            <Divider />
          </div> */}
        </div>

      )}

      <h1 className="font-semibold text-xl">Edit Purchase Order</h1>

      <Divider />



      <div className="flex gap-4">
        <div className="flex w-full flex-col space-y-2 md:w-1/3">
          <label className="text-left">Supplier:</label>
          <Input
            value={responseData.nama_suplier}
            name="nama_suplier"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Nama Suplier"
            className="rounded py-2"
          />
        </div>
        <div className="flex w-full flex-col space-y-2 md:w-1/3">
          <label className="text-left">Prepared by:</label>
          <Input
            value={responseData.prepared_by}
            name="prepared_by"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Prepared by"
            className="rounded py-2"
          />
          <label className="text-left">Jabatan Prepared:</label>
          <Input
            value={responseData.prepared_jabatan}
            name="prepared_jabatan"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Jabatan Prepared"
            className="rounded py-2"
          />
        </div>
        <div className="flex w-full flex-col space-y-2 md:w-1/3">
          <label className="text-left">Approved by:</label>
          <Input
            value={responseData.approved_by}
            name="approved_by"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Approved by"
            className="rounded py-2"
          />
          <label className="text-left">Jabatan Approved:</label>
          <Input
            value={responseData.approved_jabatan}
            name="approved_jabatan"
            onChange={(e) => handleFieldChange(e)}
            placeholder="Jabatan Approved"
            className="rounded py-2"
          />
        </div>
      </div>

      <Divider />


      <div className="flex justify-between items-center">
        <h3 className="mb-2 text-left text-lg font-semibold">Barang:</h3>
        <div className="mb-2 flex justify-center">
          <Button className="bg-blue-900 text-white" onClick={handleAddItem}>
            Tambah Barang
          </Button>
        </div>
      </div>



      <Table removeWrapper className="mb-4">
        <TableHeader>
          <TableColumn className="bg-blue-900 text-white text-center">No</TableColumn>
          <TableColumn className="bg-blue-900 text-white ">Nama Barang</TableColumn>
          <TableColumn className="bg-blue-900 text-white ">Quantity</TableColumn>
          <TableColumn className="bg-blue-900 text-white ">Harga Satuan</TableColumn>
          <TableColumn className="bg-blue-900 text-white ">Discount</TableColumn>
          <TableColumn className="bg-blue-900 text-white">Action</TableColumn>
        </TableHeader>
        <TableBody>
          {responseData.item.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>
                <Input
                  value={item.name}
                  name="name"
                  onChange={(e) => handleFieldChange(e, index)}
                  placeholder="Nama Barang"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.quantity}
                  name="quantity"
                  onChange={(e) => handleFieldChange(e, index)}
                  placeholder="Quantity"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.price}
                  name="price"
                  onChange={(e) => handleFieldChange(e, index)}
                  placeholder="Harga Satuan"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.discount.replace(/%/g, "")} // Remove '%' from display
                  name="discount"
                  onChange={(e) => handleFieldChange(e, index)}
                  placeholder="Discount"
                />
              </TableCell>
              <TableCell >
                <Tooltip content="Delete" className="text-black">
                  <span
                    className="cursor-pointer text-lg text-default-400 active:opacity-50"
                    onClick={() => handleDelete(index)}
                  >
                    <DeleteIcon />
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end gap-4">
        <Button className="bg-red-600 text-white" onClick={tolak}>
          Batalkan
        </Button>
        <Button className="bg-green-500 text-white" onClick={submitAcc}>
          Lanjutkan
        </Button>
      </div>
    </div>
  );
};

export default AdminMainContent;

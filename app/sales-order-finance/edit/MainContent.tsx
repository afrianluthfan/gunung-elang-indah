import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import './invoicePrint.css'

import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";

type ItemDetail = {
  gudang: string;
  variable: string;
  kode: string;
  id: number;
  po_id: number;
  name: string;
  quantity: string;
  price: string;
  discount: string;
  amount: string;
  lots: string;
};

type PurchaseOrder = {
  id: number;
  nama_suplier: string;
  nomor_po: string;
  nomor_si: string;
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
    nomor_si: "",
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
  const [username, setUsername] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const pdfRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState('md')

  const sizes = ["3xl"];


  const handleOpen = (size: string) => {
    setSize(size)
    onOpen();
  }

  useEffect(() => {
    const storedUsername = localStorage.getItem("statusAccount");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      console.error("ID is missing");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/purchase-order/detail-so`,
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
            `${apiUrl}/purchase-order/edit/finance`,
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

  const [isVisible, setIsVisible] = useState(false);

  const downloadPDF = async () => {
    setIsVisible(true); // Tampilkan elemen sementara

    setTimeout(async () => {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;

      const element = pdfRef.current;
      if (!element) {
        console.error("Element for PDF generation is not found.");
        setIsVisible(false);
        return;
      }

      let namaFile = "PURCHASE ORDER - " + responseData.nomor_po;
      const options = {
        margin: 1,
        filename: namaFile,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
      };

      html2pdf()
        .set(options)
        .from(element)
        .save()
        .then(() => setIsVisible(false)) // Sembunyikan kembali setelah unduh
        .catch((error: any) => {
          console.error("Error generating PDF", error);
          setIsVisible(false);
        });
    }, 0); // Tunggu sebentar agar PDF bisa di-render
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">

      {
        responseData.reason && (
          <div>
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              <p className="font-bold">Alasan Penolakan:</p>
              <p>{responseData.reason}</p>
            </div>
          </div>
        )
      }

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
                <h1 className=" font-medium">Nomor Surat Jalan</h1>
              </td>
              <td className="w-10 text-center">:</td>
              <td className="">
                <h1>{responseData.nomor_si}</h1>
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
            <TableColumn className="bg-[#0C295F] text-white text-center">NO</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">KODE BARANG</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">NAMA BARANG</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">VARIABLE BARANG</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">LOTS</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">QTY</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">HARGA SATUAN</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">DISKON</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">GUDANG</TableColumn>
            <TableColumn className="bg-[#0C295F] text-white text-center">SUB TOTAL</TableColumn>
          </TableHeader>
          <TableBody>
            {responseData.item.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{item.kode}</TableCell>
                <TableCell className="text-center">{item.name}</TableCell>
                <TableCell className="text-center">{item.variable}</TableCell>
                <TableCell className="text-center">{item.lots}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-center">{item.price}</TableCell>
                <TableCell className="text-center">{item.discount}%</TableCell>
                <TableCell className="text-center">{item.gudang}</TableCell>
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


      <Divider />

      {username === "LOGISTIK" && responseData.status === "DITERIMA" && (
        <Button className="w-full bg-green-600 text-white">
          Download Surat Jalan
        </Button>
      )}

      {username === "KEUANGAN" && responseData.status === "DITERIMA" && (
        <Button key={size} onPress={() => handleOpen(size)} className="bg-green-600 text-white" >↓ | Download Invoice</Button>
      )}

      {/* PDF DOWNLOAD ELEMENT START */}

      <Modal
        size={"3xl"}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black">Purchase Order Preview</ModalHeader>
              <ModalBody>
                <div
                  className="invoice-container text-black"
                  ref={pdfRef}
                >
                  <div className="flex justify-between">
                    <img src="/LOGO_KOP.png" alt="Logo" className="h-20 w-auto  scale-200" />

                    <div className="lion mt-5">
                      <h1 className="chile">PUCHASE ORDER</h1>
                    </div>
                    <h1 className="ml-[90px]"> </h1>
                  </div>

                  <hr className="snake" />

                  <div className="tiger">
                    <table className="zebra" >
                      <tbody>
                        <tr>
                          <td>To Supplier</td>
                          <td>: {responseData.nama_suplier}</td>
                        </tr>
                        <tr>
                          <td>Nomor PO</td>
                          <td>: {responseData.nomor_po}</td>
                        </tr>

                        <tr>
                          <td>Tanggal</td>
                          <td>: {responseData.tanggal}</td>
                        </tr>
                        {/* <tr>
                          <td>Jatuh Tempo Dummy</td>
                          <td>: {responseData.tanggal_tindakan}</td>
                        </tr> */}


                      </tbody>
                    </table>

                  </div>

                  <table className="penguin">
                    <thead>
                      <tr>
                        <th><p>No</p></th>
                        <th><p>KAT</p></th>
                        <th><p>Nama Barang</p></th>
                        <th><p>Qty</p></th>
                        <th><p>H. Satuan</p></th>
                        <th><p>Diskon</p></th>
                        <th><p>Amount</p></th>
                      </tr>
                    </thead>
                    <tbody>
                      {responseData.item.map((item, index) => (
                        <tr key={item.id}>
                          <td><p>{index + 1}</p></td>
                          <td><p>{item.kode}</p></td>
                          <td><p>{item.name}</p></td>
                          <td><p>{item.quantity}</p></td>
                          <td><p>{item.price}</p></td>
                          <td><p>{item.discount}%</p></td>
                          <td><p>{item.amount}</p></td>
                        </tr>
                      ))}

                      <tr>
                        <td colSpan={6} className="right-align"><p>Sub Total:</p></td>
                        <td><p>{responseData.sub_total_rp}</p></td>
                      </tr>
                      <tr>
                        <td colSpan={6} className="right-align"><p>PPN 11%:</p></td>
                        <td><p>{responseData.pajak_rp}</p></td>
                      </tr>
                      <tr>
                        <td colSpan={6} className="right-align"><strong><p>Total:</p></strong></td>
                        <td><strong><p>{responseData.total_rp}</p></strong></td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="koala">
                    <p><strong>Note : {responseData.catatan_po}</strong></p>
                  </div>

                  <div className="koala">
                    <div className="panda">
                      Prepared By,
                      <br />
                      <div className="dolphin"></div>
                      <div><strong>{responseData.prepared_by}</strong></div>
                      <div>{responseData.prepared_jabatan}</div>
                    </div>
                    <div className="bear">
                      <p>Approved By</p>
                      <div className="dolphin"></div>
                      <div><strong>{responseData.approved_by}</strong></div>
                      <div>{responseData.approved_jabatan}</div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} className="border-red-600 border">
                  Close
                </Button>
                <Button onClick={downloadPDF} className=" bg-green-600 text-white">
                  ↓ | Download INVOICE
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* PDF DOWNLOAD ELEMENT END */}

    </div>
  );


};

export default AdminMainContent;


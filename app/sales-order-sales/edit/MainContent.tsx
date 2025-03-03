import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import './invoicePrint.css'
import {
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";


type ItemDetailPI = {
  gudang: string;
  variable: string;
  id: number;
  kat: string;
  nama_barang: string;
  quantity: string;
  harga_satuan: string;
  discount: string;
  sub_total_item: string;
};

type ProformaInvoice = {
  tanggal: string;
  terbilang: string;
  nama_pasien: string;
  nama_dokter: string;
  alamat: string;
  rumah_sakit: string;
  id: number;
  customer_id: number;
  status: string;
  divisi: string;
  invoice_number: string;
  due_date: string;
  number_si: string;
  sub_total: string;
  pajak: string;
  total: string;
  doctor_name: string;
  patient_name: string;
  tanggal_tindakan: string;
  nama_customer: string;
  alamat_customer: string;
  rm: string;
  keterangan: string;
  tanggalAsli: string;
  item_detail_pi: ItemDetailPI[];
};

const ProformaInvoiceDetail = () => {
  const router = useRouter();
  const [responseData, setResponseData] = useState<ProformaInvoice>({
    id: 0,
    customer_id: 0,
    status: "",
    divisi: "",
    invoice_number: "",
    due_date: "",
    tanggal: "",
    number_si: "",
    sub_total: "",
    pajak: "",
    total: "",
    doctor_name: "",
    patient_name: "",
    nama_dokter: "",
    nama_pasien: "",
    tanggal_tindakan: "",
    nama_customer: "",
    alamat_customer: "",
    rumah_sakit: "",
    alamat: "",
    rm: "",
    keterangan: "",
    item_detail_pi: [],
    terbilang: "",
    tanggalAsli: "",
  });

  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const divisi = searchParams.get("divisi");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
    if (!id || !divisi) {
      console.error("ID atau Divisi tidak ditemukan");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/proforma-invoice/detailPI-so`,
          { id: id, divisi: divisi },
        );

        const tanggal = response.data.data.tanggal;
        const bulanMapping = {
          "01": "Januari",
          "02": "Februari",
          "03": "Maret",
          "04": "April",
          "05": "Mei",
          "06": "Juni",
          "07": "Juli",
          "08": "Agustus",
          "09": "September",
          "10": "Oktober",
          "11": "November",
          "12": "Desember"
        };

        const [tanggalHari, bulanAngka, tahun] = tanggal.split("-");
        const namaBulan = bulanMapping[bulanAngka as keyof typeof bulanMapping];
        const tanggalFormatted = `${tanggalHari} ${namaBulan} ${tahun}`;
        console.log(tanggalFormatted);

        response.data.data.tanggalAsli = tanggalFormatted;
        setResponseData(response.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [id, divisi]);

  useEffect(() => {
    if (shouldSubmit) {
      const submitData = async () => {
        try {
          if (responseData.status === "DITOLAK") {
            responseData.status = "Ditolak";
          }

          if (responseData.status === "DITERIMA") {
            responseData.status = "Diterima";
          }

          try {
            const response = await axios.post(
              `${apiUrl}/proforma-invoice/editPI-admin`,
              responseData,
            );

            // Jika berhasil, tampilkan pesan sukses
            Swal.fire({
              title: "Success!",
              text: "Proforma Invoice berhasil di " + responseData.status + ".",
              icon: "success",
              confirmButtonText: "OK",
            });

            // Redirect ke halaman lain
            router.push("/proforma-invoice-dua");
          } catch (error) {
            if (responseData.status === "DITOLAK") {
              responseData.status = "Diterima";
            }

            if (responseData.status === "DITERIMA") {
              responseData.status = "Ditolak";
            }

            if (responseData.status === "Ditolak") {
              responseData.status = "Diterima";
            }

            if (responseData.status === "Diterima") {
              responseData.status = "Ditolak";
            }

            // Tangkap error dari response dan tampilkan error message
            if (axios.isAxiosError(error) && error.response?.data) {
              const errorMessage =
                error.response.data.message || "Terjadi kesalahan.";

              Swal.fire({
                title: "Error!",
                html: errorMessage,
                icon: "error",
                confirmButtonText: "OK",
              });
            } else {
              // Jika tidak ada detail error dari server, tampilkan error umum
              Swal.fire({
                title: "Error!",
                text: "Terjadi kesalahan saat memproses permintaan.",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          }
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
      title: "Apakah Kamu Yakin ?",
      text: "Apakah kamu yakin ingin menerima proforma invoice ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!",
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
      title: "Alasan Penolakan",
      input: "textarea",
      inputLabel: "Masukkan alasan penolakan",
      inputPlaceholder: "Alasan penolakan...",
      inputAttributes: {
        "aria-label": "Masukkan alasan penolakan",
      },
      showCancelButton: true,
      confirmButtonText: "Kirim",
      cancelButtonText: "Batal",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      inputValidator: (value) => {
        if (!value) {
          return "Alasan penolakan tidak boleh kosong!";
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setResponseData((prevData) => ({
          ...prevData,
          status: "DITOLAK",
          reason: result.value,
        }));
        setShouldSubmit(true);
      }
    });
  };

  const handleSetNamaBarang = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/sales_order/list/admin/edit/nama-barang-pi-so`,
        responseData
      );

      Swal.fire({
        title: "Success!",
        text: "Nama Barang berhasil diperbarui.",
        icon: "success",
        confirmButtonText: "OK",
      });

      try {
        const response = await axios.post(
          `${apiUrl}/proforma-invoice/detailPI-so`,
          { id: id, divisi: divisi },
        );
        setResponseData(response.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    } catch (error) {
      console.error("Error updating Nama Barang", error);

      Swal.fire({
        title: "Error!",
        text: "Gagal memperbarui Nama Barang. Silakan coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // HANDLER DOWNLOAD INVOICE START 
  const pdfRef = useRef(null);

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

      let namaFile = "INVOICE - " + responseData.invoice_number;
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

  const [isVisible, setIsVisible] = useState(false);
  // HANDLER DOWNLOAD INVOICE END 
  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <div className="my-1 flex justify-between">
        <h1 className="font-semibold lg:text-[1.85vh]">
          Detail SO Proforma Invoice
        </h1>
        <div className="flex gap-2">
          <Button className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600"
            onClick={handleSetNamaBarang}>
            ⏎ | Set Perubahan
          </Button>
          {username === "ADMIN" && responseData.status === "Diterima" && (
            <Button key={size} onPress={() => handleOpen(size)} className="bg-green-600 text-white" >↓ | Download Invoice</Button>
          )}
          {username === "LOGISTIK" && responseData.status === "Diterima" && (
            <Button className="bg-green-600 text-white">
              ↓ | Download Surat Jalan
            </Button>
          )}
        </div>
      </div>


      <Divider />

      {/* Jika divisi === Ortopedic */}
      {divisi === "Ortopedi" && (
        <div className="flex justify-between">
          <table className="">
            <tbody>
              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Perusahaan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.rumah_sakit}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Alamat Perusahaan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.alamat}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Nomor Invoice</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.invoice_number}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Number SI</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.number_si}</h1>
                </td>
              </tr>
              {/* <tr>
                <td className=" text-left">
                  <h1 className=" font-medium">Jatuh Tempo</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.due_date}</h1>
                </td>
              </tr> */}
              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Nama Dokter</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.nama_dokter}</h1>
                </td>
              </tr>
              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Nama Pasien</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.nama_pasien}</h1>
                </td>
              </tr>
              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Tanggal Tindakan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.tanggal_tindakan}</h1>
                </td>
              </tr>
              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Divisi</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.divisi}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Rekam Medis</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.rm}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Keterangan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <input
                    type="text"
                    className="border rounded px-2 py-1"
                    value={responseData.keterangan}
                    onChange={(e) => setResponseData({...responseData, keterangan: e.target.value})}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Jika divisi === Radiologi */}
      {divisi === "Radiologi" && (
        <div className="flex justify-between">
          <table className="">
            <tbody>
              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Perusahaan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.rumah_sakit}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Alamat Perusahaan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.alamat}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Nomor Invoice</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.invoice_number}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Number SI</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.number_si}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Divisi</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.divisi}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Rekam Medis</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <h1>{responseData.rm}</h1>
                </td>
              </tr>

              <tr>
                <td className="text-left">
                  <h1 className="font-medium">Keterangan</h1>
                </td>
                <td className="w-10 text-center">:</td>
                <td className="">
                  <textarea
                    className="border rounded px-2 py-1 w-[500px]"
                    value={responseData.keterangan}
                    onChange={(e) => setResponseData({...responseData, keterangan: e.target.value})}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <Divider />

      <h1 className="font-semibold text-medium">
        List Barang
      </h1>

      {/* Bagian Table */}
      <div className="flex items-center justify-between overflow-x-scroll">
        <Table removeWrapper>
          <TableHeader>
            <TableColumn className="bg-[#0C295F] text-center text-white">
              NO
            </TableColumn>
            <TableColumn className="bg-[#0C295F] text-center text-white">
              KODE BARANG
            </TableColumn>
            <TableColumn className="bg-[#0C295F] text-center text-white">
              NAMA BARANG
            </TableColumn>
            <TableColumn className="bg-[#0C295F] text-center text-white">
              VARIABLE
            </TableColumn>
            <TableColumn className="bg-[#0C295F] text-center text-white">
              QTY
            </TableColumn>
            <TableColumn className="bg-[#0C295F] text-center text-white">
              HARGA SATUAN
            </TableColumn>
            <TableColumn className="bg-[#0C295F] text-center text-white">
              DISC
            </TableColumn>
            <TableColumn className="bg-[#0C295F] text-center text-white">
              GUDANG ASAL
            </TableColumn>
            <TableColumn className="bg-[#0C295F] text-center text-white">
              SUB TOTAL
            </TableColumn>
          </TableHeader>
          <TableBody>
            {responseData.item_detail_pi.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{item.kat}</TableCell>
                <TableCell className="text-center">
                  <textarea
                    className="w-full border-1 rounded px-2 py-1 text-sm"
                    value={item.nama_barang}
                    onChange={(e) => {
                      const updatedItems = [...responseData.item_detail_pi]
                      updatedItems[index] = {
                        ...item,
                        nama_barang: e.target.value
                      }
                      setResponseData({
                        ...responseData,
                        item_detail_pi: updatedItems
                      })
                    }}
                  />
                </TableCell>
                <TableCell className="text-center">{item.variable}</TableCell>
                <TableCell className="text-center">
                  <textarea
                    className="w-full border-1 rounded px-2 py-1 text-sm"
                    value={item.quantity}
                    onChange={(e) => {
                      const updatedItems = [...responseData.item_detail_pi]
                      updatedItems[index] = {
                        ...item,
                        quantity: e.target.value
                      }
                      setResponseData({
                        ...responseData,
                        item_detail_pi: updatedItems
                      })
                    }}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <textarea
                    className="w-full border-1 rounded px-2 py-1 text-sm"
                    value={item.harga_satuan}
                    onChange={(e) => {
                      const updatedItems = [...responseData.item_detail_pi]
                      updatedItems[index] = {
                        ...item,
                        harga_satuan: e.target.value
                      }
                      setResponseData({
                        ...responseData,
                        item_detail_pi: updatedItems
                      })
                    }}
                  />

                </TableCell>
                <TableCell className="text-center">
                  <textarea
                    className="w-full border-1 rounded px-2 py-1 text-sm"
                    value={item.discount}
                    onChange={(e) => {
                      const updatedItems = [...responseData.item_detail_pi]
                      updatedItems[index] = {
                        ...item,
                        discount: e.target.value
                      }
                      setResponseData({
                        ...responseData,
                        item_detail_pi: updatedItems
                      })
                    }}
                  />
                </TableCell>
                <TableCell className="text-center">{item.gudang}</TableCell>
                <TableCell className="text-center">
                  {item.sub_total_item}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Divider />

      <div className="grid grid-cols-2 gap-2 self-end text-sm font-bold lg:w-[25%]">
        <p className="text-end">Sub Total : </p>
        <p className="text-start">{responseData.sub_total}</p>
        <p className="text-end">PPN 11% : </p>
        <p className="text-start">{responseData.pajak}</p>
        <p className="text-end">Total : </p>
        <p className="text-start">{responseData.total}</p>
      </div>

      <Divider />

      {username === "LOGISTIK" && responseData.status === "Diterima" && (
        <Button className="w-full bg-green-600 text-white">
          ↓ | Download Surat Jalan
        </Button>
      )}



      <Modal
        size={"3xl"}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black">Invoice Preview</ModalHeader>
              <ModalBody>
                <div
                  className="invoice-container text-black"
                  ref={pdfRef}
                >
                  <div className="flex justify-between">
                    <img src="/LOGO_KOP.png" alt="Logo" className="h-20 w-auto  scale-200" />

                    <div className="lion mt-5">
                      <h1 className="chile">INVOICE</h1>
                    </div>
                    <h1 className="ml-[90px]"> </h1>
                  </div>

                  <hr className="snake" />

                  <div className="tiger">
                    <table className="zebra" >
                      <tbody>
                        <tr>
                          <td>Nomor Invoice</td>
                          <td>: {responseData.invoice_number}</td>
                        </tr>
                        <tr>
                          <td>Nomor Surat Jalan</td>
                          <td>: {responseData.number_si}</td>
                        </tr>

                        <tr>
                          <td>Tanggal Invoice</td>
                          <td>: {responseData.tanggal}</td>
                        </tr>
                        {/* <tr>
                          <td>Jatuh Tempo Dummy</td>
                          <td>: {responseData.tanggal_tindakan}</td>
                        </tr> */}
                        {responseData.divisi !== "Radiologi" && (
                          <>
                            <tr>
                              <td>Tanggal Tindakan</td>
                              <td>: {responseData.tanggal_tindakan}</td>
                            </tr>
                            <tr>
                              <td>Nama Dokter</td>
                              <td>: {responseData.nama_dokter}</td>
                            </tr>
                            <tr>
                              <td>Nama Pasien</td>
                              <td>: {responseData.nama_pasien}</td>
                            </tr>
                          </>
                        )}
                        <tr>
                          <td>Rekam Medis</td>
                          <td>: {responseData.rm}</td>
                        </tr>
                      </tbody>
                    </table>
                    <table>
                      <tbody>
                        <tr>
                          <td>Kepada Yth:</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>{responseData.rumah_sakit}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>Jl. Dr. Moestopo No.6, Pasarjoyo</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>Kec. Tenggarong</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>Kabupaten Karawang</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>Kode Pos: 41361</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <table className="penguin">
                    <thead>
                      <tr>
                        <th><p>No</p></th>
                        {/* <th><p>KAT</p></th> */}
                        <th colSpan={2}>
                          <p>Nama Barang</p>
                        </th>
                        <th><p>Qty</p></th>
                        <th><p>H. Satuan</p></th>
                        <th><p>Diskon</p></th>
                        <th><p>Subtotal</p></th>
                      </tr>
                    </thead>
                    <tbody>
                      {responseData.item_detail_pi.map((item, index) => (
                        <tr key={item.id}>
                          <td><p>{index + 1}</p></td>
                          {/* <td><p>{item.kat}</p></td> */}
                          <td colSpan={2}><p>{item.nama_barang}</p></td>
                          <td><p>{item.quantity}</p></td>
                          <td><p>{item.harga_satuan}</p></td>
                          <td><p>{item.discount}%</p></td>
                          <td><p>{item.sub_total_item}</p></td>
                        </tr>
                      ))}

                      <tr>
                        <td colSpan={6} className="right-align"><p>Sub Total:</p></td>
                        <td><p>{responseData.sub_total}</p></td>
                      </tr>
                      <tr>
                        <td colSpan={6} className="right-align"><p>PPN 11%:</p></td>
                        <td><p>{responseData.pajak}</p></td>
                      </tr>
                      <tr>
                        <td colSpan={6} className="right-align"><strong><p>Total:</p></strong></td>
                        <td><strong><p>{responseData.total}</p></strong></td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="kangaroo">
                    <div className="monkey">
                      Terbilang: {responseData.terbilang}
                    </div>
                    <div className="rabbit">
                      Keterangan: {responseData.keterangan}
                    </div>

                    <div className="rabbit">
                      <div>Pembayaran dapat dilakukan dengan cara Transfer:</div>
                      <table className="table-auto mt-2">
                        <tbody>
                          <tr>
                            <td className="pr-2"><b>No. Rek </b></td>
                            <td>: <input type="number" placeholder="Nomor Rekening" style={{ height: "25px", width: "200px" }} /></td>
                          </tr>
                          <tr>
                            <td className="pr-2"><b>Atas Nama </b></td>
                            <td>
                              : <input type="text" placeholder="Nama Pemilik Rekening" style={{ height: "25px", width: "200px" }} />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                  </div>

                  <div className="koala">
                    <div className="panda">
                      Yang Menerima,<br />
                      <strong>Penanggung Jawab</strong>
                      <br />
                      <strong>{responseData.rumah_sakit}</strong>
                      <div className="dolphin2"></div>
                    </div>
                    <div className="bear">
                      Bandung, {responseData.tanggalAsli}<br />
                      <strong>PT Fismed Global Indonesia</strong>
                      <br />
                      <strong className="text-white"> .</strong>
                      <div className="dolphin"></div>
                      {/* <div>(Sonny Sonail)</div>
                      <div>General Manager</div> */}
                      <div>
                        <div style={{ textAlign: "right" }}>
                          <input type="text" placeholder="Nama Penanggung Jawab" style={{ textAlign: "right", height: "30px", width: "200px" }} />
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <input type="text" placeholder="Jabatan Penanggung Jawab" style={{ textAlign: "right", height: "30px", width: "200px" }} />
                        </div>
                      </div>
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
    </div>
  );


};

export default ProformaInvoiceDetail;

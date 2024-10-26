import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";


export default function ModalTambah() {

  const [nama_gudang, setNamaGudang] = useState<string>("")
  const [alamat_gudang, setAlamatGudang] = useState<string>("")
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const HandleTambahData = async(onClose: () => void) => {

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
              await axios.post(`${apiUrl}/gudang/tambah`, {
                nama_gudang,
                alamat_gudang,
              })
              onClose();
              Swal.fire("Nice!", "Data telah di input ke system!.", "success");
            } catch (error) {
              console.error("Error submitting data", error);
              Swal.fire(
                "Error!",
                "Terjadi kesalahan saat mengirim data.",
                "error",
              );
            }
          }
        });
      } catch (error) {
        console.error("Error processing request", error);
      }


      
  }

  return (
    <>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-black">Tambah Data Gudang!</ModalHeader>
            <ModalBody>
              <Input
                type="text"
                label="Nama Gudang"
                placeholder="Gudang X"
                labelPlacement="outside"
                value={nama_gudang}
                onChange={(e) => setNamaGudang(e.target.value)}
              />
              <Input
                type="text"
                label="Alamat Gudang"
                placeholder="Jln. Cokroaminoto"
                labelPlacement="outside"
                value={alamat_gudang}
                onChange={(e) => setAlamatGudang(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Tutup
              </Button>
              <Button color="primary" onPress={()=>HandleTambahData(onClose)}>
                Konfirmasi
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </>
  );
}
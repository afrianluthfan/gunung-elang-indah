import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";


export default function ModalTambah() {

  const [username, setNamaGudang] = useState<string>("")
  const [pw, setAlamatGudang] = useState<string>("")
  const [role, setRoleUser] = useState<string>("")
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const HandleTambahData = async (onClose: () => void) => {

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
            await axios.post(`${apiUrl}/akun/tambah`, {
              username,
              pw,
              role,
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
            <ModalHeader className="flex flex-col gap-1 text-black">Tambah Data Akun!</ModalHeader>
            <ModalBody>
              <Input
                type="text"
                label="Username"
                placeholder="Masukan Username !"
                labelPlacement="outside"
                value={username}
                onChange={(e) => setNamaGudang(e.target.value)}
              />
              <Input
                type="text"
                label="Password"
                placeholder="Masukan Password !"
                labelPlacement="outside"
                value={pw}
                onChange={(e) => setAlamatGudang(e.target.value)}
              />

              <Select
                label="Role"
                placeholder="Pilih Role Akun"
                labelPlacement="outside"
                className="max-w"
                onChange={(e) => setRoleUser(e.target.value)}
              >
                <SelectItem className="text-black" key="1" value="1">Sales</SelectItem>
                <SelectItem className="text-black" key="2" value="2">Admin</SelectItem>
                <SelectItem className="text-black" key="3" value="3">Logistik</SelectItem>
                <SelectItem className="text-black" key="4" value="4">Keuangan</SelectItem>
                <SelectItem className="text-black" key="5" value="5">Super Admin</SelectItem>              
              </Select>


            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Tutup
              </Button>
              <Button color="primary" onPress={() => HandleTambahData(onClose)}>
                Konfirmasi
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </>
  );
}
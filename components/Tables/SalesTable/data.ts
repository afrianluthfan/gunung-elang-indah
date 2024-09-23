import axios from "axios";
import { useState } from "react";

const columns = [
  { name: "NO.", uid: "number" },
  { name: "ID", uid: "id", sortable: true },
  { name: "KAT.", uid: "kat" },
  { name: "NAMA BARANG", uid: "name", sortable: true },
  { name: "QTY", uid: "qty", sortable: true },
  { name: "H. SATUAN", uid: "hsatuan", sortable: true },
  { name: "DISC", uid: "disc" },
  { name: "SUBTOTAL", uid: "subtotal", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Diterima", uid: "diterima" },
  { name: "Ditolak", uid: "ditolak" },
  { name: "Diproses", uid: "diproses" },
];

type ItemData = {
  id: number;
  kat: string;
  name: string;
  qty: string;
  hsatuan: string;
  disc: string;
  subtotal: string;
  status: string;
}[];

let users: ItemData = [];

const fetchItemData1 = async () => {
  try {
    const response = await axios.post(
      "http://209.182.237.155:8080/api/proforma-invoice/get-all-list",
      "",
    );
    users = response.data.map((item: any) => {
      return {
        ...users.find((user) => user.id === item.id),
        id: item.id,
        subtotal: item.subtotal,
        status: item.status,
      };
    });
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

const fetchItemData2 = async () => {
  try {
    const response = await axios.post(
      "http://209.182.237.155:8080/api/stock-barang/list",
      "",
    );
    users = response.data.map((item: any) => {
      return {
        ...users.find((user) => user.id === item.id),
        name: item.name,
        hsatuan: item.price,
      };
    });
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

const fetchAllData = () => {
  fetchItemData1();
  fetchItemData2();
};

fetchAllData();

// const users = [
//   {
//     id: 1,
// done
//     kat: "2021-10-10",
//     name: "John Doe",
// done
//     qty: "3",
//     hsatuan: "7500",
// done
//     disc: "1500",
//     subtotal: "18000",
// done
//     status:  "diterima",
// done
//   },
//   {
//     id: 2,
//     kat: "2021-10-10",
//     name: "Jane Smith",
//     qty: "2",
//     hsatuan: "10000",
//     disc: "2000",
//     subtotal: "18000",
//     status: "ditolak",
//   },
//   {
//     id: 3,
//     kat: "2021-10-10",
//     name: "Michael Johnson",
//     qty: "4",
//     hsatuan: "5000",
//     disc: "1000",
//     subtotal: "24000",
//     status: "diterima",
//   },
//   {
//     id: 4,
//     kat: "2021-10-10",
//     name: "Emily Davis",
//     qty: "1",
//     hsatuan: "15000",
//     disc: "3000",
//     subtotal: "12000",
//     status: "diproses",
//   },
//   {
//     id: 5,
//     kat: "2021-10-10",
//     name: "David Wilson",
//     qty: "3",
//     hsatuan: "8000",
//     disc: "1600",
//     subtotal: "24000",
//     status: "diterima",
//   },
//   {
//     id: 6,
//     kat: "2021-10-10",
//     name: "Sarah Thompson",
//     qty: "2",
//     hsatuan: "10000",
//     disc: "2000",
//     subtotal: "18000",
//     status: "ditolak",
//   },
//   {
//     id: 7,
//     kat: "2021-10-10",
//     name: "Daniel Anderson",
//     qty: "4",
//     hsatuan: "5000",
//     disc: "1000",
//     subtotal: "24000",
//     status: "diterima",
//   },
//   {
//     id: 8,
//     kat: "2021-10-10",
//     name: "Olivia Martinez",
//     qty: "1",
//     hsatuan: "15000",
//     disc: "3000",
//     subtotal: "12000",
//     status: "diproses",
//   },
//   {
//     id: 9,
//     kat: "2021-10-10",
//     name: "James Taylor",
//     qty: "3",
//     hsatuan: "8000",
//     disc: "1600",
//     subtotal: "24000",
//     status: "diterima",
//   },
//   {
//     id: 10,
//     kat: "2021-10-10",
//     name: "Sophia Hernandez",
//     qty: "2",
//     hsatuan: "10000",
//     disc: "2000",
//     subtotal: "18000",
//     status: "ditolak",
//   },
// ];

export { columns, users, statusOptions, fetchAllData };

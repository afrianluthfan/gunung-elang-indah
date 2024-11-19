import { Button, Divider, Input, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type SalesData = {
  customer: string;
  nama_barang: string;
  quantity: string;
  tanggal_terjual: string;
};

type BarangData = {
  nama_barang: string;
};

type CustomerData = {
  id: number;
  name: string;
  address_company: string;
  docktor_name: string;
  kategori_divisi: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const MainContent = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [filteredData, setFilteredData] = useState<SalesData[]>([]);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [barangList, setBarangList] = useState<BarangData[]>([]);
  const [customerList, setCustomerList] = useState<CustomerData[]>([]);

  // State untuk Filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [namaBarang, setNamaBarang] = useState("");
  const [namaCustomer, setNamaCustomer] = useState("");
  const [totalBarangTerjual, setTotalBarangTerjual] = useState(0);

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchBarangList = async () => {
    try {
      const response = await axios.post(`${apiUrl}/stok/list-proses`);
      const uniqueBarang = Array.from(new Set(response.data.data.map((item: any) => item.nama)))
        .map((nama, index) => ({ nama_barang: nama, id: index.toString() }));
      setBarangList(uniqueBarang as BarangData[]);
    } catch (error) {
      console.error('Error fetching barang list:', error);
    }
  };

  const fetchCustomerList = async () => {
    try {
      const response = await axios.post(`${apiUrl}/proforma-invoice/rs-list`);
      setCustomerList(response.data.data);
    } catch (error) {
      console.error('Error fetching customer list:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.post(`${apiUrl}/barang-terjual`, {
        start_date: startDate || "",
        end_date: endDate || "",
        nama_barang: namaBarang || "",
        nama: namaCustomer || "",
      });

      const data = response.data.data;
      const quantityData = data.map((item: SalesData) => parseInt(item.quantity));
      const dateLabels = data.map((item: SalesData) => item.tanggal_terjual);

      setTotalBarangTerjual(response.data.total_barang_terjual);
      setSalesData(data);
      setFilteredData(data);
      setQuantities(quantityData);
      setLabels(dateLabels);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchBarangList();
    fetchCustomerList();
  }, []);

  const applyFilter = () => {
    fetchData();
  };

  // Fungsi untuk Pagination
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Jumlah Penjualan",
        data: quantities,
        borderColor: "#3085d6",
        backgroundColor: "rgba(48, 133, 214, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="z-50 flex h-full w-full flex-col gap-6 bg-white p-8 mb-4">
      <h1 className="text-lg font-bold mb-4 lg:text-[2vh]">Data Penjualan</h1>

      <div className="mb-8" style={{ width: "100%", height: "300px", margin: "0 auto" }}>
        <Line data={chartData} options={options} />
      </div>

      <Divider />

      <div className="flex flex-col lg:flex-row justify-between gap-2 ">
        <Autocomplete
          label="Nama Barang"
          placeholder="Cari nama barang..."
          defaultItems={barangList}
          fullWidth
          onSelectionChange={(value) => setNamaBarang(value as string)}
          classNames={{
            listboxWrapper: "bg-white"
          }}
          className="text-black"
        >
          {(item) => (
            <AutocompleteItem key={item.nama_barang} value={item.nama_barang} className="text-black">
              {item.nama_barang}
            </AutocompleteItem>
          )}
        </Autocomplete>

        <Autocomplete
          label="Nama Customer"
          placeholder="Cari nama customer..."
          defaultItems={customerList}
          fullWidth
          onSelectionChange={(value) => setNamaCustomer(value as string)}
          classNames={{
            listboxWrapper: "bg-white",
            base: "w-auto min-w-fit"
          }}
          className="text-black"
          
        >
          {(item) => (
            <AutocompleteItem
              key={item.name}
              value={item.name}
              className="text-black whitespace-nowrap"
            >
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Input
          type="date"
          label="Tanggal Awal"
          value={startDate}
          fullWidth
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="date"
          label="Tanggal Akhir"
          value={endDate}
          fullWidth
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button className="px-12 py-7 text-lg" color="primary" onClick={applyFilter}>
          Terapkan
        </Button>
      </div>

      <Divider />
      <h1 className="text-lg font-bold my-2 ">Barang yang terjual : {totalBarangTerjual}</h1>

      <div className="shadow-md rounded-lg ">
        <Table aria-label="Data Penjualan" removeWrapper>
          <TableHeader>
            <TableColumn className="bg-blue-900 text-white">No</TableColumn>
            <TableColumn className="bg-blue-900 text-white">Nama Customer</TableColumn>
            <TableColumn className="bg-blue-900 text-white">Nama Barang</TableColumn>
            <TableColumn className="bg-blue-900 text-white">Quantity</TableColumn>
            <TableColumn className="bg-blue-900 text-white">Tanggal Terjual</TableColumn>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.customer}</TableCell>
                <TableCell>{item.nama_barang}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.tanggal_terjual}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mb-4 ">
        <Button className="bg-yellow-500 text-white" disabled={currentPage === 1} onClick={handlePrevPage}>
          ← Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button className="bg-green-500 text-white" disabled={currentPage === totalPages} onClick={handleNextPage}>
          Next →
        </Button>
      </div>

      <div>
        <hr className="border-t-2 border-gray-300 my-4" />
        <h1 className="text-sm font-bold mb-4 text-center">Support By Gunung Elang Indah</h1>
      </div>
    </div>
  );
};

export default MainContent;
import operasiData from "../../../data/operasi.json";

type Operasi = {
  kode: string;
  nama: string;
  asal: string;
  jadwal: string;
  ruangan: string;
  diagnosa: string;
  tindakan: string;
  dokter: string;
};

const DATA: Operasi[] = operasiData;

export default function PenjadwalanPage() {
  return (
    <>
      <h1 className="page-title">Penjadwalan Operasi</h1>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Kode Rekam Medis</th>
              <th scope="col">Nama</th>
              <th scope="col">Asal</th>
              <th scope="col">Jadwal</th>
              <th scope="col">Ruangan</th>
              <th scope="col">Diagnosa</th>
              <th scope="col">Tindakan</th>
              <th scope="col">Dokter Operator</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map((row) => (
              <tr key={row.kode}>
                <td>{row.kode}</td>
                <td>{row.nama}</td>
                <td>{row.asal}</td>
                <td>{row.jadwal}</td>
                <td>{row.ruangan}</td>
                <td>{row.diagnosa}</td>
                <td>{row.tindakan}</td>
                <td>{row.dokter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
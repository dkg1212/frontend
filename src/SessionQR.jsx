import { useParams } from "react-router-dom";
import ShowQR from "./ShowQR";

export default function SessionQR() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user-info"));

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Live Class QR</h1>
      <ShowQR sessionId={id} token={user.token} />
    </div>
  );
}

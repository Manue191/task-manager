import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login";
import Registro from "./pages/Registro/Registro";
import ListaDeTareas from "./pages/TaskList/ListaDeTareas";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/tareas" element={<ListaDeTareas />} />
      </Routes>
    </Router>
  );
}

export default App;

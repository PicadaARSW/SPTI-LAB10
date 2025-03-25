import React, { useState, useRef, useCallback } from "react";
import Modal from "react-modal";
import "./Blueprints.css";

Modal.setAppElement("#root");

interface Point {
  x: number;
  y: number;
}

interface Blueprint {
  name: string;
  points: Point[];
  author: string;
}

const Blueprints = () => {
  const [author, setAuthor] = useState<string>("");
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(
    null
  );
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const canvasReference = useRef<HTMLCanvasElement | null>(null);

  // Función para obtener los blueprints de un autor
  const handleGetBlueprints = async () => {
    console.log(`Buscando planos de: ${author}`);
    try {
      const response = await fetch(
        `http://localhost:8080/blueprints/${author}`
      );
      if (response.ok) {
        const data: Blueprint[] = await response.json();
        setBlueprints(data);
        setSelectedBlueprint(null);

        setSelectedBlueprint(null);

        const total = data.reduce(
          (sum: number, blueprint: Blueprint) =>
            sum + (blueprint.points?.length || 0),
          0
        );
        setTotalPoints(total);

        setError(null); // Limpiar errores previos
      } else if (response.status === 404) {
        setBlueprints([]);
        setError("No se encontraron blueprints para el autor ingresado");
      }
    } catch (err: any) {
      console.error("Error obteniendo blueprints:", err);

      setError(err.message);
      setBlueprints([]);
      setTotalPoints(0);
    }
  };

  const openBluePrintDraw = useCallback((blueprint: Blueprint) => {
    const canvas = canvasReference.current;
    if (!canvas || !blueprint) return;
    const ctx: CanvasRenderingContext2D = canvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // blueprint have at least one point
    if (blueprint.points.length === 0) return;

    // calculate the scale to draw the blueprint in the canvas
    const margin = 10;
    const Yvalues = blueprint.points.map((point) => point.y);
    const Xvalues = blueprint.points.map((point) => point.x);
    const maxY = Math.max(...Yvalues);
    const minY = Math.min(...Yvalues);
    const maxX = Math.max(...Xvalues);
    const minX = Math.min(...Xvalues);
    const scale = Math.min(
      (canvas.width - margin) / (maxX - minX || 1),
      (canvas.height - margin) / (maxY - minY || 1)
    );

    //transform coordinates to draw the blueprint in the canvas
    const transcoord = (coord: number, min: number, scale: number) =>
      (coord - min) * scale + margin;

    // Draw the blueprint
    ctx.beginPath();
    ctx.moveTo(
      transcoord(blueprint.points[0].x, minX, scale),
      transcoord(blueprint.points[0].y, minY, scale)
    );
    blueprint.points.slice(1).forEach((point) => {
      ctx.lineTo(
        transcoord(point.x, minX, scale),
        transcoord(point.y, minY, scale)
      );
    });
    ctx.strokeStyle = "#3498db";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the points
    blueprint.points.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(
        transcoord(point.x, minX, scale),
        transcoord(point.y, minY, scale),
        3,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = index === 0 ? "#2ecc71" : "#e74c3c";
      ctx.fill();
    });
  }, []);

  const openModal = useCallback((blueprint: Blueprint) => {
    setSelectedBlueprint(blueprint);
    setModalIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
  }, []);

  return (
    <div>
      <h1>Gestión de Blueprints</h1>

      {/* Campo para capturar el autor */}
      <input
        type="text"
        placeholder="Ingrese el nombre del autor"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <button onClick={handleGetBlueprints}>Get Blueprints</button>

      {/* Mostrar error si existe */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Mostrar nombre del autor seleccionado */}
      {blueprints.length > 0 && (
        <>
          <h2>Autor: {author}</h2>

          <table border={1}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Puntos</th>
                <th>Plano</th>
              </tr>
            </thead>
            <tbody>
              {blueprints.map((bp) => (
                <tr key={bp.name}>
                  <td>{bp.name}</td>
                  <td>{bp.points.length}</td>
                  <td>
                    <button onClick={() => openModal(bp)}>Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Total de puntos: {totalPoints}</h3>
        </>
      )}
      <div className="modal-container">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Selected Blueprint"
          className="modal"
          overlayClassName="overlay"
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              padding: "15px",
              borderRadius: "10px",
              maxWidth: "100%",
              maxHeight: "100%",
            },
          }}
          onAfterOpen={() => {
            if (selectedBlueprint) {
              openBluePrintDraw(selectedBlueprint);
            }
          }}
        >
          <div className="modal-content">
            <h2>{selectedBlueprint?.name}</h2>
            <canvas
              ref={canvasReference}
              width={600}
              height={500}
              style={{ border: "1px solid #000" }}
            ></canvas>
            <div className="buttons">
              {/* Botones de acción para el proximo laboratorio
              <button>Crear Blueprint</button>
              <button>Guardar/Actualizar</button>
              <button>Eliminar</button>
              */}
              <button onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Blueprints;
